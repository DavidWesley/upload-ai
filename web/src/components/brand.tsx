import Icons from "@/components/icons"

export function Brand() {
  return (
    <a className="flex flex-row gap-2 items-center justify-between" href="/">
      <Icons.Upload className="w-6 h-6 text-purple-600" />
      <h1 className="text-xl font-bold">upload.ai</h1>
    </a>
  )
}