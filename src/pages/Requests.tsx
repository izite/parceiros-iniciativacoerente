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
    case "fechado": return "bg-success text-success-foreground"
    case "pendente (fornecedor)": return "bg-muted text-muted-foreground"
    default: return "bg-secondary text-secondary-foreground"
  }
}

const getStatusDot = (status: string) => {
  switch (status.toLowerCase()) {
    case "fechado": return "bg-success"
    case "pendente (fornecedor)": return "bg-muted-foreground"
    default: return "bg-secondary"
  }
}

const Requests = () => {
  const navigate = useNavigate()
  const { requests } = useRequests()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRequests, setFilteredRequests] = useState(requests)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = requests.filter(request =>
      request.assunto.toLowerCase().includes(value.toLowerCase()) ||
      request.id.toLowerCase().includes(value.toLowerCase()) ||
      request.cliente_nome.toLowerCase().includes(value.toLowerCase()) ||
      request.cliente_nif.includes(value)
    )
    setFilteredRequests(filtered)
  }

  // Update filtered requests when requests change
  React.useEffect(() => {
    handleSearch(searchTerm)
  }, [requests, searchTerm])

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
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="text-muted-foreground font-medium">ID</TableHead>
                <TableHead className="text-muted-foreground font-medium">ASSUNTO</TableHead>
                <TableHead className="text-muted-foreground font-medium">NOME/NIF</TableHead>
                <TableHead className="text-muted-foreground font-medium">ESTADO</TableHead>
                <TableHead className="text-muted-foreground font-medium">SUB-UTILIZADOR</TableHead>
                <TableHead className="text-muted-foreground font-medium">DATA</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{request.id}</TableCell>
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
                      onClick={() => navigate(`/requests/${request.id}`)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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