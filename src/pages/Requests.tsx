import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ChevronLeft, Plus, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { useRequests } from "@/contexts/requests-context"

// const requests: any[] = []


const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "aberto": return "bg-green-500/10 text-green-500 border-green-500/20"
    case "fechado": return "bg-red-500/10 text-red-500 border-red-500/20"
    case "análise": 
    case "analise": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "pendente": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    default: 
      if (status.toLowerCase().includes("pendente")) {
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      }
      return "bg-secondary text-secondary-foreground"
  }
}

const getStatusDot = (status: string) => {
  switch (status.toLowerCase()) {
    case "aberto": return "bg-green-500"
    case "fechado": return "bg-red-500"
    case "análise": 
    case "analise": return "bg-yellow-500"
    case "pendente": return "bg-blue-500"
    default: 
      if (status.toLowerCase().includes("pendente")) {
        return "bg-blue-500"
      }
      return "bg-secondary"
  }
}

const Requests = () => {
  const navigate = useNavigate()
  const { requests, loading } = useRequests()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRequests, setFilteredRequests] = useState(requests)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const handleFilter = (status: string | null) => {
    setActiveFilter(activeFilter === status ? null : status)
  }

  const applyFilters = () => {
    let filtered = requests

    // Apply status filter
    if (activeFilter) {
      filtered = filtered.filter(request => {
        const requestStatus = request.estado?.toLowerCase()
        switch (activeFilter) {
          case 'aberto':
            return requestStatus === 'aberto'
          case 'fechado':
            return requestStatus === 'fechado'
          case 'analise':
            return requestStatus === 'análise' || requestStatus === 'analise'
          case 'pendente':
            return requestStatus?.includes('pendente')
          default:
            return true
        }
      })
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.cliente_nif.includes(searchTerm)
      )
    }

    setFilteredRequests(filtered)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  // Update filtered requests when requests, activeFilter, or searchTerm change
  React.useEffect(() => {
    applyFilters()
  }, [requests, activeFilter, searchTerm])

  const pedidosEmCurso = requests.filter(r => 
    r.estado.toLowerCase().includes("aberto") || 
    r.estado.toLowerCase().includes("pendente")
  ).length

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Pedidos</h1>
      </div>

      {/* Status Cards - Filtros Clicáveis */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Aberto - Verde */}
        <Card 
          className={`border-green-500/20 cursor-pointer hover:bg-green-500/5 transition-colors ${
            activeFilter === 'aberto' ? 'bg-green-500/10 ring-2 ring-green-500/50' : ''
          }`}
          onClick={() => handleFilter('aberto')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ABERTO</p>
                <p className="text-2xl font-bold text-green-500">
                  {requests.filter(r => r.estado?.toLowerCase() === 'aberto').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fechado - Vermelho */}
        <Card 
          className={`border-red-500/20 cursor-pointer hover:bg-red-500/5 transition-colors ${
            activeFilter === 'fechado' ? 'bg-red-500/10 ring-2 ring-red-500/50' : ''
          }`}
          onClick={() => handleFilter('fechado')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">FECHADO</p>
                <p className="text-2xl font-bold text-red-500">
                  {requests.filter(r => r.estado?.toLowerCase() === 'fechado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Análise - Amarelo */}
        <Card 
          className={`border-yellow-500/20 cursor-pointer hover:bg-yellow-500/5 transition-colors ${
            activeFilter === 'analise' ? 'bg-yellow-500/10 ring-2 ring-yellow-500/50' : ''
          }`}
          onClick={() => handleFilter('analise')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ANÁLISE</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {requests.filter(r => r.estado?.toLowerCase() === 'análise' || r.estado?.toLowerCase() === 'analise').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pendente - Azul */}
        <Card 
          className={`border-blue-500/20 cursor-pointer hover:bg-blue-500/5 transition-colors ${
            activeFilter === 'pendente' ? 'bg-blue-500/10 ring-2 ring-blue-500/50' : ''
          }`}
          onClick={() => handleFilter('pendente')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">PENDENTE</p>
                <p className="text-2xl font-bold text-blue-500">
                  {requests.filter(r => r.estado?.toLowerCase().includes('pendente')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white"
          onClick={() => navigate("/requests/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>


      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Cliente, CPE/CUI ou Assunto"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-10"
          />
          <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">A carregar pedidos...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="text-muted-foreground font-medium">COMERCIALIZADORA</TableHead>
                  <TableHead className="text-muted-foreground font-medium">ASSUNTO</TableHead>
                  <TableHead className="text-muted-foreground font-medium">NOME/NIF</TableHead>
                  <TableHead className="text-muted-foreground font-medium">ESTADO</TableHead>
                  <TableHead className="text-muted-foreground font-medium">SUB-UTILIZADOR</TableHead>
                  <TableHead className="text-muted-foreground font-medium">DATA</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhum pedido encontrado com os critérios de pesquisa" : "Nenhum pedido criado ainda"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {request.fornecedores && request.fornecedores.length > 0 
                          ? request.fornecedores.join(", ") 
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {request.assunto}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{request.cliente_nome}</div>
                          <div className="text-xs text-muted-foreground">{request.cliente_nif}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.estado)} variant="secondary">
                          <div className={`w-2 h-2 rounded-full ${getStatusDot(request.estado)} mr-1`}></div>
                          {request.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{request.subUtilizador}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{request.data}</div>
                          <div className="text-xs text-muted-foreground">{request.timeAgo}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => navigate(`/requests/${request.id}/chat`)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Ver todos os Pedidos button */}
      <div className="flex justify-center">
        <Button variant="outline" className="text-muted-foreground">
          Ver todos os Pedidos
        </Button>
      </div>
    </div>
  )
}

export default Requests