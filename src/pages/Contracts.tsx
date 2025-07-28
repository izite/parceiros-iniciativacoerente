import { useState, useEffect } from "react"
import { useContracts } from "@/contexts/contracts-context"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Info } from "lucide-react"

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
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

  useEffect(() => {
    setFilteredContracts(contracts)
  }, [contracts])

  const itemsPerPage = 20
  const totalItems = filteredContracts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentContracts = filteredContracts.slice(startIndex, endIndex)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = contracts.filter(contract =>
      contract.cliente_nome?.toLowerCase().includes(value.toLowerCase()) ||
      contract.nif?.toLowerCase().includes(value.toLowerCase()) ||
      contract.cpe_cui?.toLowerCase().includes(value.toLowerCase()) ||
      contract.fornecedor?.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredContracts(filtered)
    setCurrentPage(1)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="ml-auto flex items-center gap-2">
          <Input
            placeholder="Nome/NIF Cliente, CPE/CUI, Responsável..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-80"
          />
          <Button variant="outline" size="sm">
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
                        {contract.fornecedor?.charAt(0)}
                      </div>
                      {contract.fornecedor}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-96">
                    <div className="space-y-1">
                      <div className="font-medium">{contract.cliente_nome}</div>
                      <div className="text-xs text-muted-foreground truncate">{contract.cpe_cui}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contract.estado || "")} variant="secondary">
                      <div className="w-2 h-2 rounded-full bg-current mr-1"></div>
                      {contract.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{contract.inicio_fornecimento}</TableCell>
                  <TableCell>{contract.consumo}</TableCell>
                  <TableCell>{contract.comissao}</TableCell>
                  <TableCell>{contract.sub_utilizador}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => navigate(`/contracts/${contract.id}`)}
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {startIndex + 1}–{Math.min(endIndex, totalItems)} de {totalItems}
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
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
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
      )}
    </div>
  )
}

export default Contracts