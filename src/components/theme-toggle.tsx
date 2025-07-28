import { Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  return (
    <Button 
      variant="outline" 
      size="icon"
      disabled
      className="opacity-50 cursor-not-allowed"
    >
      <Moon className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Modo escuro ativo</span>
    </Button>
  )
}