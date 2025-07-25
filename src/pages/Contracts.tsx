import { useState, useEffect } from "react"
import { useContracts } from "@/contexts/contracts-context"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Info } from "lucide-react"


const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "activo": return "bg-success text-success-foreground"
    case "pendente": return "bg-warning text-warning-foreground"
    case "expirado": return "bg-muted text-muted-foreground"
    default: return "bg-secondary text-secondary-foreground"
  }
}

const Contracts = () => {
  const navigate = useNavigate()
  const { contracts } = useContracts()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredContracts, setFilteredContracts] = useState(contracts)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedView, setSelectedView] = useState("Ver Tudo")
  const [selectedDate, setSelectedDate] = useState("Data Criação")
  const [selectedFornecedor, setSelectedFornecedor] = useState("Fornecedor")
  const [selectedTipoEnergia, setSelectedTipoEnergia] = useState("Tipo de Energia")
  const [selectedTipoPreco, setSelectedTipoPreco] = useState("Tipo de Preço")
  const [selectedEstado, setSelectedEstado] = useState("Estado")
  const [selectedSubUtilizador, setSelectedSubUtilizador] = useState("Sub-utilizador")

  useEffect(() => {
    setFilteredContracts(contracts)
  }, [contracts])

  const itemsPerPage = 20
  const totalItems = filteredContracts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentContracts = filteredContracts.slice(startIndex, endIndex)
  const showingStart = totalItems > 0 ? startIndex + 1 : 0
  const showingEnd = Math.min(endIndex, totalItems)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = contracts.filter(contract =>
      contract.cliente.toLowerCase().includes(value.toLowerCase()) ||
      contract.nif.toLowerCase().includes(value.toLowerCase()) ||
      contract.ponto.toLowerCase().includes(value.toLowerCase()) ||
      contract.fornecedor.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredContracts(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }

  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 10
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 4) {
        pages.push('...')
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 2)
      const end = Math.min(totalPages - 1, currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...')
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Contratos</h1>
        <Button 
          className="ml-auto bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => navigate("/contracts/add")}
        >
          NOVO CONTRATO
        </Button>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedView} onValueChange={setSelectedView}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ver Tudo">Ver Tudo</SelectItem>
            <SelectItem value="Activos">Activos</SelectItem>
            <SelectItem value="Inativos">Inativos</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Data Criação">Data Criação</SelectItem>
            <SelectItem value="Última Semana">Última Semana</SelectItem>
            <SelectItem value="Último Mês">Último Mês</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <Input
            placeholder="Nome/NIF Cliente, CPE/CUI, Responsável, Notas..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-80"
          />
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Second row of filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedFornecedor} onValueChange={setSelectedFornecedor}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fornecedor">Fornecedor</SelectItem>
            <SelectItem value="EDP Comercial">EDP Comercial</SelectItem>
            <SelectItem value="Galp Power">Galp Power</SelectItem>
            <SelectItem value="Iberdrola">Iberdrola</SelectItem>
            <SelectItem value="Endesa">Endesa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedTipoEnergia} onValueChange={setSelectedTipoEnergia}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tipo de Energia">Tipo de Energia</SelectItem>
            <SelectItem value="Eletricidade">Eletricidade</SelectItem>
            <SelectItem value="Gás Natural">Gás Natural</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedTipoPreco} onValueChange={setSelectedTipoPreco}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tipo de Preço">Tipo de Preço</SelectItem>
            <SelectItem value="Fixo">Fixo</SelectItem>
            <SelectItem value="Variável">Variável</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedEstado} onValueChange={setSelectedEstado}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Estado">Estado</SelectItem>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSubUtilizador} onValueChange={setSelectedSubUtilizador}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sub-utilizador">Sub-utilizador</SelectItem>
            <SelectItem value="Sub-User 1">Sub-User 1</SelectItem>
            <SelectItem value="Sub-User 2">Sub-User 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="text-muted-foreground font-medium">NIF</TableHead>
                <TableHead className="text-muted-foreground font-medium">FORNECEDOR</TableHead>
                <TableHead className="text-muted-foreground font-medium">CLIENTE / PONTO</TableHead>
                <TableHead className="text-muted-foreground font-medium">ESTADO</TableHead>
                <TableHead className="text-muted-foreground font-medium">INÍCIO FORN.</TableHead>
                <TableHead className="text-muted-foreground font-medium">CONSUMO</TableHead>
                <TableHead className="text-muted-foreground font-medium">COMISSÃO</TableHead>
                <TableHead className="text-muted-foreground font-medium">SUB-UTILIZADOR</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentContracts.map((contract) => (
                <TableRow key={contract.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{contract.nif}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        {contract.fornecedor.charAt(0)}
                      </div>
                      {contract.fornecedor}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-96">
                    <div className="space-y-1">
                      <div className="font-medium">{contract.cliente}</div>
                      <div className="text-xs text-muted-foreground truncate">{contract.ponto}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contract.estado)} variant="secondary">
                      <div className="w-2 h-2 rounded-full bg-current mr-1"></div>
                      {contract.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{contract.inicioForn}</TableCell>
                  <TableCell>{contract.consumo}</TableCell>
                  <TableCell>{contract.comissao}</TableCell>
                  <TableCell>{contract.subUtilizador}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => navigate(`/contracts/details/${contract.id}`)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {showingStart}–{showingEnd} de {totalItems}
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {generatePageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-muted-foreground">...</span>
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page as number)
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                }}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default Contracts