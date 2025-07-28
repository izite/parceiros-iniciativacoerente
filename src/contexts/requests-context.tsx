import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export interface Request {
  id: string
  assunto: string
  cliente_nome: string
  cliente_nif: string
  estado: string
  subUtilizador: string
  data: string
  timeAgo: string
  categoria: string
  prioridade: string
  mensagem: string
  fornecedores: string[]
}

interface RequestsContextType {
  requests: Request[]
  addRequest: (request: Omit<Request, 'id' | 'data' | 'timeAgo' | 'estado'>) => Promise<void>
  updateRequestStatus: (requestId: string, newStatus: string) => Promise<void>
  loading: boolean
  refreshRequests: () => Promise<void>
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined)

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  // Função para converter dados do Supabase para o formato da interface
  const mapSupabaseToRequest = (data: any): Request => {
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

    return {
      id: data.id,
      assunto: data.assunto || '',
      cliente_nome: data.cliente_nome || '',
      cliente_nif: data.cliente_nif || '',
      estado: data.estado || 'Aberto',
      subUtilizador: 'Utilizador Atual', // Pode ser melhorado com dados reais do utilizador
      data: createdAt.toLocaleDateString('pt-PT'),
      timeAgo,
      categoria: data.categoria || '',
      prioridade: data.prioridade || '',
      mensagem: data.mensagem || '',
      fornecedores: data.fornecedores || []
    }
  }

  // Carregar pedidos da base de dados
  const loadRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar pedidos:', error)
        toast.error('Erro ao carregar pedidos')
        return
      }

      const mappedRequests = data?.map(mapSupabaseToRequest) || []
      setRequests(mappedRequests)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      toast.error('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  // Carregar pedidos ao inicializar
  useEffect(() => {
    loadRequests()
  }, [])

  const addRequest = async (requestData: Omit<Request, 'id' | 'data' | 'timeAgo' | 'estado'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Utilizador não autenticado')
        return
      }

      const { data, error } = await supabase
        .from('pedidos')
        .insert({
          assunto: requestData.assunto,
          cliente_nome: requestData.cliente_nome,
          cliente_nif: requestData.cliente_nif,
          categoria: requestData.categoria,
          prioridade: requestData.prioridade,
          mensagem: requestData.mensagem,
          fornecedores: requestData.fornecedores,
          autor_id: user.id,
          criado_por: user.id,
          estado: 'Aberto'
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar pedido:', error)
        toast.error('Erro ao criar pedido')
        return
      }

      if (data) {
        const newRequest = mapSupabaseToRequest(data)
        setRequests(prev => [newRequest, ...prev])
        toast.success('Pedido criado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      toast.error('Erro ao criar pedido')
    }
  }

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ estado: newStatus })
        .eq('id', requestId)

      if (error) {
        console.error('Erro ao atualizar estado:', error)
        toast.error('Erro ao atualizar estado do pedido')
        return
      }

      // Atualizar estado local
      setRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, estado: newStatus }
            : request
        )
      )
      
      toast.success('Estado do pedido atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar estado:', error)
      toast.error('Erro ao atualizar estado do pedido')
    }
  }

  const refreshRequests = async () => {
    await loadRequests()
  }

  return (
    <RequestsContext.Provider value={{ 
      requests, 
      addRequest, 
      updateRequestStatus, 
      loading, 
      refreshRequests 
    }}>
      {children}
    </RequestsContext.Provider>
  )
}

export function useRequests() {
  const context = useContext(RequestsContext)
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestsProvider')
  }
  return context
}