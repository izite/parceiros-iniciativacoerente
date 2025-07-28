import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Eye, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const occurrences = [
  {
    id: "OC001",
    subject: "Problema na faturação energética",
    status: "Em Análise",
    date: "2024-07-20",
    client: "EMPRESA TESTE, LDA",
    cpe: "PT0001234567890123456789012",
    nif: "123456789"
  },
  {
    id: "OC002", 
    subject: "Alteração de potência contratada",
    status: "Resolvido",
    date: "2024-07-18",
    client: "INDUSTRIAL SOLUTIONS",
    cpe: "PT0001234567890123456789013",
    nif: "987654321"
  },
  {
    id: "OC003",
    subject: "Mudança de fornecedor",
    status: "Pendente",
    date: "2024-07-22",
    client: "GREEN ENERGY CORP",
    cpe: "PT0001234567890123456789014",
    nif: "456789123"
  },
  {
    id: "OC004",
    subject: "Análise de consumo irregular",
    status: "Em Análise",
    date: "2024-07-19",
    client: "CITY MUNICIPAL",
    cpe: "PT0001234567890123456789015",
    nif: "789123456"
  },
  {
    id: "OC005",
    subject: "Reclamação sobre tarifário",
    status: "Cancelado",
    date: "2024-07-15",
    client: "TECH INDUSTRIES LTD",
    cpe: "PT0001234567890123456789016",
    nif: "321654987"
  }
]

const getStatusBadge = (status: string) => {
  const statusConfig = {
    "Em Análise": { variant: "default" as const, icon: Clock, color: "text-yellow-600" },
    "Resolvido": { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
    "Pendente": { variant: "secondary" as const, icon: AlertCircle, color: "text-orange-600" },
    "Cancelado": { variant: "destructive" as const, icon: XCircle, color: "text-red-600" }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Pendente"]
  const Icon = config.icon
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
      {status}
    </Badge>
  )
}

export default function Occurrences() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOccurrences = occurrences.filter(occurrence =>
    occurrence.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    occurrence.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    occurrence.cpe.includes(searchTerm) ||
    occurrence.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ocorrências</h1>
          <p className="text-muted-foreground">Gerencie as ocorrências do sistema</p>
        </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white"
          onClick={() => navigate('/new-occurrence')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Ocorrência
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por Cliente, CPE/CUI ou Assunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIF</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Cliente / CPE</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[50px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOccurrences.map((occurrence) => (
              <TableRow key={occurrence.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{occurrence.nif}</TableCell>
                <TableCell className="font-medium">{occurrence.subject}</TableCell>
                <TableCell className="text-sm">
                  <div>
                    <div className="font-medium">{occurrence.client}</div>
                    <div className="text-muted-foreground text-xs">{occurrence.cpe}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(occurrence.status)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(occurrence.date).toLocaleDateString('pt-PT')}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => window.location.href = `/occurrences/${occurrence.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredOccurrences.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma ocorrência encontrada</h3>
          <p className="text-muted-foreground">Tente ajustar sua pesquisa ou crie uma nova ocorrência.</p>
        </div>
      )}
    </div>
  )
}