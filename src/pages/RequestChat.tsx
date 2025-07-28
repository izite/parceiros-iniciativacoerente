import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Paperclip, FileText } from "lucide-react"
import { useRequests } from "@/contexts/requests-context"
import { toast } from "sonner"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "system"
  timestamp: Date
  file?: {
    name: string
    url: string
    type: string
  }
}

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
  const { requests } = useRequests()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Chat iniciado para este pedido. Pode enviar mensagens e anexar documentos PDF.",
      sender: "system",
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const request = requests.find(r => r.id === requestId)

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")
    
    // Simulate system response
    setTimeout(() => {
      const systemResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Mensagem recebida. Como posso ajudar com este pedido?",
        sender: "system",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, systemResponse])
    }, 1000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast.error("Apenas ficheiros PDF são permitidos")
      return
    }

    const fileMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `Documento anexado: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
      file: {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }
    }

    setMessages(prev => [...prev, fileMessage])
    toast.success("Documento anexado com sucesso")
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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
        <Card className={`${getStatusBorderColor(request.estado)} max-w-xs`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${getStatusDotColor(request.estado)}`}></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ESTADO DO PEDIDO</p>
                <p className={`text-xl font-bold ${getStatusTextColor(request.estado)}`}>
                  {request.estado?.toUpperCase() || 'ABERTO'}
                </p>
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
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.file && (
                      <div className="mt-2 p-2 bg-background/20 rounded flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs">{message.file.name}</span>
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
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
  )
}