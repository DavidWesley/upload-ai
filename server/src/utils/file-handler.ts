import { randomUUID } from "node:crypto"
import path from "node:path"

// import { pipeline } from "node:stream"
// import { promisify } from "node:util"
// const pump = promisify(pipeline)

// function createDir(destination: PathLike): void {
//   if (!fs.existsSync(destination)) fs.mkdirSync(destination)
// }

export function generateSafeFilename(filename: string, prefix?: string, maxLength: number = 255): string {
  prefix = prefix || ""
  filename = path.normalize(filename.toLowerCase())
  maxLength = Math.abs(maxLength)

  const uuid = randomUUID()
  const extname = path.extname(filename)

  const fullName = [prefix, filename.substr(0, Math.min(maxLength - (prefix.length + uuid.length + extname.length), 0)), uuid]
    .filter(Boolean)
    .join("-")
    .concat(extname)

  if (maxLength < fullName.length) {
    throw new Error(`Size can not be less than ${fullName.length}`)
  }

  return fullName
}

export function hasValidExtension(filename: string, exts: Array<`.${string}`>): boolean {
  return exts.map((suffix) => suffix.toLowerCase()).includes(path.extname(filename).toLowerCase())
}

// export async function saveFile<R extends Readable>(data: R | string, filename: string): Promise<PathLike> {
//   const destination = getStoragePath().toString()
//   const resolvedUploadFilePath = path.resolve(destination, filename)

//   // await pump(data, fs.createWriteStream(resolvedUploadFilePath))
//   await pipeline(data, fs.createWriteStream(resolvedUploadFilePath))

//   return resolvedUploadFilePath
// }
