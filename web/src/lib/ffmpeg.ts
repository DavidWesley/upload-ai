import { isRunningVite, isSafeContext } from "@/lib/utils"

import { FFmpeg } from "@ffmpeg/ffmpeg"
import { toBlobURL } from "@ffmpeg/util"

let ffmpeg: FFmpeg | null

const CORE_VERSION = "0.12.2"
const MODULE_NAME = isRunningVite() ? "esm" : "umd"
const MULTI_THREAD_PKG_NAME = "core-mt"
const SINGLE_THREAD_PKG_NAME = "core"
const PACKAGE_NAME = isSafeContext() ? MULTI_THREAD_PKG_NAME : SINGLE_THREAD_PKG_NAME

const FFMPEG_BASE_URL = `https://unpkg.com/@ffmpeg/${PACKAGE_NAME}@${CORE_VERSION}/dist/${MODULE_NAME}`

export async function getFFmpeg() {
  if (ffmpeg) {
    return ffmpeg
  }

  ffmpeg = new FFmpeg()

  if (!ffmpeg.loaded) {
    switch (PACKAGE_NAME) {
      case "core-mt": {
        await ffmpeg.load({
          coreURL: await toBlobURL(`${FFMPEG_BASE_URL}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${FFMPEG_BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
          workerURL: await toBlobURL(`${FFMPEG_BASE_URL}/ffmpeg-core.worker.js`, "text/javascript"),
        })

        break
      }
      case "core": {
        await ffmpeg.load({
          coreURL: await toBlobURL(`${FFMPEG_BASE_URL}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${FFMPEG_BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
        })

        break
      }
    }
  }

  return ffmpeg
}

// const transcode = async () => {
//   const ffmpeg = await getFFmpeg()
//   await ffmpeg.writeFile('input.webm', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'));
//   await ffmpeg.exec(['-i', 'input.webm', 'output.mp4']);
//   const data = await ffmpeg.readFile('output.mp4');

//   const src = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
// }
