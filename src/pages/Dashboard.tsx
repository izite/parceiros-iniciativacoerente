import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useContacts } from "@/contexts/contacts-context"
import { useContracts } from "@/contexts/contracts-context"
import { useState } from "react"
import { Mail, Phone, ChevronRight, Plus, Search } from "lucide-react"

const Dashboard = () => {
  const { contacts } = useContacts()
  const { contracts } = useContracts()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredContacts = contacts.filter(contact =>
    contact.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.telefone?.includes(searchTerm)
  )

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || "?"
  }

  const stats = [
    { title: "Total Contratos", value: contracts.length, change: "+12% desde o último mês", color: "text-green-600" },
    { title: "Contratos Ativos", value: contracts.filter(c => c.estado === "Activo").length, change: "+8% desde o último mês", color: "text-green-600" },
    { title: "Total Clientes", value: contacts.length, change: "+15% desde o último mês", color: "text-green-600" },
    { title: "Receita Mensal", value: "€12,450", change: "+20% desde o último mês", color: "text-green-600" }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.color}`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Contactos Recentes</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Pesquisar contactos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredContacts.slice(0, 5).map((contact) => (
                  <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(contact.nome || "")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{contact.nome}</h3>
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
                          <span>{contact.telefone}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Contracts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Contratos Recentes</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {contracts.slice(0, 5).map((contract) => (
                <div key={contract.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{contract.cliente_nome}</span>
                      <Badge variant="secondary" className="text-xs">
                        {contract.estado}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      NIF: {contract.nif}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard