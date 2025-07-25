import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Filter, Eye, Edit, Trash2, Building2, Mail, Phone } from "lucide-react"

const customers = [
  {
    id: "CUST-001",
    name: "Metro Energy Corp",
    email: "contact@metroenergy.com",
    phone: "+1 (555) 123-4567",
    type: "Corporate",
    activeContracts: 3,
    totalValue: "$485,000",
    status: "active",
    lastContact: "2024-01-15"
  },
  {
    id: "CUST-002",
    name: "Industrial Solutions Ltd",
    email: "info@industrialsolutions.com",
    phone: "+1 (555) 234-5678",
    type: "Industrial",
    activeContracts: 2,
    totalValue: "$156,500",
    status: "active",
    lastContact: "2024-01-14"
  },
  {
    id: "CUST-003",
    name: "Green Power Inc",
    email: "hello@greenpower.com",
    phone: "+1 (555) 345-6789",
    type: "Renewable",
    activeContracts: 1,
    totalValue: "$250,000",
    status: "active",
    lastContact: "2024-01-13"
  },
  {
    id: "CUST-004",
    name: "City Municipal",
    email: "utilities@cityoffice.gov",
    phone: "+1 (555) 456-7890",
    type: "Government",
    activeContracts: 1,
    totalValue: "$180,000",
    status: "inactive",
    lastContact: "2024-01-10"
  },
  {
    id: "CUST-005",
    name: "Tech Industries",
    email: "procurement@techindustries.com",
    phone: "+1 (555) 567-8901",
    type: "Corporate",
    activeContracts: 2,
    totalValue: "$195,000",
    status: "active",
    lastContact: "2024-01-20"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-success text-success-foreground"
    case "inactive": return "bg-muted text-muted-foreground"
    case "prospect": return "bg-warning text-warning-foreground"
    default: return "bg-secondary text-secondary-foreground"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "Corporate": return "bg-primary/10 text-primary"
    case "Industrial": return "bg-accent/10 text-accent"
    case "Renewable": return "bg-success/10 text-success"
    case "Government": return "bg-warning/10 text-warning"
    default: return "bg-secondary/10 text-secondary"
  }
}

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState(customers)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(value.toLowerCase()) ||
      customer.email.toLowerCase().includes(value.toLowerCase()) ||
      customer.type.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredCustomers(filtered)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Utilizadores</h1>
          <p className="text-muted-foreground">
            Gerir clientes e potenciais clientes do sector energético
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Utilizador
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Utilizadores</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilizadores Ativos</p>
                <p className="text-2xl font-bold">{customers.filter(c => c.status === "active").length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-success"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Contratos</p>
                <p className="text-2xl font-bold">{customers.reduce((sum, c) => sum + c.activeContracts, 0)}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-accent"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">1,27M€</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-warning"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Todos os Utilizadores</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Procurar utilizadores..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{customer.name}</p>
                      <Badge variant="outline" className="text-xs">{customer.id}</Badge>
                      <Badge className={getTypeColor(customer.type)}>{customer.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{customer.totalValue}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.activeContracts} active contracts
                    </p>
                  </div>
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Customers