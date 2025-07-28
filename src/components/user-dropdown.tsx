import { LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const UserDropdown = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-muted"
        >
          <User className="h-4 w-4" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Parceiros</span>
            <span className="text-xs text-muted-foreground">
              {user?.email || "IniciativaCoerente"}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border shadow-lg z-50">
        <div className="px-3 py-2 border-b">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Parceiros</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email || "IniciativaCoerente"}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white cursor-pointer font-medium"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown