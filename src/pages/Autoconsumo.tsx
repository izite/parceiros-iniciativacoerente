import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for autoconsumo proposals
const autoconsumoData = [
  {
    id: "80838",
    assunto: "Proposta Autoconsumo (B2B)",
    cliente: "ADM Condomínio Palmeiras Shopping",
    estado: "Fechado",
    data: "26-09-2023"
  },
  {
    id: "80839",
    assunto: "Proposta Autoconsumo (B2C)",
    cliente: "João Silva Residencial",
    estado: "Pendente",
    data: "15-10-2023"
  },
  {
    id: "80840",
    assunto: "Proposta Autoconsumo Industrial",
    cliente: "Fábrica Têxtil Norte",
    estado: "Em Análise",
    data: "02-11-2023"
  }
]

const Autoconsumo = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = autoconsumoData.filter(item =>
    item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.includes(searchTerm) ||
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Autoconsumo</h1>
        <p className="text-muted-foreground">Gestão de propostas de autoconsumo</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cliente, CPE/CUI ou Assunto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
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
              <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.assunto}</div>
                    <div className="text-sm text-muted-foreground">{item.cliente}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(item.estado)}>
                    {item.estado}
                  </Badge>
                </TableCell>
                <TableCell>{item.data}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Autoconsumo