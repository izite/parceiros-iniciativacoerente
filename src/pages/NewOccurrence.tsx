import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Home, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useUsers } from "@/contexts/users-context"
import { useOccurrences } from "@/contexts/occurrences-context"

const NewOccurrence = () => {
  const navigate = useNavigate()
  const { users } = useUsers()
  const { addOccurrence } = useOccurrences()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    assunto: "",
    descricao: "",
    cliente_nome: "",
    nif: "",
    cpe_cui: "",
    estado: "Pendente",
    utilizador_id: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addOccurrence({
        assunto: formData.assunto,
        descricao: formData.descricao,
        cliente_nome: formData.cliente_nome,
        cpe_cui: formData.cpe_cui,
        estado: formData.estado,
        autor_id: formData.utilizador_id || undefined
      })
      
      navigate('/occurrences')
    } catch (error) {
      console.error('Erro ao criar ocorrência:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/occurrences">Ocorrências</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nova Ocorrência</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/occurrences')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Nova Ocorrência</h1>
          <p className="text-muted-foreground">Crie uma nova ocorrência no sistema</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dados da Ocorrência</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Assunto */}
            <div className="space-y-2">
              <Label htmlFor="assunto">Assunto *</Label>
              <Input
                id="assunto"
                value={formData.assunto}
                onChange={(e) => handleInputChange('assunto', e.target.value)}
                placeholder="Ex: Problema na faturação energética"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Descreva detalhadamente a ocorrência..."
                rows={4}
              />
            </div>

            {/* Dados do Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente_nome">Nome do Cliente *</Label>
                <Input
                  id="cliente_nome"
                  value={formData.cliente_nome}
                  onChange={(e) => handleInputChange('cliente_nome', e.target.value)}
                  placeholder="Ex: EMPRESA TESTE, LDA"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nif">NIF</Label>
                <Input
                  id="nif"
                  value={formData.nif}
                  onChange={(e) => handleInputChange('nif', e.target.value)}
                  placeholder="123456789"
                />
              </div>
            </div>

            {/* CPE/CUI */}
            <div className="space-y-2">
              <Label htmlFor="cpe_cui">CPE/CUI</Label>
              <Input
                id="cpe_cui"
                value={formData.cpe_cui}
                onChange={(e) => handleInputChange('cpe_cui', e.target.value)}
                placeholder="PT0001234567890123456789012"
              />
            </div>

            {/* Utilizador */}
            <div className="space-y-2">
              <Label htmlFor="utilizador_id">Utilizador</Label>
              <Select value={formData.utilizador_id} onValueChange={(value) => handleInputChange('utilizador_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar utilizador" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.nome} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Análise">Em Análise</SelectItem>
                  <SelectItem value="Resolvido">Resolvido</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'A criar...' : 'Criar Ocorrência'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/occurrences')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewOccurrence