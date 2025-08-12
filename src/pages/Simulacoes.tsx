import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for simulações
const simulacoesData = [
  {
    id: "S-1001",
    assunto: "Simulação Tarifária (Indexado)",
    cliente: "Condomínio Jardim do Sol",
    estado: "Pendente",
    data: "05-07-2025",
  },
  {
    id: "S-1002",
    assunto: "Simulação Tarifária (Fixo)",
    cliente: "Padaria Central, Lda",
    estado: "Em Análise",
    data: "08-07-2025",
  },
  {
    id: "S-1003",
    assunto: "Simulação Tarifária (Ambos)",
    cliente: "Maria Santos Residencial",
    estado: "Fechado",
    data: "10-07-2025",
  },
]

const Simulacoes = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const filteredData = simulacoesData.filter((item) =>
    item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.assunto.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Fechado":
        return "default"
      case "Pendente":
        return "secondary"
      case "Em Análise":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="p-6">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Simulações</h1>
          <p className="text-muted-foreground">Gestão de simulações tarifárias</p>
        </div>
        <Button onClick={() => navigate("/simulacoes/nova")} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Criar Simulação
        </Button>
      </header>

      <section className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cliente, ID ou Assunto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Pesquisar simulações"
          />
        </div>
      </section>

      <section className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>ASSUNTO</TableHead>
              <TableHead>ESTADO</TableHead>
              <TableHead>DATA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.assunto}</div>
                    <div className="text-sm text-muted-foreground">{item.cliente}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(item.estado)}>{item.estado}</Badge>
                </TableCell>
                <TableCell>{item.data}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}

export default Simulacoes
