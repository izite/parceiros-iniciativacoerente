import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const contracts = [
  {
    id: "CNT-001",
    customer: "Metro Energy Corp",
    type: "Supply Agreement",
    capacity: "50 MW",
    status: "active",
    value: "$125,000",
    date: "2024-01-15"
  },
  {
    id: "CNT-002", 
    customer: "Industrial Solutions Ltd",
    type: "Distribution",
    capacity: "25 MW",
    status: "pending",
    value: "$78,500",
    date: "2024-01-14"
  },
  {
    id: "CNT-003",
    customer: "Green Power Inc",
    type: "Renewable Supply",
    capacity: "100 MW",
    status: "active",
    value: "$250,000",
    date: "2024-01-13"
  },
  {
    id: "CNT-004",
    customer: "City Municipal",
    type: "Public Supply",
    capacity: "75 MW",
    status: "expired",
    value: "$180,000",
    date: "2024-01-12"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-success text-success-foreground"
    case "pending": return "bg-warning text-warning-foreground"
    case "expired": return "bg-muted text-muted-foreground"
    default: return "bg-secondary text-secondary-foreground"
  }
}

export function RecentContracts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Contracts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contracts.map((contract) => (
          <div key={contract.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {contract.customer.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{contract.customer}</p>
                  <Badge variant="outline" className="text-xs">{contract.id}</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{contract.type}</span>
                  <span>•</span>
                  <span>{contract.capacity}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{contract.value}</p>
                <p className="text-xs text-muted-foreground">{contract.date}</p>
              </div>
              <Badge className={getStatusColor(contract.status)}>
                {contract.status}
              </Badge>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}