import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useUsers } from "@/contexts/users-context"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Home, Trash2 } from "lucide-react"

const EditUser = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getUserById, updateUser, deleteUser } = useUsers()
  const [parceiros, setParceiros] = useState<Array<{id: string, nome: string}>>([])
  const [formData, setFormData] = useState({
    estado: "Activo",
    nome: "",
    email: "",
    telemovel: "",
    empresa: "",
    nivel: "",
    parceiro_id: ""
  })

  useEffect(() => {
    fetchParceiros()
    if (id) {
      const user = getUserById(id)
      if (user) {
        setFormData({
          estado: user.estado,
          nome: user.nome,
          email: user.email,
          telemovel: user.telefone,
          empresa: user.empresa,
          nivel: user.perfil || "",
          parceiro_id: user.parceiro_id || ""
        })
      }
    }
  }, [id, getUserById])

  const fetchParceiros = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, empresa')
        .eq('perfil', 'parceiro')
        .order('empresa')

      if (error) {
        console.error('Error fetching parceiros:', error)
        return
      }

      setParceiros(data?.map(user => ({
        id: user.id,
        nome: user.empresa || 'Sem empresa'
      })) || [])
    } catch (error) {
      console.error('Error fetching parceiros:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (id) {
      updateUser(id, {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telemovel,
        empresa: formData.empresa,
        estado: formData.estado,
        perfil: formData.nivel,
        parceiro_id: formData.parceiro_id
      })
    }
    
    navigate("/users")
  }

  const handleDeleteUser = async () => {
    if (id && window.confirm("Tem certeza que deseja apagar este utilizador?")) {
      await deleteUser(id)
      navigate("/users")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Home className="h-4 w-4" />
        <span>Home</span>
        <span>/</span>
        <span>Utilizadores</span>
        <span>/</span>
        <span className="text-foreground">Editar Utilizador</span>
      </div>

      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-8 w-8"
          onClick={() => navigate("/users")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Editar Utilizador</h1>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Dados Pessoais</CardTitle>
          <p className="text-sm text-muted-foreground">
            Estado, Nome, Email, Telemóvel, Empresa, Nível
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado">ESTADO</Label>
                <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nível */}
              <div className="space-y-2">
                <Label htmlFor="nivel">NÍVEL</Label>
                <Select value={formData.nivel} onValueChange={(value) => handleInputChange("nivel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backoffice">Backoffice</SelectItem>
                    <SelectItem value="parceiro">Parceiro</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">NOME</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                className="border-orange-200 focus:border-orange-500"
                placeholder="Nome completo"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">EMAIL</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            {/* Empresa */}
            <div className="space-y-2">
              <Label htmlFor="empresa">EMPRESA</Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => handleInputChange("empresa", e.target.value)}
                placeholder="Nome da empresa"
              />
            </div>

            {/* Telemóvel */}
            <div className="space-y-2">
              <Label htmlFor="telemovel">TELEMÓVEL</Label>
              <Input
                id="telemovel"
                value={formData.telemovel}
                onChange={(e) => handleInputChange("telemovel", e.target.value)}
                placeholder="+351 912 345 678"
              />
            </div>

            {/* Parceiro ID - aparece se nível for comercial ou parceiro */}
            {(formData.nivel === "comercial" || formData.nivel === "parceiro") && (
              <div className="space-y-2">
                <Label htmlFor="parceiro_id">PARCEIRO</Label>
                <Select value={formData.parceiro_id} onValueChange={(value) => handleInputChange("parceiro_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar parceiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {parceiros.map((parceiro) => (
                      <SelectItem key={parceiro.id} value={parceiro.id}>
                        {parceiro.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate("/users")}
                className="px-8"
              >
                CANCELAR
              </Button>
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDeleteUser}
                className="px-8"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                APAGAR UTILIZADOR
              </Button>
              <Button 
                type="submit" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              >
                ATUALIZAR UTILIZADOR
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditUser