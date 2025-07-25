import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple authentication simulation
    if (email && password) {
      navigate("/")
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-hover items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold">Parceiros</h1>
              <p className="text-white/80">IniciativaCoerente</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Bem-vindo ao Parceiros.IniciativaCoerente</h2>
          <p className="text-white/80 text-lg max-w-md">
            Gerencie seus contratos, ocorrências e pedidos de forma eficiente e moderna.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
                <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-bold text-foreground">Parceiros</h1>
                  <p className="text-muted-foreground text-sm">IniciativaCoerente</p>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Entrar na sua conta</CardTitle>
              <CardDescription>Insira suas credenciais para acessar o sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    className="h-12"
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary-hover"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold">
                  Entrar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}