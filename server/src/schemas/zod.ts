import { z } from "zod"

export const createTranscriptionParamsSchema = z.object({
  videoID: z.string().uuid(),
})

export const createTranscriptionBodySchema = z.object({
  prompt: z.string(),
})

export const generateAiCompletionPostBodySchema = z.object({
  videoID: z.string().uuid(),
  prompt: z.string(),
  temperature: z.number().min(0).max(1).default(0.5),
})
