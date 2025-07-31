import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useContacts } from "@/contexts/contacts-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Plus, Phone, Mail, User, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { supabase } from "@/integrations/supabase/client"

export default function Contacts() {
  const { contacts, loading, addContact, deleteContact, fetchContacts } = useContacts()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null)

  // Carregar perfil do utilizador atual
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('auth_user_id', user.id)
          .single()
        
        if (data && !error) {
          setCurrentUserProfile(data)
        }
      }
    }
    loadUserProfile()
  }, [user])

  // Carregar contactos ao montar a página
  useEffect(() => {
    fetchContacts()
  }, [])

  // Verificar se é backoffice
  const isBackoffice = currentUserProfile?.role === 'backoffice'

  const getCurrentDate = () => {
    const today = new Date()
    const dayOfWeek = format(today, "EEEE", { locale: ptBR })
    const fullDate = format(today, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    return `Hoje é ${dayOfWeek}, ${fullDate}`
  }

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

    await addContact({ nome, email, telefone, empresa })
    toast({
      title: "Contacto criado",
      description: `O contacto "${nome}" foi criado com sucesso.`
    })

    // Limpar formulário e fechar dialog
    setNome("")
    setEmail("")
    setTelefone("")
    setEmpresa("")
    setOpen(false)
  }

  const handleDeleteContact = async (contactId: string, contactName: string) => {
    if (window.confirm(`Tem a certeza que deseja eliminar o contacto "${contactName}"?`)) {
      await deleteContact(contactId)
      toast({
        title: "Contacto eliminado",
        description: `O contacto "${contactName}" foi eliminado com sucesso.`
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">A carregar contactos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com saudação e data */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Olá {user?.email?.split('@')[0] || 'Utilizador'}
        </h1>
        <p className="text-muted-foreground">
          {getCurrentDate()}
        </p>
      </div>

      {/* Seção de Contactos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-white" />
            <CardTitle className="text-white">Contactos Parceiros Iniciativa Coerente</CardTitle>
          </div>
          {isBackoffice && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Contacto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Novo Contacto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Nome completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
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
                    <Label htmlFor="telefone">Número de Contacto</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="+351 900 000 000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empresa">Empresa</Label>
                    <Input
                      id="empresa"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      placeholder="Nome da empresa"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1">
                      Criar Contacto
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum contacto encontrado
            </div>
          ) : (
            <div className="grid gap-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{contact.nome}</p>
                        {contact.empresa && (
                          <p className="text-sm text-muted-foreground">{contact.empresa}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contact.telefone}</span>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteContact(contact.id, contact.nome)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}