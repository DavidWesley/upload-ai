import { FastifyInstance } from "fastify"
import fs from "node:fs"
import path from "node:path"
import stream from "node:stream"
import url from "node:url"

import { openai } from "@/lib/openai"
import { prisma } from "@/lib/prisma"
import { downloadFileStream } from "@/lib/storage"
import { createTranscriptionBodySchema, createTranscriptionParamsSchema } from "@/schemas/zod"
import { StatusCodes } from "@/utils/constants/http-status-code"
import { TimeUnits } from "@/utils/constants/time-units"

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post("/videos/:videoID/transcription", async (req, res) => {
    const params = createTranscriptionParamsSchema.safeParse(req.params)
    const body = createTranscriptionBodySchema.safeParse(req.body)

    if (params.success === false) {
      return res.status(StatusCodes.BAD_REQUEST).send({ error: "Invalid body" })
    }

    if (body.success === false) {
      return res.status(StatusCodes.BAD_REQUEST).send({ error: "Invalid params" })
    }

    const { videoID } = params.data
    const { prompt } = body.data

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoID,
      },
    })

    // const audioDownloadPath = getFilePublicURL("nlw-ia-audio-storage", video.path, { download: true })
    const audioBlob = await downloadFileStream("nlw-ia-audio-storage", video.path)

    if (!audioBlob.data) {
      return res.status(StatusCodes.FAILED_DEPENDENCY).send({ error: "Uncovered error" })
    }

    const __filename = url.fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const audioLocalPath = path.resolve(__dirname, "../../tmp/audios", `audio-${videoID}.mp3`)

    await stream.Readable.fromWeb(audioBlob.data.stream()).pipe(fs.createWriteStream(audioLocalPath))

    const result = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioLocalPath),
      model: "whisper-1",
      language: "pt",
      response_format: "json",
      temperature: 0,
      prompt,
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    })

    const transcription = result.text
    if (transcription) {
      await prisma.video.update({
        where: {
          id: videoID,
        },
        data: {
          transcription,
        },
      })
    } else {
      res.status(StatusCodes.EXPECTATION_FAILED).send({ error: "Não foi possível gerar uma transcrição" })
    }

    fs.promises.rm(audioLocalPath, {
      force: true,
      recursive: true,
      retryDelay: TimeUnits.CONSTANTS.second * 5,
      maxRetries: 4,
    })

    return res.status(StatusCodes.CREATED).send(transcription ?? "Não foi possível gerar uma transcrição")
  })
}
