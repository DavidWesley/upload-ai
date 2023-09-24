import { OpenAIStream, streamToResponse } from "ai"
import { FastifyInstance } from "fastify"

import { openai } from "@/lib/openai"
import { prisma } from "@/lib/prisma"

import { generateAiCompletionPostBodySchema } from "@/schemas/zod"
import { StatusCodes } from "@/utils/constants/http-status-code"

export async function generateAiCompletionRoute(app: FastifyInstance) {
  app.post("/ai/complete", async (req, res) => {
    const body = generateAiCompletionPostBodySchema.safeParse(req.body)
    if (body.success === false) {
      return res.status(StatusCodes.BAD_REQUEST).send({ error: "Invalid body" })
    }

    const { videoID, prompt, temperature } = body.data
    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoID,
      },
    })

    if (video.transcription === null) {
      return res.status(StatusCodes.BAD_REQUEST).send({ error: "Video transcription was not generated yet." })
    }

    const promptMessage = prompt.replace("{transcription}", video.transcription)

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      temperature,
      messages: [{ role: "user", content: promptMessage }],
      stream: true,
    })

    const stream = OpenAIStream(response)

    streamToResponse(stream, res.raw, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    })
  })
}
