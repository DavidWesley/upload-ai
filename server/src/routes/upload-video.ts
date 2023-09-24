import { fastifyMultipart } from "@fastify/multipart"
import { FastifyInstance } from "fastify"

import { prisma } from "@/lib/prisma"
import { uploadPublicFile } from "@/lib/storage"
import { StatusCodes } from "@/utils/constants/http-status-code"
import { MEMORY_SIZE } from "@/utils/constants/memory-sizes"
import { generateSafeFilename, hasValidExtension } from "@/utils/file-handler"

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: MEMORY_SIZE.MB * 25, // 25MB
      files: 1,
    },
    throwFileSizeLimit: true,
  })

  app.post("/videos", async (req, res) => {
    if (!req.isMultipart()) {
      res.code(StatusCodes.BAD_REQUEST).send({ error: "Request is not multipart" })
      return
    }

    const data = await req.file()
    if (!data) {
      return res.status(StatusCodes.BAD_REQUEST).send({ error: "Missing file input." })
    }

    if (!hasValidExtension(data.filename, [".mp3"])) {
      return res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).send({ error: "Invalid input type, please upload a MP3." })
    }

    const fileUploadURL = await uploadPublicFile(
      "nlw-ia-audio-storage",
      data.mimetype,
      data.file,
      generateSafeFilename(data.filename)
    )

    if (fileUploadURL.error) {
      console.log(fileUploadURL.error.message)
      return res.status(StatusCodes.INSUFFICIENT_STORAGE).send({ error: fileUploadURL.error.message })
    }

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: fileUploadURL.data.path,
      },
    })

    return res.status(StatusCodes.CREATED).send({ video })
  })
}
