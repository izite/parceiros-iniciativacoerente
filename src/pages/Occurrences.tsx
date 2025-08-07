import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Eye, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useOccurrences } from "@/contexts/occurrences-context"


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
  const { occurrences, loading } = useOccurrences()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOccurrences = occurrences.filter(occurrence =>
    occurrence.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    occurrence.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (occurrence.cpe_cui && occurrence.cpe_cui.includes(searchTerm)) ||
    (occurrence.numero_formatado && occurrence.numero_formatado.toLowerCase().includes(searchTerm.toLowerCase()))
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
              <TableHead>ID</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Cliente / CPE</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[50px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  A carregar ocorrências...
                </TableCell>
              </TableRow>
            ) : filteredOccurrences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "Nenhuma ocorrência encontrada com os critérios de pesquisa" : "Nenhuma ocorrência criada ainda"}
                </TableCell>
              </TableRow>
            ) : (
              filteredOccurrences.map((occurrence) => (
                <TableRow key={occurrence.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {occurrence.numero_formatado || occurrence.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="font-medium">{occurrence.assunto}</TableCell>
                  <TableCell className="text-sm">
                    <div>
                      <div className="font-medium">{occurrence.cliente_nome}</div>
                      {occurrence.cpe_cui && (
                        <div className="text-muted-foreground text-xs">{occurrence.cpe_cui}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(occurrence.estado)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="space-y-1">
                      <div className="font-medium">{occurrence.data}</div>
                      <div className="text-xs text-muted-foreground">{occurrence.timeAgo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => navigate(`/occurrences/${occurrence.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}