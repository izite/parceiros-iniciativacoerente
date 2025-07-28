import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export interface OccurrenceChatMessage {
  id: string
  conteudo: string
  remetente: 'user' | 'system'
  created_at: string
  autor_id: string
}

export interface OccurrenceChatDocument {
  id: string
  nome_arquivo: string
  caminho_arquivo: string
  tipo_arquivo: string
  tamanho_arquivo?: number
  created_at: string
  autor_id: string
}

export function useOccurrenceChat(ocorrenciaId: string) {
  const [messages, setMessages] = useState<OccurrenceChatMessage[]>([])
  const [documents, setDocuments] = useState<OccurrenceChatDocument[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar mensagens do chat
  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('mensagens_chat_ocorrencias')
        .select('*')
        .eq('ocorrencia_id', ocorrenciaId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao carregar mensagens:', error)
        return
      }

      setMessages((data || []) as OccurrenceChatMessage[])
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    }
  }

  // Carregar documentos do chat
  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documentos_chat_ocorrencias')
        .select('*')
        .eq('ocorrencia_id', ocorrenciaId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao carregar documentos:', error)
        return
      }

      setDocuments(data || [])
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      await Promise.all([loadMessages(), loadDocuments()])
      setLoading(false)
    }

    if (ocorrenciaId) {
      loadInitialData()
    }
  }, [ocorrenciaId])

  // Adicionar mensagem inicial do sistema se não existirem mensagens
  useEffect(() => {
    const addInitialMessage = async () => {
      if (messages.length === 0 && !loading) {
        await sendMessage(
          'Chat iniciado para esta ocorrência. Pode enviar mensagens e anexar documentos PDF.',
          'system'
        )
      }
    }

    addInitialMessage()
  }, [messages.length, loading])

  // Enviar mensagem
  const sendMessage = async (conteudo: string, remetente: 'user' | 'system' = 'user') => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Utilizador não autenticado')
        return
      }

      const { data, error } = await supabase
        .from('mensagens_chat_ocorrencias')
        .insert({
          ocorrencia_id: ocorrenciaId,
          conteudo,
          remetente,
          autor_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao enviar mensagem:', error)
        toast.error('Erro ao enviar mensagem')
        return
      }

      if (data) {
        setMessages(prev => [...prev, data as OccurrenceChatMessage])
        
        // Simular resposta do sistema se for mensagem do utilizador
        if (remetente === 'user') {
          setTimeout(() => {
            sendSystemResponse()
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      toast.error('Erro ao enviar mensagem')
    }
  }

  // Enviar resposta automática do sistema
  const sendSystemResponse = async () => {
    const responses = [
      'Mensagem recebida. Como posso ajudar com esta ocorrência?',
      'Obrigado pela sua mensagem. A nossa equipa irá responder em breve.',
      'Recebi a sua solicitação. Vamos analisar e dar uma resposta.'
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    await sendMessage(randomResponse, 'system')
  }

  // Upload de documento
  const uploadDocument = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Utilizador não autenticado')
        return
      }

      if (file.type !== 'application/pdf') {
        toast.error('Apenas ficheiros PDF são permitidos')
        return
      }

      // Upload do arquivo para storage
      const fileName = `occurrences/${ocorrenciaId}/${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('drive')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Erro ao fazer upload:', uploadError)
        toast.error('Erro ao fazer upload do documento')
        return
      }

      // Salvar referência na base de dados
      const { data, error } = await supabase
        .from('documentos_chat_ocorrencias')
        .insert({
          ocorrencia_id: ocorrenciaId,
          nome_arquivo: file.name,
          caminho_arquivo: uploadData.path,
          tipo_arquivo: file.type,
          tamanho_arquivo: file.size,
          autor_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao salvar documento:', error)
        toast.error('Erro ao salvar documento')
        return
      }

      if (data) {
        setDocuments(prev => [...prev, data])
        
        // Adicionar mensagem informando sobre o upload
        await sendMessage(`Documento anexado: ${file.name}`)
        toast.success('Documento anexado com sucesso')
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao fazer upload do documento')
    }
  }

  // Obter URL de download do documento
  const getDocumentUrl = (caminhoArquivo: string) => {
    const { data } = supabase.storage
      .from('drive')
      .getPublicUrl(caminhoArquivo)
    
    return data.publicUrl
  }

  return {
    messages,
    documents,
    loading,
    sendMessage,
    uploadDocument,
    getDocumentUrl,
    refreshData: () => Promise.all([loadMessages(), loadDocuments()])
  }
}