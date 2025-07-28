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
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
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
        setNome(contact.nome)
        setEmail(contact.email || "")
        setTelefone(contact.telefone || "")
        setEmpresa(contact.empresa || "")
      }
    }
  }, [editId, getContact])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nome || !email || !telefone || !empresa) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      })
      return
    }

    if (editId) {
      await updateContact(editId, { nome, email, telefone, empresa })
      toast({
        title: "Contacto atualizado",
        description: `O contacto "${nome}" foi atualizado com sucesso.`
      })
    } else {
      await addContact({ nome, email, telefone, empresa })
      toast({
        title: "Contacto criado",
        description: `O contacto "${nome}" foi criado com sucesso.`
      })
    }

    navigate("/customers")
  }

  const handleDelete = () => {
    if (editId) {
      deleteContact(editId)
      toast({
        title: "Contacto eliminado",
        description: "O contacto foi eliminado com sucesso."
      })
      navigate("/customers")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/customers")} size="sm">
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
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
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
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
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
              <Button type="button" variant="outline" onClick={() => navigate("/customers")}>
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