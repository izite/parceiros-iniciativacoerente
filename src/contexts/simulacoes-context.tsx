import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export interface Simulacao {
  id: string
  numero: string
  nome: string
  nif?: string
  tipo_tarifa: string
  prioridade: string
  consumo_estimado_kwh?: number
  comissao_estimada_eur?: number
  observacoes?: string
  fatura_pdf_path?: string
  estado: string
  created_at: string
  updated_at: string
  user_id: string
}

interface SimulacoesContextType {
  simulacoes: Simulacao[]
  loading: boolean
  createSimulacao: (data: Omit<Simulacao, 'id' | 'numero' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Simulacao | null>
  refreshSimulacoes: () => Promise<void>
}

const SimulacoesContext = createContext<SimulacoesContextType | undefined>(undefined)

export function SimulacoesProvider({ children }: { children: ReactNode }) {
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>([])
  const [loading, setLoading] = useState(true)

  const loadSimulacoes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('simulacoes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar simulações:', error)
        toast.error('Erro ao carregar simulações')
        return
      }

      setSimulacoes(data || [])
    } catch (error) {
      console.error('Erro ao carregar simulações:', error)
      toast.error('Erro ao carregar simulações')
    } finally {
      setLoading(false)
    }
  }

  const createSimulacao = async (data: Omit<Simulacao, 'id' | 'numero' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Simulacao | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Utilizador não autenticado')
        return null
      }

      const { data: simulacao, error } = await supabase
        .from('simulacoes')
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar simulação:', error)
        toast.error('Erro ao criar simulação')
        return null
      }

      if (simulacao) {
        setSimulacoes(prev => [simulacao, ...prev])
        toast.success('Simulação criada com sucesso!')
        return simulacao
      }

      return null
    } catch (error) {
      console.error('Erro ao criar simulação:', error)
      toast.error('Erro ao criar simulação')
      return null
    }
  }

  const refreshSimulacoes = async () => {
    await loadSimulacoes()
  }

  useEffect(() => {
    loadSimulacoes()
  }, [])

  return (
    <SimulacoesContext.Provider value={{
      simulacoes,
      loading,
      createSimulacao,
      refreshSimulacoes
    }}>
      {children}
    </SimulacoesContext.Provider>
  )
}

export function useSimulacoes() {
  const context = useContext(SimulacoesContext)
  if (context === undefined) {
    throw new Error('useSimulacoes must be used within a SimulacoesProvider')
  }
  return context
}