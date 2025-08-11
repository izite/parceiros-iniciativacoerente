import { useState } from "react"
import { Search, Calendar, FileText, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Mock data for comunicados
const comunicadosData = [
  {
    id: 1,
    titulo: "Alteração de Preços – Comunicado 10/25",
    descricao: "Caros Parceiros, informamos que a partir de amanhã, dia 08/08/2025, o tarifário YesEnergy será alterado. Todos os contratos que se encontrem pendentes com as campanhas...",
    data: "7 de agosto • 2025/100",
    categoria: "Preços",
    empresa: "YES Energy",
    anexos: 1
  },
  {
    id: 2,
    titulo: "Novo Tarifário Preços Fixos Electricidade Agosto 2025",
    descricao: "Caros Parceiros, serve o presente comunicado para informar dos preços fixos que vigorarão para este mês de Agosto. (valores...",
    data: "5 de agosto • 2025/98",
    categoria: "Tarifários",
    empresa: "CapWatt",
    anexos: 1
  },
  {
    id: 3,
    titulo: "Atualização Tarifas Comerciais",
    descricao: "Caros Parceiros, face à volatilidade do mercado energético que se tem sentido nos últimos meses, a Plenitude informa que vai atualizar as tarifas comerciais de eletricidade, refletindo...",
    data: "31 de julho • 2025/96",
    categoria: "Tarifários",
    empresa: "Plenitude",
    anexos: 0
  },
  {
    id: 4,
    titulo: "Preço Personalizado Semanal de Gás 29072025 – 01082025 – Semana 31",
    descricao: "Caros Parceiros, informamos que, a partir desta data, estão disponíveis os preços fixos desta semana para Clientes de Gás...",
    data: "29 de julho • 2025/94",
    categoria: "Gás",
    empresa: "PortuGás",
    anexos: 1
  },
  {
    id: 5,
    titulo: "Preço Personalizado Semanal de Gás 21.07.2025 a 25.07.2025 – Semana 30",
    descricao: "Caros Parceiros, informamos que, a partir desta data, estão disponíveis os preços fixos desta semana para Clientes de Gás...",
    data: "21 de julho • 2025/90",
    categoria: "Gás",
    empresa: "PortuGás",
    anexos: 1
  },
  {
    id: 6,
    titulo: "Prazos de Antecipação de Assinaturas – Atualização",
    descricao: "Caros Parceiros, serve o presente comunicado para atualizar informação de prazos de antecipação de assinatura de contratos, nas várias comercializadoras que trabalhamos, de forma a não...",
    data: "15 de julho • 2025/88",
    categoria: "Procedimentos",
    empresa: "Iniciativa Coerente",
    anexos: 0
  }
]

const Comunicados = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [assunto, setAssunto] = useState("")
  const [comercializadora, setComercializadora] = useState("")
  const [categoria, setCategoria] = useState("")
  const [observacoes, setObservacoes] = useState("")

  const categories = ["all", "Preços", "Tarifários", "Gás", "Procedimentos"]

  const filteredData = comunicadosData.filter(item => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || item.categoria === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "Preços":
        return "bg-green-100 text-green-800"
      case "Tarifários":
        return "bg-blue-100 text-blue-800"
      case "Gás":
        return "bg-orange-100 text-orange-800"
      case "Procedimentos":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ assunto, date, comercializadora, categoria, observacoes })
    setOpen(false)
    // Reset form
    setAssunto("")
    setDate(undefined)
    setComercializadora("")
    setCategoria("")
    setObservacoes("")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Comunicados</h1>
        <p className="text-muted-foreground">Centro de comunicações e atualizações</p>
      </div>

      <div className="mb-6 flex gap-4 items-center justify-between">
        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.slice(1).map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Procurar por título ou referência"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Comunicado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Comunicado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto</Label>
                <Input
                  id="assunto"
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  placeholder="Digite o assunto do comunicado"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Selecionar data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comercializadora">Comercializadora</Label>
                <Input
                  id="comercializadora"
                  value={comercializadora}
                  onChange={(e) => setComercializadora(e.target.value)}
                  placeholder="Nome da comercializadora"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={categoria} onValueChange={setCategoria} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tarifários">Tarifários</SelectItem>
                    <SelectItem value="Preços">Preços</SelectItem>
                    <SelectItem value="Gás">Gás</SelectItem>
                    <SelectItem value="Luz">Luz</SelectItem>
                    <SelectItem value="Procedimentos">Procedimentos</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Digite as observações..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Criar Comunicado
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredData.map((comunicado) => (
          <Card key={comunicado.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getCategoryColor(comunicado.categoria)}>
                      {comunicado.categoria}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {comunicado.data}
                    </div>
                    {comunicado.anexos > 0 && (
                      <div className="flex items-center text-orange-500 text-sm">
                        <FileText className="h-4 w-4 mr-1" />
                        {comunicado.anexos} anexo{comunicado.anexos > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{comunicado.titulo}</h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {comunicado.descricao}
                  </p>
                  <div className="text-sm font-medium text-primary">
                    {comunicado.empresa}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Comunicados