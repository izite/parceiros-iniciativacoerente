import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Home, Send, Paperclip, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react"

// Mock data - in real app this would come from API
const occurrencesData = {
  "OC001": {
    id: "OC001",
    contractId: "4032-CD",
    subject: "Problema na faturação energética",
    status: "Em Análise",
    date: "2024-07-20",
    client: "EMPRESA TESTE, LDA",
    cpe: "PT0001234567890123456789012",
    supplier: "galp",
    point: "MT",
    consumption: "S/ Consumo",
    startDate: "01-01-2024",
    contractStatus: "Activo",
    priority: "NORMAL",
    lastUpdate: "ACTUALIZADO HÁ 2 SEMANAS",
    messages: [
      {
        id: 1,
        type: "system",
        user: "Sistema",
        content: "Ocorrência criada",
        timestamp: "20-07-2024 14:30"
      },
      {
        id: 2,
        type: "user",
        user: "João Silva",
        content: "Tenho um problema com a faturação do mês passado. Os valores não correspondem ao consumo real.",
        timestamp: "20-07-2024 14:45"
      },
      {
        id: 3,
        type: "support",
        user: "Ana Costa",
        content: "Olá! Vamos analisar a sua situação. Pode fornecer-me o número do contrato e o período em questão?",
        timestamp: "20-07-2024 15:30"
      },
      {
        id: 4,
        type: "user",
        user: "João Silva",
        content: "O contrato é o 4032-CD e refere-se ao mês de junho de 2024.",
        timestamp: "20-07-2024 16:00"
      }
    ]
  },
  "OC002": {
    id: "OC002",
    contractId: "4033-ED",
    subject: "Alteração de potência contratada",
    status: "Resolvido",
    date: "2024-07-18",
    client: "INDUSTRIAL SOLUTIONS",
    cpe: "PT0001234567890123456789013",
    supplier: "EDP",
    point: "BT",
    consumption: "Alta",
    startDate: "15-03-2023",
    contractStatus: "Activo",
    priority: "NORMAL",
    lastUpdate: "ACTUALIZADO HÁ 6 DIAS",
    messages: [
      {
        id: 1,
        type: "system",
        user: "Sistema",
        content: "Ocorrência criada",
        timestamp: "18-07-2024 09:00"
      },
      {
        id: 2,
        type: "user",
        user: "Maria Santos",
        content: "Preciso aumentar a potência contratada para 50kW",
        timestamp: "18-07-2024 09:15"
      },
      {
        id: 3,
        type: "system",
        user: "Sistema",
        content: "Estado alterado para Resolvido",
        timestamp: "22-07-2024"
      }
    ]
  }
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    "Em Análise": { variant: "default" as const, icon: Clock, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
    "Resolvido": { variant: "default" as const, icon: CheckCircle, className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
    "Pendente": { variant: "secondary" as const, icon: AlertCircle, className: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400" },
    "Cancelado": { variant: "destructive" as const, icon: XCircle, className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Pendente"]
  const Icon = config.icon
  
  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  )
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

const OccurrenceDetails = () => {
  const { occurrenceId } = useParams<{ occurrenceId: string }>()
  const navigate = useNavigate()
  const [message, setMessage] = useState("")

  const occurrence = occurrenceId ? occurrencesData[occurrenceId as keyof typeof occurrencesData] : null
  const [currentStatus, setCurrentStatus] = useState(occurrence?.status || "Em Análise")

  if (!occurrence) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Ocorrência não encontrada</h1>
          <Button onClick={() => navigate("/occurrences")}>Voltar às Ocorrências</Button>
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
            <BreadcrumbLink href="/occurrences">Ocorrências</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Ocorrência #{occurrence.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Contrato #{occurrence.contractId}</h1>
          
          {/* Status Update Select */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Alterar Estado:</span>
            <Select value={currentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Em Análise">Em Análise</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Resolvido">Resolvido</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {getStatusBadge(currentStatus)}
          <span className="text-sm text-muted-foreground">{occurrence.priority}</span>
          <span className="text-sm text-muted-foreground">{occurrence.lastUpdate}</span>
        </div>
      </div>

      {/* Contract Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">ID / FORN.</h3>
              <div className="text-sm">
                <div className="font-medium">{occurrence.id}</div>
                <div className="text-muted-foreground">{occurrence.supplier}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">CLIENTE</h3>
              <div className="text-sm font-medium">{occurrence.client}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">PONTO</h3>
              <div className="flex items-center gap-2">
                {occurrence.point === 'MT' && (
                  <Badge variant="destructive" className="text-xs">MT</Badge>
                )}
                <span className="text-sm">{occurrence.cpe}</span>
              </div>
              <div className="text-xs text-orange-600">{occurrence.consumption} ⓘ</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">INÍCIO FORN.</h3>
              <div className="text-sm">{occurrence.startDate}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">ESTADO</h3>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                {occurrence.contractStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">MOTIVO</h3>
              <div className="text-sm">{occurrence.subject}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="space-y-4 min-h-[400px]">
            {occurrence.messages.map((msg, index) => (
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
            {currentStatus === "Resolvido" && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  Estado alterado para
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Resolvido
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
            disabled={currentStatus === "Resolvido" || currentStatus === "Cancelado"}
          />
          <Button 
            className="bg-orange-600 hover:bg-orange-700 text-white px-6"
            onClick={handleSendMessage}
            disabled={!message.trim() || currentStatus === "Resolvido" || currentStatus === "Cancelado"}
          >
            <Send className="h-4 w-4 mr-2" />
            ENVIAR
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
          disabled={currentStatus === "Resolvido" || currentStatus === "Cancelado"}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          ENVIAR FICHEIRO
        </Button>
      </div>
    </div>
  )
}

export default OccurrenceDetails