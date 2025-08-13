import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Paperclip, FileText, Download } from "lucide-react"
import { useSimulacoes } from "@/contexts/simulacoes-context"
import { useSimulacaoChat } from "@/hooks/useSimulacaoChat"
import { toast } from "sonner"

export default function SimulacaoDetails() {
  const { simulacaoId } = useParams()
  const navigate = useNavigate()
  const { simulacoes } = useSimulacoes()
  const [newMessage, setNewMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const simulacao = simulacoes.find(s => s.id === simulacaoId)
  
  // Usar o hook de chat
  const { 
    messages, 
    documents, 
    loading: chatLoading, 
    sendMessage, 
    uploadDocument, 
    getDocumentUrl 
  } = useSimulacaoChat(simulacaoId || '')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!simulacao) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/simulacoes")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Simulação não encontrada</h1>
        </div>
      </div>
    )
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    await sendMessage(newMessage)
    setNewMessage("")
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    await uploadDocument(file)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatTipoTarifa = (tipo: string) => {
    switch (tipo) {
      case "indexado":
        return "Indexado"
      case "fixo":
        return "Fixo"
      case "ambos":
        return "Ambos"
      default:
        return tipo
    }
  }

  const formatCurrency = (value?: number) => {
    if (value === null || value === undefined) return "N/A"
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  const formatKwh = (value?: number) => {
    if (value === null || value === undefined) return "N/A"
    return `${value.toLocaleString('pt-PT')} kWh`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "text-blue-600"
      case "analise":
      case "análise":
      case "pendente_analise":
        return "text-yellow-600"
      case "fechado":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="flex h-screen">
      {/* Chat Section (Left) */}
      <div className="flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/simulacoes")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Chat da Simulação</h1>
            <p className="text-muted-foreground">
              {simulacao.numero} - {simulacao.nome}
            </p>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Conversação</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {chatLoading ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">A carregar mensagens...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.remetente === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.remetente === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.conteudo}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Exibir documentos anexados */}
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex justify-end">
                      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-primary text-primary-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{doc.nome_arquivo}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(getDocumentUrl(doc.caminho_arquivo), '_blank')}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(doc.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Section (Right) */}
      <div className="w-80 border-l bg-muted/10 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo da Simulação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Número</label>
              <p className="font-medium">{simulacao.numero}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <p className={`font-medium capitalize ${getStatusColor(simulacao.estado)}`}>
                {simulacao.estado}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Cliente</label>
              <p className="font-medium">{simulacao.nome}</p>
            </div>

            {simulacao.nif && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">NIF</label>
                <p className="font-medium">{simulacao.nif}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de Tarifa</label>
              <p className="font-medium">{formatTipoTarifa(simulacao.tipo_tarifa)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Prioridade</label>
              <p className={`font-medium capitalize ${simulacao.prioridade === 'urgente' ? 'text-red-600' : 'text-blue-600'}`}>
                {simulacao.prioridade}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Consumo Estimado</label>
              <p className="font-medium">{formatKwh(simulacao.consumo_estimado_kwh)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Comissão Estimada</label>
              <p className="font-medium">{formatCurrency(simulacao.comissao_estimada_eur)}</p>
            </div>

            {simulacao.observacoes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Observações</label>
                <p className="text-sm leading-relaxed">{simulacao.observacoes}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">Data de Criação</label>
              <p className="font-medium">
                {new Date(simulacao.created_at).toLocaleDateString('pt-PT', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}