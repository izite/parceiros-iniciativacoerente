import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useSimulacoes } from "@/contexts/simulacoes-context"
import { supabase } from "@/integrations/supabase/client"

const MAX_FILE_SIZE = 30 * 1024 * 1024 // 30 MB

const NovaSimulacao = () => {
  const navigate = useNavigate()
  const { createSimulacao } = useSimulacoes()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    nif: "",
    tipoTarifa: "",
    prioridade: "normal",
    consumoEstimado: "",
    comissaoEstimada: "",
    observacoes: "",
    fatura: undefined as File | undefined,
  })

  const handleChange = (field: string, value: string | File | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validações
      if (!formData.nome.trim()) {
        toast.error("Nome é obrigatório")
        return
      }
      if (!formData.tipoTarifa) {
        toast.error("Tipo de tarifa é obrigatório")
        return
      }

      if (formData.fatura) {
        if (formData.fatura.type !== "application/pdf") {
          toast.error("A fatura deve ser um ficheiro PDF.")
          return
        }
        if (formData.fatura.size > MAX_FILE_SIZE) {
          toast.error("Tamanho máximo da fatura é 30 MB.")
          return
        }
      }

      let faturaPath: string | undefined

      // Upload da fatura se existir
      if (formData.fatura) {
        const fileName = `simulacoes/faturas/${Date.now()}-${formData.fatura.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('drive')
          .upload(fileName, formData.fatura)

        if (uploadError) {
          console.error('Erro no upload da fatura:', uploadError)
          toast.error('Erro ao fazer upload da fatura')
          return
        }

        faturaPath = uploadData.path
      }

      // Criar simulação
      const simulacao = await createSimulacao({
        nome: formData.nome,
        nif: formData.nif || undefined,
        tipo_tarifa: formData.tipoTarifa,
        prioridade: formData.prioridade,
        consumo_estimado_kwh: formData.consumoEstimado ? parseFloat(formData.consumoEstimado) : undefined,
        comissao_estimada_eur: formData.comissaoEstimada ? parseFloat(formData.comissaoEstimada) : undefined,
        observacoes: formData.observacoes || undefined,
        fatura_pdf_path: faturaPath,
        estado: formData.prioridade === 'urgente' ? 'pendente_analise' : 'pendente'
      })

      if (simulacao) {
        navigate("/simulacoes")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Breadcrumb + Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/simulacoes")} className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span>Simulações</span>
          <span>/</span>
          <span>Criar Simulação</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Criar Simulação</h1>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8"
          >
            {loading ? "A CRIAR..." : "CRIAR SIMULAÇÃO"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="nif">NIF</Label>
                <Input id="nif" value={formData.nif} onChange={(e) => handleChange("nif", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parâmetros da Simulação */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoTarifa">Tipo de tarifa</Label>
                <Select value={formData.tipoTarifa} onValueChange={(v) => handleChange("tipoTarifa", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indexado">Indexado</SelectItem>
                    <SelectItem value="fixo">Fixo</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={formData.prioridade} onValueChange={(v) => handleChange("prioridade", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Normal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="consumoEstimado">Consumo estimado (kWh)</Label>
                <Input
                  id="consumoEstimado"
                  type="number"
                  inputMode="decimal"
                  value={formData.consumoEstimado}
                  onChange={(e) => handleChange("consumoEstimado", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="comissaoEstimada">Comissão estimada (€)</Label>
                <Input
                  id="comissaoEstimada"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={formData.comissaoEstimada}
                  onChange={(e) => handleChange("comissaoEstimada", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                placeholder="Notas adicionais sobre a simulação"
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ficheiro */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="fatura">Carregar fatura (PDF, máx. 30 MB)</Label>
              <Input
                id="fatura"
                type="file"
                accept="application/pdf"
                onChange={(e) => handleChange("fatura", e.target.files?.[0])}
              />
              <p className="text-xs text-muted-foreground">Apenas ficheiros PDF são aceites.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/simulacoes")} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white">
            {loading ? "A criar..." : "Criar Simulação"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NovaSimulacao
