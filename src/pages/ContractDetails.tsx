import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useUser } from "@/contexts/user-context"
import { useContracts } from "@/contexts/contracts-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

import { ChevronLeft, Calendar, Upload, FileText, Download, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

const ContractDetails = () => {
  const navigate = useNavigate()
  const { contractId } = useParams()
  const { user } = useUser()
  const { addContract, contracts, updateContract } = useContracts()
  const isViewMode = Boolean(contractId)
  const [contractStatus, setContractStatus] = useState("activo")
  const [contractConsumo, setContractConsumo] = useState("")
  const [contractComissao, setContractComissao] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [fileInputKey, setFileInputKey] = useState(0)
  
  const [formData, setFormData] = useState({
    // Ponto section
    tipoContrato: "",
    metodoPagamento: "",
    fornecedorActual: "",
    morada: "",
    codigoPostal: "",
    localidade: "",
    tipo: "Electricidade",
    cpe: "",
    tensao: "",
    potenciaContratada: "",
    ciclo: "",
    tarifa: "",
    
    // Detalhes do Contrato section
    fornecedor: "",
    campanha: "",
    campanhaVersao: "",
    dataAssinatura: undefined as Date | undefined,
    codigoCrc: "",
    dataValidadeCrc: undefined as Date | undefined,
    entradaDirecta: false,
    alteracaoTarifa: false,
    alteracaoTitular: false,
    dataRenunciaAnterior: undefined as Date | undefined,
    observacoesContrato: "",
    
    // Responsável section
    responsavel: "",
    nomeResponsavel: user?.name || "",
    tlfResponsavel: "",
    emailResponsavel: "",
    notasResponsavel: ""
  })

  // Load contract data when in view mode
  useEffect(() => {
    if (isViewMode && contractId) {
      const contract = contracts.find(c => c.id === contractId)
      console.log("Contrato encontrado:", contract)
      if (contract) {
        // Set status, consumption and commission from contract
        console.log("Estado original do contrato:", contract.estado)
        console.log("Estado convertido para minúscula:", contract.estado.toLowerCase())
        setContractStatus(contract.estado.toLowerCase())
        setContractConsumo(contract.consumo !== "—" ? contract.consumo : "")
        setContractComissao(contract.comissao !== "—" ? contract.comissao.replace("€", "") : "")
        
        // Load realistic data based on the contract
        setFormData({
          // Ponto section
          tipoContrato: "negocios",
          metodoPagamento: "debito_direto",
          fornecedorActual: contract.fornecedor.toLowerCase().replace(" ", "_"),
          morada: "Rua da Energia, 123, 1º Andar",
          codigoPostal: "1000-123",
          localidade: "Lisboa",
          tipo: "Electricidade",
          cpe: "PT000200001234567890123456",
          tensao: "baixa",
          potenciaContratada: "3,45",
          ciclo: "mensal",
          tarifa: "simples",
          
          // Detalhes do Contrato section
          fornecedor: contract.fornecedor.toLowerCase().replace(" ", "_"),
          campanha: "Energia Poupança 2025",
          campanhaVersao: "EP25",
          dataAssinatura: new Date("2025-06-30"),
          codigoCrc: "0002-1234-5678",
          dataValidadeCrc: new Date("2026-06-30"),
          entradaDirecta: false,
          alteracaoTarifa: true,
          alteracaoTitular: false,
          dataRenunciaAnterior: new Date("2025-07-01"),
          observacoesContrato: "Débito Direto, Fatura Eletrónica",
          
          // Responsável section
          responsavel: "admin",
          nomeResponsavel: user?.name || "Admin 1",
          tlfResponsavel: "123456789",
          emailResponsavel: user?.email || "admin@empresa.com",
          notasResponsavel: "Melhor contacto: 9h às 18h"
        })
      }
    }
  }, [isViewMode, contractId, contracts, user])

  // Current contract for display
  const currentContract = isViewMode && contractId ? contracts.find(c => c.id === contractId) : null

  const handleInputChange = (field: string, value: string | boolean | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    // Criar um novo contrato com os dados do formulário
    const newContract = {
      nif: "123456789", // Placeholder
      cliente: user?.name || "Cliente",
      ponto: formData.cpe || "PT0001234567890123456789999",
      fornecedor: formData.fornecedor || "EDP Comercial",
      estado: "Activo",
      inicioForn: formData.dataAssinatura ? 
        format(formData.dataAssinatura, "dd/MM/yyyy", { locale: pt }) : 
        format(new Date(), "dd/MM/yyyy", { locale: pt }),
      consumo: "—",
      comissao: "—",
      subUtilizador: "—"
    }
    
    addContract(newContract)
    navigate("/contracts")
  }

  const handleCancel = () => {
    navigate("/contracts")
  }

  const handleSave = () => {
    if (isViewMode && contractId) {
      // Update the contract with new status, consumption and commission
      updateContract(contractId, {
        estado: contractStatus.charAt(0).toUpperCase() + contractStatus.slice(1),
        consumo: contractConsumo || "—",
        comissao: contractComissao ? `€${contractComissao}` : "—"
      })
    }
    navigate("/contracts")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo": return "bg-green-100 text-green-800 border-green-200"
      case "tramitacao": return "bg-blue-100 text-blue-800 border-blue-200"
      case "anulado": return "bg-red-100 text-red-800 border-red-200"
      case "baixa": return "bg-orange-100 text-orange-800 border-orange-200"
      case "renovado": return "bg-purple-100 text-purple-800 border-purple-200"
      case "pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="p-0 h-8 w-8" onClick={() => navigate("/contracts")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>{currentContract ? currentContract.cliente : user?.name || "Usuário"}</span>
            <span>/</span>
            <span>Contratos</span>
            <span>/</span>
            <span>{isViewMode ? contractId : "Novo Contrato"}</span>
          </div>
          <h1 className="text-2xl font-semibold">
            {currentContract ? currentContract.cliente : user?.name || "Usuário"}
          </h1>
          <p className="text-sm text-muted-foreground">
            NIF: {currentContract ? currentContract.nif : user?.nif || "N/A"}
          </p>
          {isViewMode && (
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1"></div>
                Activo
              </span>
              <span className="text-sm text-muted-foreground">
                2 de julho de 2025
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status, Consumption and Commission Management - Only show in view mode */}
      {isViewMode && (
        <div className="grid grid-cols-3 gap-6">
          {/* Status Change Box */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Estado do Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">ESTADO ACTUAL</Label>
                <Badge className={`${getStatusColor(contractStatus)} px-3 py-1`}>
                  <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                  {contractStatus.charAt(0).toUpperCase() + contractStatus.slice(1)}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">NOVO ESTADO</Label>
                <Select value={contractStatus} onValueChange={setContractStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="activo">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                        Activo
                      </div>
                    </SelectItem>
                    <SelectItem value="tramitacao">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        Tramitação
                      </div>
                    </SelectItem>
                    <SelectItem value="anulado">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-600"></div>
                        Anulado
                      </div>
                    </SelectItem>
                    <SelectItem value="baixa">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                        Baixa
                      </div>
                    </SelectItem>
                    <SelectItem value="renovado">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                        Renovado
                      </div>
                    </SelectItem>
                    <SelectItem value="pendente">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                        Pendente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">
                Actualizar Estado
              </Button>
            </CardContent>
          </Card>

          {/* Consumption Box */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Consumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">CONSUMO ACTUAL</Label>
                <div className="p-3 bg-muted/20 rounded border">
                  {currentContract?.consumo || "—"}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="novoConsumo" className="text-sm font-medium text-muted-foreground">NOVO CONSUMO</Label>
                <div className="relative">
                  <Input
                    id="novoConsumo"
                    value={contractConsumo}
                    onChange={(e) => setContractConsumo(e.target.value)}
                    placeholder="Ex: 12.345"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">kWh</span>
                </div>
              </div>
              <Button className="w-full">
                Actualizar Consumo
              </Button>
            </CardContent>
          </Card>

          {/* Commission Box */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Comissão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">COMISSÃO ACTUAL</Label>
                <div className="p-3 bg-muted/20 rounded border">
                  {currentContract?.comissao || "—"}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="novaComissao" className="text-sm font-medium text-muted-foreground">NOVA COMISSÃO</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">€</span>
                  <Input
                    id="novaComissao"
                    value={contractComissao}
                    onChange={(e) => setContractComissao(e.target.value)}
                    placeholder="Ex: 125.00"
                    className="pl-8"
                  />
                </div>
              </div>
              <Button className="w-full">
                Actualizar Comissão
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
          {/* Ponto Section */}
          <Card>
            <CardHeader>
              <CardTitle>Ponto</CardTitle>
              <p className="text-orange-500 text-sm">Preencher com ponto PT 0002...W - BTN</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* First row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">TIPO CONTRATO</Label>
                  <Select value={formData.tipoContrato} onValueChange={(value) => handleInputChange("tipoContrato", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Negócios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="negocios">Negócios</SelectItem>
                      <SelectItem value="residencial">Residencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">MÉTODO PAGAMENTO</Label>
                  <Select value={formData.metodoPagamento} onValueChange={(value) => handleInputChange("metodoPagamento", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Multibanco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multibanco">Multibanco</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                      <SelectItem value="debito_direto">Débito Direto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">FORNECEDOR ACTUAL</Label>
                  <Select value={formData.fornecedorActual} onValueChange={(value) => handleInputChange("fornecedorActual", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edp">EDP</SelectItem>
                      <SelectItem value="galp">Galp</SelectItem>
                      <SelectItem value="iberdrola">Iberdrola</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address fields */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="morada" className="text-sm font-medium text-muted-foreground">MORADA</Label>
                  <Input
                    id="morada"
                    value={formData.morada}
                    onChange={(e) => handleInputChange("morada", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigoPostal" className="text-sm font-medium text-muted-foreground">CÓDIGO POSTAL</Label>
                  <Input
                    id="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localidade" className="text-sm font-medium text-muted-foreground">LOCALIDADE</Label>
                  <Input
                    id="localidade"
                    value={formData.localidade}
                    onChange={(e) => handleInputChange("localidade", e.target.value)}
                  />
                </div>
              </div>

              {/* Tipo */}
              <div className="w-60">
                <Label className="text-sm font-medium text-muted-foreground">TIPO</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electricidade">Electricidade</SelectItem>
                    <SelectItem value="Gas">Gás</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Electricidade Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">ELECTRICIDADE</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="cpe" className="text-sm font-medium text-muted-foreground">CPE</Label>
                  <Input
                    id="cpe"
                    value={formData.cpe}
                    onChange={(e) => handleInputChange("cpe", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">TENSÃO</Label>
                    <Select value={formData.tensao} onValueChange={(value) => handleInputChange("tensao", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="potenciaContratada" className="text-sm font-medium text-muted-foreground">POTÊNCIA CONTRATADA</Label>
                    <div className="relative">
                      <Input
                        id="potenciaContratada"
                        value={formData.potenciaContratada}
                        onChange={(e) => handleInputChange("potenciaContratada", e.target.value)}
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">KVA</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">CICLO</Label>
                    <Select value={formData.ciclo} onValueChange={(value) => handleInputChange("ciclo", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="quinzenal">Quinzenal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">TARIFA</Label>
                    <Select value={formData.tarifa} onValueChange={(value) => handleInputChange("tarifa", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simples">Simples</SelectItem>
                        <SelectItem value="bi_horaria">Bi-horária</SelectItem>
                        <SelectItem value="tri_horaria">Tri-horária</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Contrato Section */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">FORNECEDOR</Label>
                  <Select value={formData.fornecedor} onValueChange={(value) => handleInputChange("fornecedor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edp">EDP</SelectItem>
                      <SelectItem value="galp">Galp</SelectItem>
                      <SelectItem value="iberdrola">Iberdrola</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campanha" className="text-sm font-medium text-muted-foreground">CAMPANHA</Label>
                  <Input
                    id="campanha"
                    placeholder="Pesquise por uma campanha..."
                    value={formData.campanha}
                    onChange={(e) => handleInputChange("campanha", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campanhaVersao" className="text-sm font-medium text-muted-foreground">CAMPANHA - VERSÃO</Label>
                <Input
                  id="campanhaVersao"
                  placeholder="ex. C1819"
                  value={formData.campanhaVersao}
                  onChange={(e) => handleInputChange("campanhaVersao", e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">DATA DE RENÚNCIA DO CONTRATO ANTERIOR</Label>
                    <div className="p-3 bg-muted/20 rounded border">
                      01-07-2025
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">DATA INÍCIO FORNECIMENTO</Label>
                    <div className="p-3 bg-muted/20 rounded border">
                      02-07-2025
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">DURAÇÃO</Label>
                  <div className="p-3 bg-muted/20 rounded border max-w-48">
                    12 meses
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">DATA DE ASSINATURA</Label>
                    <div className="p-3 bg-muted/20 rounded border">
                      30-06-2025
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">SERVIÇOS</Label>
                    <div className="p-3 bg-muted/20 rounded border">
                      Débito Direto, Fatura Eletrónica
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="entradaDirecta" 
                    checked={formData.entradaDirecta}
                    onCheckedChange={(checked) => handleInputChange("entradaDirecta", checked)}
                  />
                  <Label htmlFor="entradaDirecta" className="text-sm">Entrada Directa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="alteracaoTarifa" 
                    checked={formData.alteracaoTarifa}
                    onCheckedChange={(checked) => handleInputChange("alteracaoTarifa", checked)}
                  />
                  <Label htmlFor="alteracaoTarifa" className="text-sm">Alteração de Tarifa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="alteracaoTitular" 
                    checked={formData.alteracaoTitular}
                    onCheckedChange={(checked) => handleInputChange("alteracaoTitular", checked)}
                  />
                  <Label htmlFor="alteracaoTitular" className="text-sm">Alteração de Titular</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">DATA DE RENÚNCIA DO CONTRATO ANTERIOR *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full max-w-md justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.dataRenunciaAnterior ? (
                        format(formData.dataRenunciaAnterior, "dd-MM-yyyy", { locale: pt })
                      ) : (
                        <span>DD-MM-AAAA</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.dataRenunciaAnterior}
                      onSelect={(date) => handleInputChange("dataRenunciaAnterior", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoesContrato" className="text-sm font-medium text-muted-foreground">OBSERVAÇÕES DO CONTRATO</Label>
                <Textarea
                  id="observacoesContrato"
                  placeholder="Outros detalhes que possam ser úteis para o processamento deste contrato."
                  value={formData.observacoesContrato}
                  onChange={(e) => handleInputChange("observacoesContrato", e.target.value)}
                  className="w-full min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          {/* Responsável Section */}
          <Card>
            <CardHeader>
              <CardTitle>Responsável</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">RESPONSÁVEL</Label>
                <Select value={formData.responsavel} onValueChange={(value) => handleInputChange("responsavel", value)}>
                  <SelectTrigger className="max-w-md">
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bruno">Bruno Santos</SelectItem>
                    <SelectItem value="admin">Admin 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeResponsavel" className="text-sm font-medium text-muted-foreground">NOME RESPONSÁVEL*</Label>
                  <Input
                    id="nomeResponsavel"
                    value={formData.nomeResponsavel}
                    onChange={(e) => handleInputChange("nomeResponsavel", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tlfResponsavel" className="text-sm font-medium text-muted-foreground">TLF RESPONSÁVEL*</Label>
                  <Input
                    id="tlfResponsavel"
                    value={formData.tlfResponsavel}
                    onChange={(e) => handleInputChange("tlfResponsavel", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailResponsavel" className="text-sm font-medium text-muted-foreground">EMAIL RESPONSÁVEL *</Label>
                  <Input
                    id="emailResponsavel"
                    type="email"
                    value={formData.emailResponsavel}
                    onChange={(e) => handleInputChange("emailResponsavel", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notasResponsavel" className="text-sm font-medium text-muted-foreground">NOTAS SOBRE O RESPONSÁVEL</Label>
                <Input
                  id="notasResponsavel"
                  placeholder="Ex. melhor hora para contactar"
                  value={formData.notasResponsavel}
                  onChange={(e) => handleInputChange("notasResponsavel", e.target.value)}
                  className="w-full"
                />
              </div>

              <p className="text-sm text-muted-foreground">Poderá anexar ficheiros após criar o Contrato.</p>
            </CardContent>
          </Card>

          {/* Anexar Documentos - Only show in view mode */}
          {isViewMode && (
            <Card>
              <CardHeader>
                <CardTitle>Anexar Documentos</CardTitle>
                <p className="text-sm text-muted-foreground">Anexe documentos PDF relacionados com este contrato</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Arraste ficheiros PDF aqui ou clique para selecionar</p>
                      <p className="text-xs text-muted-foreground">Apenas ficheiros PDF são aceites (máx. 10MB)</p>
                    </div>
                  </div>
                  <div>
                    <input
                      key={fileInputKey}
                      type="file"
                      accept=".pdf"
                      multiple
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        setAttachedFiles(prev => [...prev, ...files])
                      }}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Ficheiros
                    </Button>
                  </div>
                </div>

                {/* Attached Files List */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      FICHEIROS ANEXADOS ({attachedFiles.length})
                    </Label>
                    <div className="space-y-2">
                      {attachedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => {
                                setAttachedFiles(prev => prev.filter((_, i) => i !== index))
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        {/* Action Buttons - Only show in create mode */}
        {!isViewMode && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              CANCELAR
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSubmit}>
              ADICIONAR
            </Button>
          </div>
        )}

        {/* Action Buttons - Only show in view mode */}
        {isViewMode && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              CANCELAR
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
              GUARDAR
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContractDetails