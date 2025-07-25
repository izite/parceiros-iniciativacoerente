import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useContacts } from "@/contexts/contacts-context"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Trash2 } from "lucide-react"

export default function AddContact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [empresa, setEmpresa] = useState("")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const { addContact, updateContact, deleteContact, getContact } = useContacts()
  const { toast } = useToast()

  // Carregar dados do contacto se estivermos em modo de edição
  useEffect(() => {
    if (editId) {
      const contact = getContact(editId)
      if (contact) {
        setName(contact.name)
        setEmail(contact.email)
        setPhone(contact.phone)
        setEmpresa(contact.empresa)
      }
    }
  }, [editId, getContact])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !phone || !empresa) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      })
      return
    }

    if (editId) {
      updateContact(editId, { name, email, phone, empresa })
      toast({
        title: "Contacto atualizado",
        description: `O contacto "${name}" foi atualizado com sucesso.`
      })
    } else {
      addContact({ name, email, phone, empresa })
      toast({
        title: "Contacto criado",
        description: `O contacto "${name}" foi criado com sucesso.`
      })
    }

    navigate("/contacts")
  }

  const handleDelete = () => {
    if (editId) {
      deleteContact(editId)
      toast({
        title: "Contacto eliminado",
        description: "O contacto foi eliminado com sucesso."
      })
      navigate("/contacts")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/contacts")} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {editId ? "Editar Contacto" : "Novo Contacto"}
          </h1>
          <p className="text-muted-foreground">
            {editId ? "Edite as informações do contacto" : "Adicione um novo contacto ao sistema"}
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informações do Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Contacto *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+351 900 000 000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa *</Label>
                <Input
                  id="empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Nome da empresa"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {editId ? "Atualizar Contacto" : "Criar Contacto"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/contacts")}>
                Cancelar
              </Button>
              {editId && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  className="px-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}