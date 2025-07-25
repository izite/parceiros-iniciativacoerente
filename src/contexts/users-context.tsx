import { createContext, useContext, useState, ReactNode } from "react"

export type AppUser = {
  id: string
  nome: string
  email: string
  telefone: string
  empresa: string
  estado: string
  dataNascimento?: Date
}

type UsersContextType = {
  users: AppUser[]
  addUser: (user: Omit<AppUser, 'id'>) => void
  updateUser: (id: string, user: Partial<AppUser>) => void
  deleteUser: (id: string) => void
  getUserById: (id: string) => AppUser | undefined
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>([
    {
      id: "1",
      nome: "João Silva",
      email: "joao.silva@company.com",
      telefone: "+351 912 345 678",
      empresa: "Tech Solutions",
      estado: "Activo"
    },
    {
      id: "2", 
      nome: "Maria Santos",
      email: "maria.santos@enterprise.com",
      telefone: "+351 923 456 789",
      empresa: "Enterprise Corp",
      estado: "Activo"
    },
    {
      id: "3",
      nome: "Pedro Costa",
      email: "pedro.costa@business.com", 
      telefone: "+351 934 567 890",
      empresa: "Business Ltd",
      estado: "Activo"
    },
    {
      id: "4",
      nome: "Ana Ferreira",
      email: "ana.ferreira@solutions.com",
      telefone: "+351 945 678 901",
      empresa: "Solutions Inc",
      estado: "Activo"
    },
    {
      id: "5",
      nome: "Carlos Oliveira", 
      email: "carlos.oliveira@group.com",
      telefone: "+351 956 789 012",
      empresa: "Group Holdings",
      estado: "Activo"
    }
  ])

  const addUser = (user: Omit<AppUser, 'id'>) => {
    const newUser = {
      ...user,
      id: Date.now().toString()
    }
    setUsers(prev => [...prev, newUser])
  }

  const updateUser = (id: string, userData: Partial<AppUser>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ))
  }

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id))
  }

  const getUserById = (id: string) => {
    return users.find(user => user.id === id)
  }

  return (
    <UsersContext.Provider value={{ 
      users, 
      addUser, 
      updateUser, 
      deleteUser, 
      getUserById 
    }}>
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider")
  }
  return context
}