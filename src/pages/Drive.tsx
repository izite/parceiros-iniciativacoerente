import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Folder, File, Plus, Upload, Download, Trash2, FolderOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/auth-context"

type FileItem = {
  id: string
  name: string
  type: 'folder' | 'file'
  size?: number
  createdAt: Date
  parentId?: string
  path?: string
}

export default function Drive() {
  const [items, setItems] = useState<FileItem[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  const currentItems = items.filter(item => item.parentId === currentFolderId)
  
  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('arquivos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const fileItems: FileItem[] = data.map(file => ({
        id: file.id,
        name: file.nome_arquivo || 'Arquivo sem nome',
        type: file.caminho_arquivo?.includes('.') ? 'file' : 'folder',
        createdAt: new Date(file.created_at || ''),
        parentId: file.caminho_arquivo?.includes('/') ? 
          file.caminho_arquivo.split('/').slice(0, -1).join('/') || null : null,
        path: file.caminho_arquivo
      }))

      setItems(fileItems)
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar arquivos",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para encontrar o utilizador local pelo email do utilizador autenticado
  const getLocalUserId = async () => {
    if (!user?.email) return null
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single()
      
      return error ? null : data?.id
    } catch {
      return null
    }
  }
  
  const getCurrentPath = (): FileItem[] => {
    const path: FileItem[] = []
    let current = currentFolderId
    
    while (current) {
      const folder = items.find(item => item.id === current && item.type === 'folder')
      if (folder) {
        path.unshift(folder)
        current = folder.parentId
      } else {
        break
      }
    }
    
    return path
  }

  const createFolder = async () => {
    if (!newFolderName.trim() || !user) return

    const currentPath = getCurrentPath()
    const folderPath = currentPath.length > 0 
      ? `${currentPath.map(p => p.name).join('/')}/${newFolderName.trim()}`
      : newFolderName.trim()

    try {
      const localUserId = await getLocalUserId()
      
      const { error } = await supabase
        .from('arquivos')
        .insert({
          nome_arquivo: newFolderName.trim(),
          caminho_arquivo: folderPath,
          criado_por: localUserId
        })

      if (error) throw error

      await fetchFiles()
      setNewFolderName("")
      setIsCreateFolderOpen(false)
      toast({
        title: "Pasta criada",
        description: `A pasta "${newFolderName.trim()}" foi criada com sucesso.`
      })
    } catch (error) {
      console.error('Erro ao criar pasta:', error)
      toast({
        title: "Erro",
        description: "Erro ao criar pasta",
        variant: "destructive"
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !user) return

    const currentPath = getCurrentPath()
    const basePath = currentPath.length > 0 ? currentPath.map(p => p.name).join('/') : ''

    try {
      for (const file of Array.from(files)) {
        // Upload para storage
        const fileName = `${Date.now()}_${file.name}`
        const filePath = basePath ? `${basePath}/${fileName}` : fileName
        
        const { error: uploadError } = await supabase.storage
          .from('drive')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Registar na base de dados
        const localUserId = await getLocalUserId()
        
        const { error: dbError } = await supabase
          .from('arquivos')
          .insert({
            nome_arquivo: file.name,
            caminho_arquivo: filePath,
            criado_por: localUserId
          })

        if (dbError) throw dbError
      }

      await fetchFiles()
      toast({
        title: "Ficheiros carregados",
        description: `${files.length} ficheiro(s) carregado(s) com sucesso.`
      })
    } catch (error) {
      console.error('Erro ao carregar ficheiros:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar ficheiros",
        variant: "destructive"
      })
    }
  }

  const openFolder = (folderId: string) => {
    setCurrentFolderId(folderId)
  }

  const goBack = () => {
    const path = getCurrentPath()
    if (path.length > 0) {
      setCurrentFolderId(path[path.length - 1].parentId || null)
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      const item = items.find(i => i.id === itemId)
      if (!item) return

      // Eliminar do storage se for ficheiro
      if (item.type === 'file' && item.path) {
        const { error: storageError } = await supabase.storage
          .from('drive')
          .remove([item.path])

        if (storageError) console.error('Erro ao eliminar do storage:', storageError)
      }

      // Eliminar da base de dados
      const { error } = await supabase
        .from('arquivos')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      await fetchFiles()
      toast({
        title: "Item eliminado",
        description: "O item foi eliminado com sucesso."
      })
    } catch (error) {
      console.error('Erro ao eliminar item:', error)
      toast({
        title: "Erro",
        description: "Erro ao eliminar item",
        variant: "destructive"
      })
    }
  }

  const downloadFile = async (item: FileItem) => {
    if (item.type !== 'file' || !item.path) return

    try {
      const { data, error } = await supabase.storage
        .from('drive')
        .download(item.path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = item.name
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao descarregar ficheiro:', error)
      toast({
        title: "Erro",
        description: "Erro ao descarregar ficheiro",
        variant: "destructive"
      })
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const path = getCurrentPath()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">A carregar...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drive</h1>
          <p className="text-muted-foreground">
            Gerencie os seus ficheiros e pastas - Visível para todos os utilizadores
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova Pasta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Pasta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nome da pasta"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createFolder()}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createFolder}>
                    Criar Pasta
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Carregar Ficheiros
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </Button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              className="cursor-pointer" 
              onClick={() => setCurrentFolderId(null)}
            >
              Drive
            </BreadcrumbLink>
          </BreadcrumbItem>
          {path.map((folder, index) => (
            <>
              <BreadcrumbSeparator key={`sep-${folder.id}`} />
              <BreadcrumbItem key={folder.id}>
                {index === path.length - 1 ? (
                  <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    className="cursor-pointer"
                    onClick={() => setCurrentFolderId(folder.id)}
                  >
                    {folder.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-2 flex-1"
                  onClick={() => item.type === 'folder' && openFolder(item.id)}
                >
                  {item.type === 'folder' ? (
                    <Folder className="h-8 w-8 text-blue-500" />
                  ) : (
                    <File className="h-8 w-8 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm truncate">{item.name}</CardTitle>
                  </div>
                </div>
                <div className="flex gap-1">
                  {item.type === 'file' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadFile(item)
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteItem(item.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-muted-foreground">
                {item.type === 'file' && item.size && (
                  <p>{formatFileSize(item.size)}</p>
                )}
                <p>{item.createdAt.toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentItems.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Pasta vazia</h3>
          <p className="text-muted-foreground mb-4">
            Comece por criar uma pasta ou carregar alguns ficheiros.
          </p>
        </div>
      )}
    </div>
  )
}