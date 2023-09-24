import { randomUUID } from "node:crypto"
import path from "node:path"

// import { pipeline } from "node:stream"
// import { promisify } from "node:util"
// const pump = promisify(pipeline)

// function createDir(destination: PathLike): void {
//   if (!fs.existsSync(destination)) fs.mkdirSync(destination)
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateSafeFilename(filename: string): string {
  filename = path.normalize(filename.toLowerCase())
  const extname = path.extname(filename)
  const basename = path.basename(filename, extname)
  return `${basename}-${randomUUID()}${extname}`
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
