import { fastifyCors } from "@fastify/cors"
import { fastifyRateLimit } from "@fastify/rate-limit"
import { fastify } from "fastify"
import { StatusCodes } from "http-status-codes"

import { ENV } from "@/lib/env.ts"
import { logger } from "@/lib/logging.ts"
import { createTranscriptionRoute } from "@/routes/create-transcription.ts"
import { generateAiCompletionRoute } from "@/routes/generate-ai-completion.ts"
import { getAllPromptsRoute } from "@/routes/get-all-prompts.ts"
import { uploadVideoRoute } from "@/routes/upload-video.ts"
import { TimeUnits } from "@/utils/constants/time-units.ts"

const app = fastify({
  logger: logger[ENV.NODE_ENV] ?? false,
  requestTimeout: TimeUnits.CONSTANTS.second * 40, // 40 seconds
  caseSensitive: true,
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
  forceCloseConnections: "idle",
})

app.register(fastifyCors, {
  origin: "*",
})

app.register(fastifyRateLimit, {
  global: true,
  max: 10,
  ban: 3,
  timeWindow: TimeUnits.CONSTANTS.second * 5, // 5 seconds
  continueExceeding: false,
})

app.get("/check", (_, res) => {
  return res.status(StatusCodes.OK).send()
})

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAiCompletionRoute)

const HOST = "RENDER" in process.env ? "0.0.0.0" : "localhost"

app.listen(
  {
    port: ENV.PORT,
    host: HOST,
  },
  (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.info(`server listening on ${address}`)
  }
)
