import { ENV } from "@/lib/env.ts"
import { OpenAI } from "openai"

export const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
  maxRetries: 0
})
