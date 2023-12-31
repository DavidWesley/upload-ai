import { ENV } from "@/lib/env.ts"
import { PrismaClient } from "@prisma/client"
import type { Prisma } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: [
    { emit: "event", level: "query" },
    { emit: "stdout", level: "error" },
    { emit: "stdout", level: "info" },
    { emit: "stdout", level: "warn" },
  ],
  errorFormat: "pretty",
}

const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "stdout", level: "error" },
      { emit: "stdout", level: "info" },
      { emit: "stdout", level: "warn" },
    ],
    errorFormat: "pretty",
  })

if (ENV["NODE_ENV"] !== "production") globalThis.prisma = prisma

export { prisma }
