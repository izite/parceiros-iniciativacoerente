import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Phone, Mail, Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/user-context"
import { useContacts } from "@/contexts/contacts-context"

export default function Dashboard() {
  const { user } = useUser()
  const { contacts } = useContacts()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  )

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getStatusColor = (status: string) => {
    return 'bg-green-500' // Por padrão todos activos
  }

  const getCurrentDate = () => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    
    const now = new Date()
    const dayName = days[now.getDay()]
    const day = now.getDate()
    const month = months[now.getMonth()]
    const year = now.getFullYear()
    
    return `${dayName}, ${day} de ${month} de ${year}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">
          Olá {user?.name || "Bruno"}, {getCurrentDate()}
        </h1>
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Contactos da Empresa</h2>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <Button className="h-11 px-6" onClick={() => navigate("/contacts/add")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Contacto
        </Button>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(contact.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
                    <Badge className="bg-green-500 text-white text-xs">
                      Activo
                    </Badge>
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/contacts/add?edit=${contact.id}`)}
                  className="ml-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum contacto encontrado</h3>
          <p className="text-muted-foreground">Tente ajustar sua pesquisa ou adicione um novo contacto.</p>
        </div>
      )}
    </div>
  )
}