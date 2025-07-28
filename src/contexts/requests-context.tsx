import React, { createContext, useContext, useState, ReactNode } from 'react'

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
  addRequest: (request: Omit<Request, 'id' | 'data' | 'timeAgo' | 'estado'>) => void
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined)

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>([])

  const addRequest = (requestData: Omit<Request, 'id' | 'data' | 'timeAgo' | 'estado'>) => {
    const newRequest: Request = {
      ...requestData,
      id: `REQ${Date.now()}`,
      data: new Date().toLocaleDateString('pt-PT'),
      timeAgo: 'agora',
      estado: 'Aberto'
    }
    
    setRequests(prev => [newRequest, ...prev])
  }

  return (
    <RequestsContext.Provider value={{ requests, addRequest }}>
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