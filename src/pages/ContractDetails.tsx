import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useContracts } from "@/contexts/contracts-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Edit, Save, X } from "lucide-react"
import { toast } from "sonner"

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "activo": return "bg-success text-success-foreground"
    case "pendente": return "bg-warning text-warning-foreground" 
    case "expirado": return "bg-muted text-muted-foreground"
    default: return "bg-secondary text-secondary-foreground"
  }
}

const ContractDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { contracts, updateContract, getContract } = useContracts()
  const [isEditing, setIsEditing] = useState(false)
  
  // Form states
  const [nif, setNif] = useState("")
  const [cliente, setCliente] = useState("")
  const [ponto, setPonto] = useState("")
  const [fornecedor, setFornecedor] = useState("")
  const [estado, setEstado] = useState("")
  const [inicioForn, setInicioForn] = useState("")
  const [consumo, setConsumo] = useState("")
  const [comissao, setComissao] = useState("")
  const [subUtilizador, setSubUtilizador] = useState("")
  const [notas, setNotas] = useState("")

  const contract = id ? getContract(id) : null

  useEffect(() => {
    if (contract) {
      setNif(contract.nif || "")
      setCliente(contract.cliente_nome || "")
      setPonto(contract.cpe_cui || "")
      setFornecedor(contract.fornecedor || "")
      setEstado(contract.estado || "")
      setInicioForn(contract.inicio_fornecimento || "")
      setConsumo(contract.consumo?.toString() || "")
      setComissao(contract.comissao?.toString() || "")
      setSubUtilizador(contract.sub_utilizador || "")
      setNotas(contract.notas || "")
    }
  }, [contract])

  const handleSave = async () => {
    if (!id) return
    
    try {
      await updateContract(id, {
        nif,
        cliente_nome: cliente,
        cpe_cui: ponto,
        fornecedor,
        estado,
        inicio_fornecimento: inicioForn,
        consumo: parseFloat(consumo) || 0,
        comissao: parseFloat(comissao) || 0,
        sub_utilizador: subUtilizador,
        notas
      })
      
      setIsEditing(false)
      toast.success("Contrato atualizado com sucesso!")
    } catch (error) {
      toast.error("Erro ao atualizar contrato")
    }
  }

  const handleCancel = () => {
    // Reset form to original values
    if (contract) {
      setNif(contract.nif || "")
      setCliente(contract.cliente_nome || "")
      setPonto(contract.cpe_cui || "")
      setFornecedor(contract.fornecedor || "")
      setEstado(contract.estado || "")
      setInicioForn(contract.inicio_fornecimento || "")
      setConsumo(contract.consumo?.toString() || "")
      setComissao(contract.comissao?.toString() || "")
      setSubUtilizador(contract.sub_utilizador || "")
      setNotas(contract.notas || "")
    }
    setIsEditing(false)
  }

  if (!contract) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/contracts")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Contrato não encontrado</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/contracts")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Contrato - {contract.cliente_nome}</h1>
            <p className="text-sm text-muted-foreground">NIF: {contract.nif}</p>
          </div>
          <Badge className={getStatusColor(contract.estado || "")} variant="secondary">
            {contract.estado}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Contract Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nif">NIF</Label>
              <Input
                id="nif"
                value={nif}
                onChange={(e) => setNif(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cliente">Nome do Cliente</Label>
              <Input
                id="cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ponto">CPE/CUI</Label>
              <Input
                id="ponto"
                value={ponto}
                onChange={(e) => setPonto(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Contrato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inicioForn">Início Fornecimento</Label>
              <Input
                id="inicioForn"
                value={inicioForn}
                onChange={(e) => setInicioForn(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados Comerciais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="consumo">Consumo</Label>
              <Input
                id="consumo"
                value={consumo}
                onChange={(e) => setConsumo(e.target.value)}
                disabled={!isEditing}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comissao">Comissão</Label>
              <Input
                id="comissao"
                value={comissao}
                onChange={(e) => setComissao(e.target.value)}
                disabled={!isEditing}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subUtilizador">Sub-utilizador</Label>
              <Input
                id="subUtilizador"
                value={subUtilizador}
                onChange={(e) => setSubUtilizador(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              disabled={!isEditing}
              placeholder="Adicionar notas sobre o contrato..."
              className="min-h-32"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ContractDetails