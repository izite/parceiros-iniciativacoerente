import { useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Home, Send, Paperclip, CheckCircle, Clock, AlertCircle, XCircle, Download } from "lucide-react"
import { useOccurrenceChat } from "@/hooks/useOccurrenceChat"

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { messages, documents, loading, sendMessage, uploadDocument, getDocumentUrl } = useOccurrenceChat(occurrenceId || "")

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

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message)
      setMessage("")
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus)
    // In real app, this would update the status via API
    console.log("Status changed to:", newStatus)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await uploadDocument(file)
    }
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

      {/* Client Info - Simplified and Beautiful */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-xl border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cliente */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Cliente</h3>
            <p className="text-lg font-semibold text-foreground">{occurrence.client}</p>
          </div>
          
          {/* NIF */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">NIF</h3>
            <p className="text-lg font-mono text-foreground">123456789</p>
          </div>
          
          {/* Ponto */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Ponto</h3>
            <div className="flex items-center gap-3">
              {occurrence.point === 'MT' && (
                <Badge variant="destructive" className="text-xs font-medium">MT</Badge>
              )}
              <span className="text-sm font-mono text-muted-foreground">{occurrence.cpe}</span>
            </div>
          </div>
        </div>
        
        {/* Estado do Contrato */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Estado do Contrato</h3>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                {occurrence.contractStatus}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Motivo da Ocorrência</p>
              <p className="text-sm font-medium">{occurrence.subject}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg border ${
                      msg.remetente === 'system' 
                        ? 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800' 
                        : msg.remetente === 'user'
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800 ml-8'
                        : 'bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800 mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {msg.remetente === 'system' ? 'Sistema' : msg.remetente === 'user' ? 'Você' : 'Suporte'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleString('pt-PT')}
                      </span>
                    </div>
                    <div className="text-sm">{msg.conteudo}</div>
                  </div>
                ))}
                
                {/* Documents */}
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-900/50 ml-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{doc.nome_arquivo}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(doc.tamanho_arquivo || 0 / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(getDocumentUrl(doc.caminho_arquivo), '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Anexado em {new Date(doc.created_at).toLocaleString('pt-PT')}
                    </div>
                  </div>
                ))}
              </>
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
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />
        
        <Button 
          variant="outline" 
          className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
          onClick={handleFileUpload}
          disabled={currentStatus === "Resolvido" || currentStatus === "Cancelado"}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          ENVIAR FICHEIRO PDF
        </Button>
      </div>
    </div>
  )
}

export default OccurrenceDetails