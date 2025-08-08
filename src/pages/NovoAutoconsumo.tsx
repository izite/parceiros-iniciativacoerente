import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const NovoAutoconsumo = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    prioridade: "",
    nifCliente: "",
    nomeCliente: "",
    tipo: "",
    nomeResponsavel: "",
    telefone: "",
    email: "",
    nomeResponsavel2: "",
    tensao: "",
    cpe: "",
    tipoContador: "",
    morada: "",
    codigoPostal: "",
    localInstalacao: "",
    materialTelhado: "",
    horarioFuncionamento: "",
    fechaMes: "",
    propostaOutroFornecedor: "",
    observacoes: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form data:", formData)
    // Add submit logic here
    navigate("/autoconsumo")
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/autoconsumo")} className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span>Autoconsumo</span>
          <span>/</span>
          <span>Novo Pedido</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Novo Pedido</h1>
          <Button 
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8"
          >
            CRIAR PEDIDO
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prioridade */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="prioridade">PRIORIDADE</Label>
                <Select value={formData.prioridade} onValueChange={(value) => handleInputChange("prioridade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Normal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">CLIENTE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nifCliente">NIF Cliente</Label>
                <Input
                  id="nifCliente"
                  value={formData.nifCliente}
                  onChange={(e) => handleInputChange("nifCliente", e.target.value)}
                  placeholder="NIF Cliente"
                />
              </div>
              <div>
                <Label htmlFor="nomeCliente">Nome Cliente</Label>
                <Input
                  id="nomeCliente"
                  value={formData.nomeCliente}
                  onChange={(e) => handleInputChange("nomeCliente", e.target.value)}
                  placeholder="Nome Cliente"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tipo */}
        <Card>
          <CardContent className="pt-6">
            <div>
              <Label htmlFor="tipo">TIPO</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residencial">Residencial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dados de Contacto */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="nomeResponsavel">NOME COMPLETO RESPONSÁVEL EMPRESA</Label>
                <Input
                  id="nomeResponsavel"
                  value={formData.nomeResponsavel}
                  onChange={(e) => handleInputChange("nomeResponsavel", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="telefone">TELEFONE</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange("telefone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">EMAIL</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="nomeResponsavel2">NOME RESPONSÁVEL (2ª ASSINATURA)</Label>
              <Input
                id="nomeResponsavel2"
                value={formData.nomeResponsavel2}
                onChange={(e) => handleInputChange("nomeResponsavel2", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ponto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Ponto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="tensao">TENSÃO</Label>
                <Select value={formData.tensao} onValueChange={(value) => handleInputChange("tensao", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bt">BT (Baixa Tensão)</SelectItem>
                    <SelectItem value="mt">MT (Média Tensão)</SelectItem>
                    <SelectItem value="at">AT (Alta Tensão)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cpe">CPE</Label>
                <Input
                  id="cpe"
                  value={formData.cpe}
                  onChange={(e) => handleInputChange("cpe", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="tipoContador">TIPO DE CONTADOR</Label>
                  <Select value={formData.tipoContador} onValueChange={(value) => handleInputChange("tipoContador", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monofasico">Monofásico</SelectItem>
                      <SelectItem value="trifasico">Trifásico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <HelpCircle className="h-4 w-4 text-muted-foreground mt-6" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="morada">MORADA</Label>
                <Input
                  id="morada"
                  value={formData.morada}
                  onChange={(e) => handleInputChange("morada", e.target.value)}
                  placeholder="Introduza uma morada ou coordenadas geográficas"
                />
              </div>
              <div>
                <Label htmlFor="codigoPostal">CÓDIGO POSTAL</Label>
                <Input
                  id="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes da Instalação */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="localInstalacao">LOCAL DE INSTALAÇÃO</Label>
                  <Select value={formData.localInstalacao} onValueChange={(value) => handleInputChange("localInstalacao", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="telhado">Telhado</SelectItem>
                      <SelectItem value="terraco">Terraço</SelectItem>
                      <SelectItem value="solo">Solo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <HelpCircle className="h-4 w-4 text-muted-foreground mt-6" />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="materialTelhado">MATERIAL DO TELHADO</Label>
                  <Select value={formData.materialTelhado} onValueChange={(value) => handleInputChange("materialTelhado", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="telha">Telha</SelectItem>
                      <SelectItem value="chapa">Chapa</SelectItem>
                      <SelectItem value="laje">Laje</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <HelpCircle className="h-4 w-4 text-muted-foreground mt-6" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horarioFuncionamento">HORÁRIO DE FUNCIONAMENTO</Label>
                <Select value={formData.horarioFuncionamento} onValueChange={(value) => handleInputChange("horarioFuncionamento", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 horas</SelectItem>
                    <SelectItem value="comercial">Horário Comercial</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="fechaMes">SE FECHA ALGUM MÊS DO ANO, QUAL?</Label>
                  <Textarea
                    id="fechaMes"
                    value={formData.fechaMes}
                    onChange={(e) => handleInputChange("fechaMes", e.target.value)}
                    placeholder="Deixe em branco caso não feche."
                    className="min-h-[80px]"
                  />
                </div>
                <HelpCircle className="h-4 w-4 text-muted-foreground mt-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proposta de Outro Fornecedor */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">O CLIENTE JÁ TEM PROPOSTA DE OUTRO FORNECEDOR?</Label>
              <Label className="text-xs text-muted-foreground">SE SIM, INDIQUE O NÚMERO DE PAINÉIS DESSA OFERTA & POTÊNCIA A INSTALAR</Label>
              <Textarea
                value={formData.propostaOutroFornecedor}
                onChange={(e) => handleInputChange("propostaOutroFornecedor", e.target.value)}
                placeholder="O Cliente já tem proposta de outro fornecedor? Se sim, indique o número de painéis dessa oferta & potência a instalar"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="observacoes">OBSERVAÇÕES</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange("observacoes", e.target.value)}
                placeholder="Observações"
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Poderá anexar ficheiros após criar o Pedido.
              </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default NovoAutoconsumo