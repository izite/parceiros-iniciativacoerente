import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useUsers } from "@/contexts/users-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeft, CalendarIcon, Home } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const EditUser = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getUserById, updateUser } = useUsers()
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    estado: "Activo",
    nome: "",
    email: "",
    telemovel: "",
    empresa: ""
  })

  useEffect(() => {
    if (id) {
      const user = getUserById(id)
      if (user) {
        setFormData({
          estado: user.estado,
          nome: user.nome,
          email: user.email,
          telemovel: user.telefone,
          empresa: user.empresa
        })
        if (user.dataNascimento) {
          setDate(user.dataNascimento)
        }
      }
    }
  }, [id, getUserById])

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
        dataNascimento: date
      })
    }
    
    navigate("/users")
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
            Estado, Nome, Email, Telemóvel, Empresa, Data Nascimento
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

            {/* Data Nascimento */}
            <div className="space-y-2">
              <Label>DATA NASCIMENTO</Label>
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
                    {date ? format(date, "dd-MM-yyyy") : <span>DD-MM-AAAA</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
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