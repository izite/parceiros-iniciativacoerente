import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export type Contract = {
  id: string
  nif?: string
  cliente_nome?: string
  cpe_cui?: string
  fornecedor?: string
  estado?: string
  inicio_fornecimento?: string
  consumo?: number
  comissao?: number
  sub_utilizador?: string
  tipo_preco?: string
  tipo_energia?: string
  notas?: string
  autor_id?: string
  parceiro_id?: string
}

type ContractsContextType = {
  contracts: Contract[]
  loading: boolean
  addContract: (contract: Omit<Contract, 'id'>) => Promise<void>
  updateContract: (id: string, updates: Partial<Contract>) => Promise<void>
  deleteContract: (id: string) => Promise<void>
  getContract: (id: string) => Contract | undefined
  fetchContracts: () => Promise<void>
}

const ContractsContext = createContext<ContractsContextType | undefined>(undefined)

export function ContractsProvider({ children }: { children: React.ReactNode }) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  const fetchContracts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching contracts:', error)
        return
      }

      setContracts(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addContract = async (newContract: Omit<Contract, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const contractData = {
        ...newContract,
        autor_id: user?.id
      }

      const { error } = await supabase
        .from('contratos')
        .insert([contractData])

      if (error) {
        console.error('Error adding contract:', error)
        return
      }

      await fetchContracts()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateContract = async (id: string, updates: Partial<Contract>) => {
    try {
      const { error } = await supabase
        .from('contratos')
        .update(updates)
        .eq('id', id)

      if (error) {
        console.error('Error updating contract:', error)
        return
      }

      await fetchContracts()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteContract = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting contract:', error)
        return
      }

      await fetchContracts()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getContract = (id: string) => {
    return contracts.find(contract => contract.id === id)
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  return (
    <ContractsContext.Provider value={{ 
      contracts, 
      loading, 
      addContract, 
      updateContract, 
      deleteContract, 
      getContract, 
      fetchContracts 
    }}>
      {children}
    </ContractsContext.Provider>
  )
}

export function useContracts() {
  const context = useContext(ContractsContext)
  if (context === undefined) {
    throw new Error("useContracts must be used within a ContractsProvider")
  }
  return context
}