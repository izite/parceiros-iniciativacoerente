import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Send, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// Mock data for detailed autoconsumo proposal
const getAutoconsumoDetails = (id: string) => {
  const details = {
    "80838": {
      id: "80838",
      titulo: "Proposta Autoconsumo (B2B) – ADM CONDOMÍNIO PALMEIRAS SHOPPING",
      estado: "Fechado",
      tipo: "NORMAL",
      atualizacao: "ACTUALIZADO HÁ 1 ANO",
      cliente: {
        nome: "ADM Condomínio Palmeiras Shopping",
        tipo: "Negócios (B2B)",
        responsavel: "João Carrilho Nobre",
        telefone: "214575216",
        email: "joao.ccpalmeiras@gmail.com",
        setor: "Escritórios (verificar propriedade)",
        tamanho: "Média (50-250 empregados)",
        tensao: "BTE",
        cpe: "PT 0002 000 068 140 149 LF"
      },
      mensagens: [
        {
          autor: "Bruno Santos (Energika)",
          data: "03-11-2023",
          texto: "Bom dia.\n\ncliente contratou empresa privada para realizar a obra.\ne para cancelar este pedido\n\nobrigado",
          tipo: "enviada"
        },
        {
          autor: "Bruno Santos (Energika)",
          data: "03-11-2023",
          texto: "Bom dia.\n\nSolicitamos feedback relativo a este pedido.\n\nAtt\nLaura Costa",
          tipo: "recebida"
        }
      ]
    }
  }
  
  return details[id as keyof typeof details] || null
}

const AutoconsumoDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [novaMensagem, setNovaMensagem] = useState("")
  
  const detalhes = getAutoconsumoDetails(id || "")
  
  if (!detalhes) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Proposta não encontrada</h1>
          <Button onClick={() => navigate("/autoconsumo")}>
            Voltar à listagem
          </Button>
        </div>
      </div>
    )
  }

  const handleEnviarMensagem = () => {
    if (novaMensagem.trim()) {
      // Aqui seria enviada a mensagem
      setNovaMensagem("")
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/autoconsumo")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-2">{detalhes.titulo}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {detalhes.estado}
            </Badge>
            <span>{detalhes.tipo}</span>
            <span>{detalhes.atualizacao}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Comunicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {detalhes.mensagens.map((mensagem, index) => (
                  <div key={index} className="space-y-2">
                    <div className={`p-4 rounded-lg ${
                      mensagem.tipo === 'enviada' 
                        ? 'bg-orange-500 text-white ml-8' 
                        : 'bg-yellow-100 text-yellow-800 mr-8'
                    }`}>
                      <p className="whitespace-pre-line">{mensagem.texto}</p>
                    </div>
                    <div className="text-sm text-muted-foreground text-center">
                      {mensagem.autor} - {mensagem.data}
                    </div>
                    {index === 0 && (
                      <div className="text-center text-sm text-muted-foreground">
                        <span className="italic">Estado alterado para</span>
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                          Fechado
                        </Badge>
                        <span className="block text-xs mt-1">03-11-2023</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Message Input */}
              <div className="space-y-4">
                <Input
                  placeholder="Escreva uma nova mensagem aqui"
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    ENVIAR FICHEIRO
                  </Button>
                  <Button 
                    onClick={handleEnviarMensagem}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    ENVIAR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Details Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">CLIENTE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-orange-500 text-lg">
                  {detalhes.cliente.nome}
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">TIPO</span>
                  <p className="font-medium">{detalhes.cliente.tipo}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">NOME COMPLETO RESPONSÁVEL EMPRESA</span>
                  <p className="font-medium">{detalhes.cliente.responsavel}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">TELEFONE</span>
                  <p className="font-medium">{detalhes.cliente.telefone}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">EMAIL</span>
                  <p className="font-medium">{detalhes.cliente.email}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">SETOR DE ACTIVIDADE</span>
                  <p className="font-medium">{detalhes.cliente.setor}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">TAMANHO DA EMPRESA</span>
                  <p className="font-medium">{detalhes.cliente.tamanho}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">TENSÃO</span>
                  <p className="font-medium">{detalhes.cliente.tensao}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">CPE</span>
                  <p className="font-medium">{detalhes.cliente.cpe}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">TIPO DE CONTADOR</span>
                  <Button variant="outline" size="sm" className="w-full mt-1">
                    <span className="mr-2">▼</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AutoconsumoDetails