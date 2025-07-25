import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useContracts } from "@/contexts/contracts-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

const AddContract = () => {
  const navigate = useNavigate()
  const { addContract, contracts } = useContracts()
  const [formData, setFormData] = useState({
    nif: "",
    nome: "",
    morada: "",
    codigoPostal: "",
    localidade: "",
    telefone: "",
    email: "",
    metodoPagamento: "",
    codigoCrc: "",
    dataValidadeCrc: undefined as Date | undefined,
    notas: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    // Validação básica
    if (!formData.nif || !formData.nome) {
      alert("Por favor, preencha pelo menos o NIF e o NOME")
      return
    }

    // Criar novo contrato
    const newContract = {
      nif: formData.nif,
      cliente: formData.nome,
      ponto: "PT0001234567890123456789999",
      fornecedor: "EDP Comercial", // Padrão, pode ser alterado depois
      estado: "Activo",
      inicioForn: format(new Date(), "dd/MM/yyyy", { locale: pt }),
      consumo: "—",
      comissao: "—",
      subUtilizador: "—"
    }
    
    console.log("Novo contrato criado:", newContract)
    addContract(newContract)
    console.log("Contrato adicionado ao contexto")
    
    // Calcular o próximo ID baseado no número atual de contratos
    const newContractId = (220000 + contracts.length).toString()
    
    // Navegar para a página de detalhes do contrato criado
    navigate(`/contracts/details/${newContractId}`)
  }

  const handleCancel = () => {
    navigate("/contracts")
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
            <span>Contratos</span>
            <span>/</span>
            <span>Registar Novo Contrato</span>
          </div>
          <h1 className="text-2xl font-semibold">Adicionar Contrato</h1>
        </div>
        <div className="ml-auto flex gap-3">
          <Button variant="outline" onClick={handleCancel}>
            CANCELAR
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSubmit}>
            CONTINUAR
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* NIF */}
          <div className="space-y-2">
            <Label htmlFor="nif" className="text-sm font-medium text-muted-foreground">
              NIF*
            </Label>
            <Input
              id="nif"
              value={formData.nif}
              onChange={(e) => handleInputChange("nif", e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* NOME */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium text-muted-foreground">
              NOME*
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              className="w-full"
            />
          </div>

          {/* MORADA */}
          <div className="space-y-2">
            <Label htmlFor="morada" className="text-sm font-medium text-muted-foreground">
              MORADA
            </Label>
            <Input
              id="morada"
              value={formData.morada}
              onChange={(e) => handleInputChange("morada", e.target.value)}
              className="w-full"
            />
          </div>

          {/* CÓDIGO POSTAL and LOCALIDADE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigoPostal" className="text-sm font-medium text-muted-foreground">
                CÓDIGO POSTAL
              </Label>
              <Input
                id="codigoPostal"
                value={formData.codigoPostal}
                onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="localidade" className="text-sm font-medium text-muted-foreground">
                LOCALIDADE
              </Label>
              <Input
                id="localidade"
                value={formData.localidade}
                onChange={(e) => handleInputChange("localidade", e.target.value)}
              />
            </div>
          </div>

          {/* TELEFONE and EMAIL */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-sm font-medium text-muted-foreground">
                TELEFONE
              </Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                EMAIL
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>

          {/* MÉTODO PAGAMENTO */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              MÉTODO PAGAMENTO
            </Label>
            <Select value={formData.metodoPagamento} onValueChange={(value) => handleInputChange("metodoPagamento", value)}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                <SelectItem value="multibanco">Multibanco</SelectItem>
                <SelectItem value="debito_direto">Débito Direto</SelectItem>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CÓDIGO DA CRC and DATA VALIDADE DA CRC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigoCrc" className="text-sm font-medium text-muted-foreground">
                CÓDIGO DA CRC
              </Label>
              <Input
                id="codigoCrc"
                placeholder="ex. 0001-2345-6789"
                value={formData.codigoCrc}
                onChange={(e) => handleInputChange("codigoCrc", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                DATA VALIDADE DA CRC
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.dataValidadeCrc ? (
                      format(formData.dataValidadeCrc, "dd/MM/yyyy", { locale: pt })
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.dataValidadeCrc}
                    onSelect={(date) => setFormData(prev => ({ ...prev, dataValidadeCrc: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* NOTAS */}
          <div className="space-y-2">
            <Label htmlFor="notas" className="text-sm font-medium text-muted-foreground">
              NOTAS
            </Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => handleInputChange("notas", e.target.value)}
              className="w-full min-h-24"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddContract