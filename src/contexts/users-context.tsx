import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/integrations/supabase/client"

export type AppUser = {
  id: string
  nome: string
  email: string
  telefone: string
  empresa: string
  estado: string
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
  const [users, setUsers] = useState<AppUser[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        return
      }

      const mappedUsers: AppUser[] = data.map(user => ({
        id: user.id,
        nome: user.nome || '',
        email: user.email,
        telefone: user.telefone || '',
        empresa: user.empresa || '',
        estado: user.estado || 'Ativo'
      }))

      setUsers(mappedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const addUser = async (user: Omit<AppUser, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          empresa: user.empresa,
          estado: user.estado,
          tipo: 'utilizador'
        }])
        .select()

      if (error) {
        console.error('Error creating user:', error)
        return
      }

      if (data && data[0]) {
        const newUser: AppUser = {
          id: data[0].id,
          nome: data[0].nome || '',
          email: data[0].email,
          telefone: data[0].telefone || '',
          empresa: data[0].empresa || '',
          estado: data[0].estado || 'Ativo'
        }
        setUsers(prev => [newUser, ...prev])
      }
    } catch (error) {
      console.error('Error creating user:', error)
    }
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