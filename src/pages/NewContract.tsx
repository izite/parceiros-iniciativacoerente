import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useContracts } from "@/contexts/contracts-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronLeft, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const NewContract = () => {
  const navigate = useNavigate()
  const { addContract } = useContracts()
  const { toast } = useToast()
  
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
    notas: "",
    tipoContrato: "",
    fornecedorActual: "",
    tipo: "",
    cpe: "",
    tensao: "",
    potenciaContratada: "",
    ciclo: "",
    tarifa: "",
    fornecedor: "",
    campanha: "",
    campanhaVersao: "",
    dataAssinatura: undefined as Date | undefined,
    entradaDirecta: false,
    alteracaoTarifa: false,
    alteracaoTitular: false,
    dataRenunciaContrato: undefined as Date | undefined,
    observacoesContrato: "",
    pdfFiles: [] as File[]
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const pdfFiles = Array.from(files).filter(file => file.type === "application/pdf")
      setFormData(prev => ({ ...prev, pdfFiles: [...prev.pdfFiles, ...pdfFiles] }))
    }
  }

  const handleSubmit = async () => {
    try {
      console.log("Iniciando submissão do contrato...")
      
      if (!formData.nif || !formData.nome) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha o NIF e o Nome.",
          variant: "destructive"
        })
        return
      }

      const newContract = {
        nif: formData.nif,
        cliente_nome: formData.nome,
        estado: "Pendente",
        inicio_fornecimento: formData.dataRenunciaContrato ? format(formData.dataRenunciaContrato, "yyyy-MM-dd") : null,
        consumo: parseFloat(formData.potenciaContratada) || 0,
        comissao: 0,
        fornecedor: formData.fornecedor,
        cpe_cui: formData.cpe,
        tipo_energia: formData.tipo || "electricidade",
        notas: formData.observacoesContrato
      }

      console.log("Dados do contrato:", newContract)
      
      await addContract(newContract)
      
      toast({
        title: "Sucesso",
        description: "Contrato criado com sucesso!",
      })
      
      navigate("/contracts")
    } catch (error) {
      console.error("Erro ao criar contrato:", error)
      toast({
        title: "Erro",
        description: "Erro ao criar contrato. Tente novamente.",
        variant: "destructive"
      })
    }
  }

  const handleCancel = () => {
    navigate("/contracts")
  }

  const DatePicker = ({ 
    date, 
    onDateChange, 
    placeholder 
  }: { 
    date: Date | undefined
    onDateChange: (date: Date | undefined) => void
    placeholder: string 
  }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd-MM-yyyy") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8" onClick={() => navigate("/contracts")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Adicionar Contrato</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            CANCELAR
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSubmit}>
            INSERIR
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Informações do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nif">NIF*</Label>
                <Input
                  id="nif"
                  value={formData.nif}
                  onChange={(e) => handleInputChange("nif", e.target.value)}
                  placeholder=""
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nome">NOME*</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="morada">MORADA</Label>
              <Input
                id="morada"
                value={formData.morada}
                onChange={(e) => handleInputChange("morada", e.target.value)}
                placeholder=""
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigoPostal">CÓDIGO POSTAL</Label>
                <Input
                  id="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="localidade">LOCALIDADE</Label>
                <Input
                  id="localidade"
                  value={formData.localidade}
                  onChange={(e) => handleInputChange("localidade", e.target.value)}
                  placeholder=""
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">TELEFONE</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange("telefone", e.target.value)}
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">EMAIL</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder=""
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodoPagamento">MÉTODO PAGAMENTO</Label>
              <Select value={formData.metodoPagamento} onValueChange={(value) => handleInputChange("metodoPagamento", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multibanco">Multibanco</SelectItem>
                    <SelectItem value="debito-direto">Débito Direto</SelectItem>
                  </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigoCrc">CÓDIGO DA CRC</Label>
                <Input
                  id="codigoCrc"
                  value={formData.codigoCrc}
                  onChange={(e) => handleInputChange("codigoCrc", e.target.value)}
                  placeholder="ex. 0001-2345-6789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataValidadeCrc">DATA VALIDADE DA CRC</Label>
                <DatePicker
                  date={formData.dataValidadeCrc}
                  onDateChange={(date) => handleInputChange("dataValidadeCrc", date)}
                  placeholder="Selecionar data"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">NOTAS</Label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => handleInputChange("notas", e.target.value)}
                placeholder=""
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações do Contrato */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Contrato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoContrato">TIPO CONTRATO</Label>
                <Select value={formData.tipoContrato} onValueChange={(value) => handleInputChange("tipoContrato", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Negócios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negocios">Negócios</SelectItem>
                    <SelectItem value="particular">Particular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metodoPagamentoContrato">MÉTODO PAGAMENTO</Label>
                <Select value={formData.metodoPagamento} onValueChange={(value) => handleInputChange("metodoPagamento", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Multibanco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multibanco">Multibanco</SelectItem>
                    <SelectItem value="debito-direto">Débito Direto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fornecedorActual">FORNECEDOR ACTUAL</Label>
                <Select value={formData.fornecedorActual} onValueChange={(value) => handleInputChange("fornecedorActual", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edp">EDP</SelectItem>
                    <SelectItem value="endesa">Endesa</SelectItem>
                    <SelectItem value="iberdrola">Iberdrola</SelectItem>
                    <SelectItem value="galp">Galp Energia</SelectItem>
                    <SelectItem value="agora">Ágora Luz</SelectItem>
                    <SelectItem value="capwatt">CAPWATT</SelectItem>
                    <SelectItem value="nabalia">Nabalia</SelectItem>
                    <SelectItem value="plenitude">Plenitude</SelectItem>
                    <SelectItem value="portulogos">Portulogos</SelectItem>
                    <SelectItem value="yes">Yes Energy</SelectItem>
                    <SelectItem value="zug">Zug Power</SelectItem>
                    <SelectItem value="ezu">EZU Energia</SelectItem>
                    <SelectItem value="alfa">Alfa Energia</SelectItem>
                    <SelectItem value="use">Use Energy</SelectItem>
                    <SelectItem value="audax">Audax</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">TIPO</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Electricidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricidade">Electricidade</SelectItem>
                  <SelectItem value="gas">Gás</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Electricidade */}
        <Card>
          <CardHeader>
            <CardTitle>ELECTRICIDADE</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpe">CPE/CUI</Label>
              <Input
                id="cpe"
                value={formData.cpe}
                onChange={(e) => handleInputChange("cpe", e.target.value)}
                placeholder=""
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tensao">TENSÃO</Label>
                <Select value={formData.tensao} onValueChange={(value) => handleInputChange("tensao", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btn">BTN</SelectItem>
                    <SelectItem value="bte">BTE</SelectItem>
                    <SelectItem value="mt">MT</SelectItem>
                    <SelectItem value="at">AT</SelectItem>
                    <SelectItem value="mat">MAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="potenciaContratada">POTÊNCIA CONTRATADA</Label>
                <div className="flex">
                  <Input
                    id="potenciaContratada"
                    value={formData.potenciaContratada}
                    onChange={(e) => handleInputChange("potenciaContratada", e.target.value)}
                    placeholder=""
                  />
                  <span className="flex items-center px-3 bg-muted text-muted-foreground text-sm border border-l-0 rounded-r-md">
                    KVA
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciclo">CICLO</Label>
                <Select value={formData.ciclo} onValueChange={(value) => handleInputChange("ciclo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem-ciclo">Sem Ciclo</SelectItem>
                    <SelectItem value="diario">Diario</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="semanal-opcional">Semanal Opcional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tarifa">TARIFA</Label>
                <Select value={formData.tarifa} onValueChange={(value) => handleInputChange("tarifa", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples">Simples</SelectItem>
                    <SelectItem value="bi-horario">Bi-Horario</SelectItem>
                    <SelectItem value="tri-horario">Tri-Horario</SelectItem>
                    <SelectItem value="tetra-horario">Tetra-Horario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes do Contrato */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Contrato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fornecedor">FORNECEDOR</Label>
                <Select value={formData.fornecedor} onValueChange={(value) => handleInputChange("fornecedor", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edp">EDP</SelectItem>
                    <SelectItem value="endesa">Endesa</SelectItem>
                    <SelectItem value="iberdrola">Iberdrola</SelectItem>
                    <SelectItem value="galp">Galp Energia</SelectItem>
                    <SelectItem value="agora">Ágora Luz</SelectItem>
                    <SelectItem value="capwatt">CAPWATT</SelectItem>
                    <SelectItem value="nabalia">Nabalia</SelectItem>
                    <SelectItem value="plenitude">Plenitude</SelectItem>
                    <SelectItem value="portulogos">Portulogos</SelectItem>
                    <SelectItem value="yes">Yes Energy</SelectItem>
                    <SelectItem value="zug">Zug Power</SelectItem>
                    <SelectItem value="ezu">EZU Energia</SelectItem>
                    <SelectItem value="alfa">Alfa Energia</SelectItem>
                    <SelectItem value="use">Use Energy</SelectItem>
                    <SelectItem value="audax">Audax</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="campanha">CAMPANHA</Label>
                <Input
                  id="campanha"
                  value={formData.campanha}
                  onChange={(e) => handleInputChange("campanha", e.target.value)}
                  placeholder="Pesquise por uma campanha..."
                />
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataAssinatura">DATA DE ASSINATURA</Label>
                <DatePicker
                  date={formData.dataAssinatura}
                  onDateChange={(date) => handleInputChange("dataAssinatura", date)}
                  placeholder="28-07-2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigoCrcDetalhes">CÓDIGO DA CRC</Label>
                <Input
                  id="codigoCrcDetalhes"
                  value={formData.codigoCrc}
                  onChange={(e) => handleInputChange("codigoCrc", e.target.value)}
                  placeholder="ex. 0001-2345-6789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataValidadeCrcDetalhes">DATA VALIDADE DA CRC</Label>
                <DatePicker
                  date={formData.dataValidadeCrc}
                  onDateChange={(date) => handleInputChange("dataValidadeCrc", date)}
                  placeholder="Selecionar data"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="entradaDirecta" 
                  checked={formData.entradaDirecta}
                  onCheckedChange={(checked) => handleInputChange("entradaDirecta", checked)}
                />
                <Label htmlFor="entradaDirecta">Entrada Directa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="alteracaoTarifa" 
                  checked={formData.alteracaoTarifa}
                  onCheckedChange={(checked) => handleInputChange("alteracaoTarifa", checked)}
                />
                <Label htmlFor="alteracaoTarifa">Alteração de Tarifa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="alteracaoTitular" 
                  checked={formData.alteracaoTitular}
                  onCheckedChange={(checked) => handleInputChange("alteracaoTitular", checked)}
                />
                <Label htmlFor="alteracaoTitular">Alteração de Titular</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataRenunciaContrato">DATA DE INICIO DE FORNECIMENTO *</Label>
              <DatePicker
                date={formData.dataRenunciaContrato}
                onDateChange={(date) => handleInputChange("dataRenunciaContrato", date)}
                placeholder="Selecionar data"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoesContrato">OBSERVAÇÕES DO CONTRATO</Label>
              <Textarea
                id="observacoesContrato"
                value={formData.observacoesContrato}
                onChange={(e) => handleInputChange("observacoesContrato", e.target.value)}
                placeholder="Outros detalhes que possam ser úteis para o processamento deste contrato."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload de Ficheiros PDF */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos do Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Arraste ficheiros PDF para aqui ou clique para selecionar
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('pdf-upload')?.click()}
                  >
                    Selecionar Ficheiros PDF
                  </Button>
                </div>
              </div>
              
              {formData.pdfFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Ficheiros Selecionados:</Label>
                  <div className="space-y-1">
                    {formData.pdfFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newFiles = formData.pdfFiles.filter((_, i) => i !== index)
                            handleInputChange("pdfFiles", newFiles)
                          }}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex justify-center gap-4 mt-8 pb-6">
        <Button variant="outline" onClick={handleCancel} className="px-8">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white px-8">
          Inserir
        </Button>
      </div>
    </div>
  )
}

export default NewContract