import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export type AppUser = {
  id: string
  nome: string
  email: string
  telefone: string
  empresa: string
  estado: string
  perfil?: string
  parceiro_id?: string
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
  const { toast } = useToast()

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

      console.log('Fetched users from DB:', data) // Debug log

      const mappedUsers: AppUser[] = (data || []).map(user => ({
        id: user.id,
        nome: user.nome || '',
        email: user.email,
        telefone: user.telefone || '',
        empresa: user.empresa || '',
        estado: user.estado || 'Ativo',
        perfil: user.perfil || '',
        parceiro_id: user.parceiro_id || ''
      }))

      console.log('Setting users state to:', mappedUsers) // Debug log
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
          perfil: user.perfil,
          parceiro_id: user.parceiro_id || null, // Corrigir string vazia para null
          tipo: 'utilizador'
        }])
        .select()

      if (error) {
        console.error('Error creating user:', error)
        if (error.code === '23505') {
          toast({
            title: "Erro",
            description: "Já existe um utilizador com este email.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Erro",
            description: "Erro ao criar utilizador.",
            variant: "destructive"
          })
        }
        throw error
      }

      if (data && data[0]) {
        const newUser: AppUser = {
          id: data[0].id,
          nome: data[0].nome || '',
          email: data[0].email,
          telefone: data[0].telefone || '',
          empresa: data[0].empresa || '',
          estado: data[0].estado || 'Ativo',
          perfil: data[0].perfil || '',
          parceiro_id: data[0].parceiro_id || ''
        }
        setUsers(prev => [newUser, ...prev])
        toast({
          title: "Sucesso",
          description: "Utilizador criado com sucesso."
        })
      }
    } catch (error) {
      console.error('Error creating user:', error)
      // Error already handled above
    }
  }

  const updateUser = async (id: string, userData: Partial<AppUser>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          nome: userData.nome,
          telefone: userData.telefone,
          empresa: userData.empresa,
          estado: userData.estado,
          perfil: userData.perfil,
          parceiro_id: userData.parceiro_id || null // Corrigir string vazia para null
        })
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating user:', error)
        return
      }

      if (data && data[0]) {
        const updatedUser: AppUser = {
          id: data[0].id,
          nome: data[0].nome || '',
          email: data[0].email,
          telefone: data[0].telefone || '',
          empresa: data[0].empresa || '',
          estado: data[0].estado || 'Ativo',
          perfil: data[0].perfil || '',
          parceiro_id: data[0].parceiro_id || ''
        }
        setUsers(prev => prev.map(user => 
          user.id === id ? updatedUser : user
        ))
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting user:', error)
        return
      }

      setUsers(prev => prev.filter(user => user.id !== id))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
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