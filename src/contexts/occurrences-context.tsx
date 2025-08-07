import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export interface Occurrence {
  id: string
  numero_id?: number
  numero_formatado?: string
  assunto: string
  descricao?: string
  cliente_nome: string
  cpe_cui?: string
  estado: string
  data: string
  timeAgo: string
  autor_id?: string
}

interface OccurrencesContextType {
  occurrences: Occurrence[]
  addOccurrence: (occurrence: Omit<Occurrence, 'id' | 'data' | 'timeAgo' | 'numero_id' | 'numero_formatado'>) => Promise<void>
  updateOccurrenceStatus: (occurrenceId: string, newStatus: string) => Promise<void>
  loading: boolean
  refreshOccurrences: () => Promise<void>
}

const OccurrencesContext = createContext<OccurrencesContextType | undefined>(undefined)

export function OccurrencesProvider({ children }: { children: ReactNode }) {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([])
  const [loading, setLoading] = useState(true)

  // Função para converter dados do Supabase para o formato da interface
  const mapSupabaseToOccurrence = (data: any): Occurrence => {
    const createdAt = new Date(data.created_at)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60))
    
    let timeAgo = 'agora'
    if (diffHours >= 24) {
      const days = Math.floor(diffHours / 24)
      timeAgo = `há ${days} dia${days > 1 ? 's' : ''}`
    } else if (diffHours >= 1) {
      timeAgo = `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`
    }

    const numeroFormatado = data.numero_id ? `OC${String(data.numero_id).padStart(3, '0')}` : ''

    return {
      id: data.id,
      numero_id: data.numero_id,
      numero_formatado: numeroFormatado,
      assunto: data.assunto || '',
      descricao: data.descricao || '',
      cliente_nome: data.cliente_nome || '',
      cpe_cui: data.cpe_cui || '',
      estado: data.estado || 'Pendente',
      data: createdAt.toLocaleDateString('pt-PT'),
      timeAgo,
      autor_id: data.autor_id
    }
  }

  // Carregar ocorrências da base de dados
  const loadOccurrences = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ocorrencias')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar ocorrências:', error)
        toast.error('Erro ao carregar ocorrências')
        return
      }

      const mappedOccurrences = data?.map(mapSupabaseToOccurrence) || []
      setOccurrences(mappedOccurrences)
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error)
      toast.error('Erro ao carregar ocorrências')
    } finally {
      setLoading(false)
    }
  }

  // Carregar ocorrências ao inicializar
  useEffect(() => {
    loadOccurrences()
  }, [])

  const addOccurrence = async (occurrenceData: Omit<Occurrence, 'id' | 'data' | 'timeAgo' | 'numero_id' | 'numero_formatado'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Utilizador não autenticado')
        return
      }

      // Verificar se o utilizador existe na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (userError || !userData) {
        toast.error('Perfil de utilizador não encontrado. Contacte o administrador.')
        return
      }

      const { data, error } = await supabase
        .from('ocorrencias')
        .insert({
          assunto: occurrenceData.assunto,
          descricao: occurrenceData.descricao,
          cliente_nome: occurrenceData.cliente_nome,
          cpe_cui: occurrenceData.cpe_cui,
          estado: occurrenceData.estado,
          autor_id: userData.id,
          criado_por: userData.id
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar ocorrência:', error)
        toast.error('Erro ao criar ocorrência')
        return
      }

      if (data) {
        const newOccurrence = mapSupabaseToOccurrence(data)
        setOccurrences(prev => [newOccurrence, ...prev])
        toast.success('Ocorrência criada com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao criar ocorrência:', error)
      toast.error('Erro ao criar ocorrência')
    }
  }

  const updateOccurrenceStatus = async (occurrenceId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('ocorrencias')
        .update({ estado: newStatus })
        .eq('id', occurrenceId)

      if (error) {
        console.error('Erro ao atualizar estado:', error)
        toast.error('Erro ao atualizar estado da ocorrência')
        return
      }

      // Atualizar estado local
      setOccurrences(prev => 
        prev.map(occurrence => 
          occurrence.id === occurrenceId 
            ? { ...occurrence, estado: newStatus }
            : occurrence
        )
      )
      
      toast.success('Estado da ocorrência atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar estado:', error)
      toast.error('Erro ao atualizar estado da ocorrência')
    }
  }

  const refreshOccurrences = async () => {
    await loadOccurrences()
  }

  return (
    <OccurrencesContext.Provider value={{ 
      occurrences, 
      addOccurrence, 
      updateOccurrenceStatus, 
      loading, 
      refreshOccurrences 
    }}>
      {children}
    </OccurrencesContext.Provider>
  )
}

export function useOccurrences() {
  const context = useContext(OccurrencesContext)
  if (context === undefined) {
    throw new Error('useOccurrences must be used within an OccurrencesProvider')
  }
  return context
}