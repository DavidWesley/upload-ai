import { FastifyInstance } from "fastify"

import { openai } from "@/lib/openai.ts"
import { prisma } from "@/lib/prisma.ts"
import { downloadFileStream } from "@/lib/storage.ts"
import { createTranscriptionBodySchema, createTranscriptionParamsSchema } from "@/schemas/zod.ts"
import { StatusCodes } from "@/utils/constants/http-status-code.ts"
import { toFile } from "openai"

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

    const audioBlob = await downloadFileStream("nlw-ia-audio-storage", video.path)

    if (!audioBlob.data) {
      return res.status(StatusCodes.FAILED_DEPENDENCY).send({ error: "Uncovered error" })
    }

    const file = await toFile(audioBlob.data, video.name, {
      lastModified: Date.parse(video.createdAt.toISOString()),
      type: "audio/mpeg",
    })

    const result = await openai.audio.transcriptions.create(
      {
        file: file,
        model: "whisper-1",
        language: "pt",
        response_format: "json",
        temperature: 0,
        prompt,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
      }
    )

    const transcription = result.text
    if (!transcription) {
      return res.status(StatusCodes.EXPECTATION_FAILED).send({ error: "Não foi possível gerar uma transcrição" })
    }

    await prisma.video.update({
      where: {
        id: videoID,
      },
      data: {
        transcription,
      },
    })

    return res.status(StatusCodes.CREATED).send(transcription)
  })
}
