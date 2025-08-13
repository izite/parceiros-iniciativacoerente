import { useState } from "react"
import { Search, Plus, ChevronRight } from "lucide-react"
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
import { useSimulacoes } from "@/contexts/simulacoes-context"

const Simulacoes = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
  const { simulacoes, loading } = useSimulacoes()

  const filteredData = simulacoes.filter((item) =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tipo_tarifa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.nif && item.nif.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "fechado":
        return "default"
      case "pendente":
        return "secondary"
      case "analise":
      case "análise":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatTipoTarifa = (tipo: string) => {
    switch (tipo) {
      case "indexado":
        return "Simulação Tarifária (Indexado)"
      case "fixo":
        return "Simulação Tarifária (Fixo)"
      case "ambos":
        return "Simulação Tarifária (Ambos)"
      default:
        return `Simulação Tarifária (${tipo})`
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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
            placeholder="Cliente, ID ou Tipo de Tarifa"
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  A carregar simulações...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Nenhuma simulação encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/simulacoes/${item.id}`)}
                >
                  <TableCell className="font-medium">{item.numero}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatTipoTarifa(item.tipo_tarifa)}</div>
                      <div className="text-sm text-muted-foreground">{item.nome}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(item.estado)}>{item.estado}</Badge>
                  </TableCell>
                  <TableCell className="flex items-center justify-between">
                    {formatDate(item.created_at)}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}

export default Simulacoes
