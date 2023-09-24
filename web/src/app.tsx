import { useState } from "react"

import Icons from "@/components/icons"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PromptSelect } from "@/components/ui/prompt-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { VideoInputForm } from "@/components/video-input-form"

import { API_BASE_URL } from "@/lib/env"
import { useCompletion } from "ai/react"

export function App() {
  const [temperature, setTemperature] = useState<number>(0.5)
  const [videoID, setVideoID] = useState<string | null>(null)
  const [transcription, setTranscription] = useState<string>("")

  const { input, setInput, handleInputChange, handleSubmit, completion, isLoading } = useCompletion({
    api: `${API_BASE_URL}/ai/complete`,
    body: {
      videoID,
      temperature,
    },
    headers: {
      "Content-Type": "application/json",
    },
  })

  return (
    <div className="min-h-screen flex flex-col container">
      <Nav className="px-6 py-3 flex items-center justify-between border-b sticky" />

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-3 gap-4 flex-1">
            <Textarea className="resize-none p-4 leading-relaxed" placeholder="Transcrição do vídeo..." value={transcription} />
            <Textarea className="resize-none p-4 leading-relaxed" placeholder="Inclua o prompt para a IA saber o que você espera que ela faça com a transcrição gerada..." value={input} onChange={handleInputChange} />
            <Textarea className="resize-none p-4 leading-relaxed" placeholder="Resultado gerado pela IA" value={completion} readOnly />
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável <code className="text-violet-400">{`{transcription}`}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.
          </p>
        </div>

        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoID} onTranscriptionGenerated={setTranscription} />

          <Separator orientation="horizontal" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Prompts automáticos</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-sm text-muted-foreground italic">Você poderá customizar essa opção em breve</span>
            </div>

            <Separator orientation="horizontal" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Temperatura</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-center text-sm text-muted-foreground hover:border-border align-middle">{temperature}</span>
              </div>
              <Slider min={0} max={1} step={0.1} value={[temperature]} onValueChange={(value) => setTemperature(value[0])} />
              <span className="block text-sm text-muted-foreground italic leading-relaxed">Valores mais altor tendem a deixar o resultado mais criativo e com possíveis erros.</span>
            </div>

            <Separator orientation="horizontal" />

            <Button disabled={isLoading === true} type="submit" className="w-full">
              Executar
              <Icons.Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}
