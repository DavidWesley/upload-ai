import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ModeToggle} from "@/components/mode-toggle"

import Icons from "@/components/icons"

interface NavProps extends React.ComponentPropsWithoutRef<'nav'> { }

export function Nav({ className, ...rest }: NavProps) {
  return (
    <nav className={className} {...rest}>
      <Brand />

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Desenvolvido com 💜 no NLW da Rocketseat</span>

        <Separator orientation="vertical" className="h-6" />

        <a href="https://github.com/DavidWesley/">
          <Button variant="outline">
            <Icons.Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </a>

        <ModeToggle />
      </div>
    </nav>
  )
}
