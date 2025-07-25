import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Folder, File, Plus, Upload, Download, Trash2, FolderOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type FileItem = {
  id: string
  name: string
  type: 'folder' | 'file'
  size?: number
  createdAt: Date
  parentId?: string
}

export default function Drive() {
  const [items, setItems] = useState<FileItem[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const { toast } = useToast()

  const currentItems = items.filter(item => item.parentId === currentFolderId)
  
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

  const createFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFolderName.trim(),
      type: 'folder',
      createdAt: new Date(),
      parentId: currentFolderId
    }

    setItems(prev => [...prev, newFolder])
    setNewFolderName("")
    setIsCreateFolderOpen(false)
    toast({
      title: "Pasta criada",
      description: `A pasta "${newFolder.name}" foi criada com sucesso.`
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'file',
        size: file.size,
        createdAt: new Date(),
        parentId: currentFolderId
      }
      setItems(prev => [...prev, newFile])
    })

    toast({
      title: "Ficheiros carregados",
      description: `${files.length} ficheiro(s) carregado(s) com sucesso.`
    })
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

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
    toast({
      title: "Item eliminado",
      description: "O item foi eliminado com sucesso."
    })
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const path = getCurrentPath()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drive</h1>
          <p className="text-muted-foreground">
            Gerencie os seus ficheiros e pastas
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