import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const suppliers = [
  { name: "Galp", logo: "🛢️" },
  { name: "EDP", logo: "⚡" },
  { name: "Endesa", logo: "🔋" },
  { name: "Iberdrola", logo: "🌊" },
  { name: "Plenitude", logo: "🌱" },
  { name: "Yes", logo: "✨" },
  { name: "PortulogoS", logo: "🇵🇹" },
  { name: "ÁgoraLuz", logo: "💡" },
  { name: "Capwatt", logo: "⚡" },
]

export default function NewRequest() {
  const navigate = useNavigate()
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    subject: "",
    clientNif: "",
    clientName: "",
    message: ""
  })

  const handleSupplierToggle = (supplierName: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierName) 
        ? prev.filter(s => s !== supplierName)
        : [...prev, supplierName]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ ...formData, suppliers: selectedSuppliers })
    navigate("/requests")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/requests")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Novo Pedido</h1>
          <p className="text-muted-foreground">Crie um novo pedido para os fornecedores</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Fields */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="suporte">Suporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="critica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Digite o assunto do pedido"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientNif">NIF Cliente</Label>
                    <Input
                      id="clientNif"
                      value={formData.clientNif}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientNif: e.target.value }))}
                      placeholder="123456789"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome Cliente</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Nome do cliente"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Descreva detalhadamente o seu pedido..."
                    rows={5}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suppliers Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fornecedores</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Selecione os fornecedores para este pedido
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {suppliers.map((supplier) => (
                    <div
                      key={supplier.name}
                      onClick={() => handleSupplierToggle(supplier.name)}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all
                        flex flex-col items-center text-center gap-2
                        hover:shadow-md
                        ${selectedSuppliers.includes(supplier.name)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="text-2xl">{supplier.logo}</div>
                      <span className="text-sm font-medium">{supplier.name}</span>
                    </div>
                  ))}
                </div>
                {selectedSuppliers.length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Fornecedores selecionados:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSuppliers.map(supplier => (
                        <span key={supplier} className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                          {supplier}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8"
          >
            CRIAR PEDIDO
          </Button>
        </div>
      </form>
    </div>
  )
}