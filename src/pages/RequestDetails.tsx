import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Home, Send, Paperclip } from "lucide-react"

// Mock data - in real app this would come from API
const requestsData = {
  "220001": {
    id: "220001",
    assunto: "OUTROS",
    estado: "Fechado",
    data: "16-07-2025",
    timeAgo: "há 7 horas",
    fornecedor: "galp",
    tipo: "2 via",
    status: "NORMAL",
    lastUpdate: "ACTUALIZADO HÁ 2 HORAS",
    messages: [
      {
        id: 1,
        type: "system",
        user: "Sistema",
        content: "Pedido criado",
        timestamp: "16-07-2025 10:00"
      },
      {
        id: 2,
        type: "user",
        user: "João Silva",
        content: "Solicito a segunda via do documento",
        timestamp: "16-07-2025 10:15"
      },
      {
        id: 3,
        type: "support",
        user: "Ana Costa",
        content: "Olá! Vamos processar o seu pedido. Precisa de alguma informação adicional?",
        timestamp: "16-07-2025 11:00"
      },
      {
        id: 4,
        type: "user",
        user: "João Silva", 
        content: "Não, apenas preciso da segunda via urgente por favor.",
        timestamp: "16-07-2025 11:30"
      },
      {
        id: 5,
        type: "system",
        user: "Sistema",
        content: "Estado alterado para Fechado",
        timestamp: "24-07-2025"
      }
    ]
  },
  "220002": {
    id: "220002",
    assunto: "OUTROS",
    estado: "Pendente (Fornecedor)",
    data: "18-07-2025",
    timeAgo: "há 1 dia",
    fornecedor: "EDP",
    tipo: "Solicitação",
    status: "NORMAL",
    lastUpdate: "ACTUALIZADO HÁ 1 DIA",
    messages: [
      {
        id: 1,
        type: "system",
        user: "Sistema",
        content: "Pedido criado",
        timestamp: "18-07-2025 14:30"
      },
      {
        id: 2,
        type: "user",
        user: "Maria Santos",
        content: "Preciso de esclarecimentos sobre a fatura",
        timestamp: "18-07-2025 14:45"
      }
    ]
  },
  "220003": {
    id: "220003",
    assunto: "PEDIDO DE FATURAS",
    estado: "Fechado",
    data: "17-07-2025",
    timeAgo: "há 6 dias",
    fornecedor: "galp",
    tipo: "Faturas",
    status: "NORMAL",
    lastUpdate: "ACTUALIZADO HÁ 6 DIAS",
    messages: [
      {
        id: 1,
        type: "system",
        user: "Sistema",
        content: "Pedido criado",
        timestamp: "17-07-2025 09:00"
      },
      {
        id: 2,
        type: "user",
        user: "Carlos Pereira",
        content: "Solicito as faturas dos últimos 3 meses",
        timestamp: "17-07-2025 09:15"
      },
      {
        id: 3,
        type: "system",
        user: "Sistema",
        content: "Estado alterado para Fechado",
        timestamp: "20-07-2025"
      }
    ]
  }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "fechado": return "bg-success text-success-foreground"
    case "pendente": return "bg-orange-500 text-white"
    case "aberto": return "bg-blue-500 text-white"  
    case "pendente (fornecedor)": return "bg-muted text-muted-foreground"
    default: return "bg-secondary text-secondary-foreground"
  }
}

const getMessageStyle = (type: string, index: number) => {
  if (type === 'system') {
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
  }
  // Alternate colors for user and support
  if (type === 'user') {
    return index % 2 === 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-green-50 dark:bg-green-900/20'
  }
  if (type === 'support') {
    return 'bg-purple-50 dark:bg-purple-900/20'
  }
  return 'bg-muted'
}

const RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>()
  const navigate = useNavigate()
  const [message, setMessage] = useState("")

  const request = requestId ? requestsData[requestId as keyof typeof requestsData] : null
  const [currentStatus, setCurrentStatus] = useState(request?.estado || "Aberto")

  if (!request) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Pedido não encontrado</h1>
          <Button onClick={() => navigate("/requests")}>Voltar aos Pedidos</Button>
        </div>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // In real app, this would send message to API
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus)
    // In real app, this would update the status via API
    console.log("Status changed to:", newStatus)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/requests">Pedidos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pedido #{request.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{request.tipo}</h1>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(currentStatus)} variant="secondary">
              {currentStatus}
            </Badge>
            <span className="text-sm text-muted-foreground">{request.status}</span>
            <span className="text-sm text-muted-foreground">{request.lastUpdate}</span>
          </div>
          
          {/* Status Update Select */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Alterar Estado:</span>
            <Select value={currentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aberto">Aberto</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Fechado">Fechado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="space-y-4 min-h-[400px]">
            {request.messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`p-4 rounded-lg border ${getMessageStyle(msg.type, index)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
                <div className="text-sm">{msg.content}</div>
              </div>
            ))}
            
            {/* Final status message */}
            {currentStatus === "Fechado" && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  Estado alterado para
                  <Badge className="bg-success text-success-foreground" variant="secondary">
                    Fechado
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">24-07-2025</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Escreva uma nova mensagem aqui"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={currentStatus === "Fechado"}
          />
          <Button 
            className="bg-orange-600 hover:bg-orange-700 text-white px-6"
            onClick={handleSendMessage}
            disabled={!message.trim() || currentStatus === "Fechado"}
          >
            <Send className="h-4 w-4 mr-2" />
            ENVIAR
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
          disabled={currentStatus === "Fechado"}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          ENVIAR FICHEIRO
        </Button>
      </div>
    </div>
  )
}

export default RequestDetails