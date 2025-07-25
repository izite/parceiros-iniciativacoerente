import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUsers } from "@/contexts/users-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, User, Plus, ChevronRight } from "lucide-react"


const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "activo": return "bg-success text-success-foreground"
    case "inactivo": return "bg-muted text-muted-foreground"
    case "pendente": return "bg-warning text-warning-foreground"
    default: return "bg-secondary text-secondary-foreground"
  }
}

const getStatusDot = (status: string) => {
  switch (status.toLowerCase()) {
    case "activo": return "bg-success"
    case "inactivo": return "bg-muted-foreground"
    case "pendente": return "bg-warning"
    default: return "bg-secondary"
  }
}

const Users = () => {
  const navigate = useNavigate()
  const { users } = useUsers()
  const [filteredUsers, setFilteredUsers] = useState(users)

  useEffect(() => {
    setFilteredUsers(users)
  }, [users])

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button and create button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Utilizadores</h1>
        <Button 
          className="ml-auto bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => navigate("/users/add")}
        >
          <Plus className="h-4 w-4 mr-2" />
          NOVO UTILIZADOR
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    NOME
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    EMAIL
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">TELEFONE</TableHead>
                <TableHead className="text-muted-foreground font-medium">EMPRESA</TableHead>
                <TableHead className="text-muted-foreground font-medium">ESTADO</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telefone}</TableCell>
                  <TableCell>{user.empresa}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.estado)} variant="secondary">
                      <div className={`w-2 h-2 rounded-full ${getStatusDot(user.estado)} mr-1`}></div>
                      {user.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => navigate(`/users/edit/${user.id}`)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Users