import { ENV } from "@/lib/env.ts"
import { createClient } from "@supabase/supabase-js"
import { File } from "node:buffer"
import path from "node:path"
import { ReadableStream } from "node:stream/web"

const supabase = createClient(ENV.SUPABASE_PROJECT_URL, ENV.SUPABASE_API_KEY, {
  auth: {
    persistSession: false,
  },
})

type FileLike =
  // | ArrayBuffer
  // | ArrayBufferView
  // | Blob
  // | Buffer
  File | NodeJS.ReadableStream | ReadableStream<Uint8Array> | string

// Upload a public file using standard upload
export async function uploadPublicFile(bucket: string, type: string, body: FileLike, filename: string) {
  // const absoluteFilePath = path.join(getStoragePath(), "public/tmp/", filename)
  const relativeFilepath = path.join("public/tmp/", filename)

  return await supabase
    .storage
    .from(bucket)
    .upload(relativeFilepath, body, {
      upsert: false,
      cacheControl: "3600",
      contentType: type,
      duplex: "half",
    })
}

// deleteFilesFromBucket("nlw-ia-audio-storage", "/public/tmp/*")
export async function deleteFilesFromBucket(bucket: string, filepaths: string[]) {
  return await supabase
    .storage
    .from(bucket)
    .remove(filepaths)
}

export async function listPublicFilesInBucket(bucket: string, relativeFolderPath: string) {
  return await supabase
    .storage
    .from(bucket)
    .list(relativeFolderPath, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    })
}

export async function emptyFolder(bucket: string, relativeFolderPath: string) {
  const files = await listPublicFilesInBucket(bucket, relativeFolderPath)
  if (files.data) {
    const filepaths = files.data.map(({ name }) => `${relativeFolderPath}/${name}`)

    await deleteFilesFromBucket(bucket, filepaths)
  }
}

export function getFilePublicURL(bucket: string, filepath: string, options?: { download?: string | boolean }) {
  return supabase
    .storage
    .from(bucket)
    .getPublicUrl(filepath, options)
    .data
    .publicUrl
}

export async function downloadFileStream(bucket: string, filepath: string) {
  return await supabase
    .storage
    .from(bucket)
    .download(filepath)
}

// function getStoragePath(): string {
//   const STORAGE_URL = ENV["STORAGE_URL"]
//   // https://jeiuhlhyfxwfsghotyou.supabase.co/storage/v1/object/public/nlw-ia-audio-storage/public/output.mp3-f71f8a36-15c0-46c2-a0e3-9f410eaa542a.mp3

//   if (STORAGE_URL) {
//     return STORAGE_URL
//   } else {
//     throw new Error("Invalid storage path config error")
//   }
// }
