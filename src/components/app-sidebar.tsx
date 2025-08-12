import { Phone, Calculator, FileText, AlertTriangle, ShoppingCart, Leaf, Receipt, Search, Users, HardDrive, MessageSquare, BarChart3, Zap, Home, Sun, Bell } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Contactos", url: "/contacts", icon: Phone },
  { title: "Contratos", url: "/contracts", icon: FileText },
  { title: "Ocorrências", url: "/occurrences", icon: AlertTriangle },
  { title: "Pedidos", url: "/requests", icon: ShoppingCart },
  { title: "Autoconsumo", url: "/autoconsumo", icon: Sun },
  { title: "Simulações", url: "/simulacoes", icon: Calculator },
  { title: "Comunicados", url: "/comunicados", icon: Bell },
  { title: "Utilizadores", url: "/users", icon: Users },
  { title: "Drive", url: "/drive", icon: HardDrive },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const { user, signOut } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path || (path === "/" && currentPath === "/")
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "bg-primary text-white hover:bg-primary/90 font-medium"

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"} collapsible="icon" side="left">
      <SidebarContent>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            {state !== "collapsed" && (
              <div>
                <h2 className="font-semibold text-sm text-sidebar-foreground">Parceiros</h2>
                <p className="text-xs text-sidebar-foreground/70">IniciativaCoerente</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="sr-only">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}