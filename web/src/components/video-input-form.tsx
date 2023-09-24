import Icons from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/axios"
import { getFFmpeg } from "@/lib/ffmpeg"
import { fetchFile } from "@ffmpeg/util"
import React, { useMemo, useRef, useState } from "react"

type Status = "waiting" | "converting" | "uploading" | "generating" | "success" | "error"

const statusMessages = {
  converting: "Convertendo...",
  generating: "Transcrevendo...",
  uploading: "Carregando...",
  success: "Sucesso!",
  error: "Erro!",
}

interface VideoInputFormProps {
  onVideoUploaded: (id: string) => void
  onTranscriptionGenerated: (text: string) => void
}

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>("waiting")
  const [progress, setProgress] = useState<number>(0)
  const { toast } = useToast()

  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) {
      setVideoFile(null)
      setStatus("waiting")
      return
    }

    setVideoFile(files[0])
    setStatus("waiting")
    setProgress(0)
  }

  async function convertVideoToAudio(video: File) {
    const ffmpeg = await getFFmpeg()
    await ffmpeg.writeFile("input.mp4", await fetchFile(video))

    // ffmpeg.on('log', log => {})

    ffmpeg.on("progress", (info) => {
      const percentage = Math.round(info.progress * 100)
      setProgress(percentage)
    })

    await ffmpeg.exec(["-i", "input.mp4", "-map", "0:a", "-b:a", "20k", "-acodec", "libmp3lame", "output.mp3"])

    const data = await ffmpeg.readFile("output.mp3")
    const audioFileBlob = new Blob([data], { type: "audio/mpeg" })
    const audioFile = new File([audioFileBlob], "output.mp3", { type: "audio/mpeg" })

    return audioFile
  }

  async function handleUploadVideo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!videoFile) return

    setStatus("converting")

    const audioFile = await convertVideoToAudio(videoFile)
    const data = new FormData()
    data.append("file", audioFile)

    setStatus("uploading")

    let response
    try {
      response = await api.post("/videos", data, {
        timeout: 30_000,
      })
    } catch (error) {
      console.error("Axios Request Error:", error)
      setStatus("error")

      toast({
        title: "Upload Error",
        description: "Nossa IA tirou um tempo pra descansar. Por favor, tente novamente mais tarde",
        variant: "destructive",
      })

      return
    }

    setStatus("generating")

    const videoID = response.data.video.id
    let transcription
    try {
      transcription = await api.post(
        `/videos/${videoID}/transcription`,
        {
          prompt: promptInputRef.current?.value,
        },
        { timeout: 120_000 }
      )
    } catch (error) {
      console.error("Axios Request Error:", error)
      setStatus("error")

      toast({
        title: "Transcription Error",
        description: "Nossa IA tirou um tempo pra descansar. Por favor, tente novamente mais tarde",
        variant: "destructive",
      })

      return
    }

    setStatus("success")

    props.onTranscriptionGenerated(transcription.data)
    props.onVideoUploaded(videoID)

    // toast({
    //   description: "Transcrição de áudio gerada com sucesso!",
    //   variant: "default",
    // })
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return null

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <Label htmlFor="video" className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5 relative peer-disabled:cursor-wait">
        {previewURL ? (
          <video src={previewURL} autoPlay={false} controls={false} className="pointer-events-none inset-0" />
        ) : (
          <>
            <Icons.FileVideo className="w-4 h-4" />
            Selecione um vídeo de até <Badge variant="secondary">25 MB</Badge>
          </>
        )}
      </Label>

      <Input type="file" id="video" accept="video/mp4" className="peer sr-only w-0" onChange={handleFileSelected} disabled={["converting", "uploading", "generating"].includes(status)} required />

      <Separator orientation="horizontal" />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea ref={promptInputRef} id="transcription_prompt" className="h-20 leading-relaxed resize-none" placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)" required />
      </div>

      <Button
        data-success={status === "success"}
        data-error={status === "error"}
        disabled={status !== "waiting" || !videoFile}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400 data-[error=true]:bg-red-600 disabled:cursor-not-allowed"
      >
        {status === "waiting" ? (
          <>
            Carregar video
            <Icons.Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>

      {progress !== 0 && status !== "success" && status !== "error" ? <Progress max={100} defaultValue={0} value={progress} /> : null}
    </form>
  )
}
