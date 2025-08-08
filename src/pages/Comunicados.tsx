import { useState } from "react"
import { Search, Calendar, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Comunicados</h1>
        <p className="text-muted-foreground">Centro de comunicações e atualizações</p>
      </div>

      <div className="mb-6 flex gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((comunicado) => (
          <Card key={comunicado.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <Badge className={getCategoryColor(comunicado.categoria)}>
                  {comunicado.categoria}
                </Badge>
                {comunicado.anexos > 0 && (
                  <div className="flex items-center text-orange-500 text-sm">
                    <FileText className="h-4 w-4 mr-1" />
                    {comunicado.anexos} anexo{comunicado.anexos > 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                {comunicado.data}
              </div>
              <CardTitle className="text-lg leading-tight">{comunicado.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="line-clamp-3 mb-3">
                {comunicado.descricao}
              </CardDescription>
              <div className="text-sm font-medium text-primary">
                {comunicado.empresa}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Comunicados