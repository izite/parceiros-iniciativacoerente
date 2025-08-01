import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Paperclip, FileText, Download } from "lucide-react"
import { useRequests } from "@/contexts/requests-context"
import { useRequestChat } from "@/hooks/useRequestChat"
import { toast } from "sonner"


const getStatusBorderColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "aberto": return "border-green-500/20"
    case "fechado": return "border-red-500/20"
    case "análise": 
    case "analise": return "border-yellow-500/20"
    case "pendente": return "border-blue-500/20"
    default: 
      if (status?.toLowerCase().includes("pendente")) {
        return "border-blue-500/20"
      }
      return "border-green-500/20" // Default para aberto
  }
}

const getStatusDotColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "aberto": return "bg-green-500"
    case "fechado": return "bg-red-500"
    case "análise": 
    case "analise": return "bg-yellow-500"
    case "pendente": return "bg-blue-500"
    default: 
      if (status?.toLowerCase().includes("pendente")) {
        return "bg-blue-500"
      }
      return "bg-green-500" // Default para aberto
  }
}

const getStatusTextColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "aberto": return "text-green-500"
    case "fechado": return "text-red-500"
    case "análise": 
    case "analise": return "text-yellow-500"
    case "pendente": return "text-blue-500"
    default: 
      if (status?.toLowerCase().includes("pendente")) {
        return "text-blue-500"
      }
      return "text-green-500" // Default para aberto
  }
}

export default function RequestChat() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const { requests, updateRequestStatus } = useRequests()
  const [newMessage, setNewMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const request = requests.find(r => r.id === requestId)
  const [selectedStatus, setSelectedStatus] = useState(request?.estado || "Aberto")
  
  // Usar o hook de chat
  const { 
    messages, 
    documents, 
    loading: chatLoading, 
    sendMessage, 
    uploadDocument, 
    getDocumentUrl 
  } = useRequestChat(requestId || '')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!request) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/requests")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Pedido não encontrado</h1>
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

  const handleSaveStatus = async () => {
    if (request && updateRequestStatus) {
      await updateRequestStatus(request.id, selectedStatus)
    }
  }

  return (
    <div className="p-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/requests")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Chat do Pedido</h1>
          <p className="text-muted-foreground">
            {request.assunto} - {request.cliente_nome} ({request.cliente_nif})
          </p>
          <p className="text-sm text-muted-foreground">
            Comercializadoras: {request.fornecedores?.join(", ") || "N/A"}
          </p>
        </div>
      </div>

      {/* Estado do Pedido Individual */}
      <div className="mb-6">
        <Card className={`${getStatusBorderColor(selectedStatus)} max-w-md`}>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${getStatusDotColor(selectedStatus)}`}></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ESTADO DO PEDIDO</p>
                  <p className={`text-xl font-bold ${getStatusTextColor(selectedStatus)}`}>
                    {selectedStatus?.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Alterar Estado:</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="Aberto" className="cursor-pointer hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Aberto
                      </div>
                    </SelectItem>
                    <SelectItem value="Fechado" className="cursor-pointer hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        Fechado
                      </div>
                    </SelectItem>
                    <SelectItem value="Análise" className="cursor-pointer hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        Análise
                      </div>
                    </SelectItem>
                    <SelectItem value="Pendente" className="cursor-pointer hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        Pendente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* Botão Guardar */}
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSaveStatus}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8"
          disabled={selectedStatus === request.estado}
        >
          Guardar Estado
        </Button>
      </div>
    </div>
  )
}