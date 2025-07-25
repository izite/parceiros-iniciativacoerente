import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, FileText, Users, Zap, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Active Contracts",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "text-primary"
  },
  {
    title: "Total Customers",
    value: "892",
    change: "+5%",
    trend: "up",
    icon: Users,
    color: "text-accent"
  },
  {
    title: "Power Capacity",
    value: "2,450 MW",
    change: "+8%",
    trend: "up",
    icon: Zap,
    color: "text-warning"
  },
  {
    title: "Monthly Revenue",
    value: "$485,200",
    change: "-3%",
    trend: "down",
    icon: DollarSign,
    color: "text-success"
  }
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="flex items-center text-xs">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-success mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive mr-1" />
              )}
              <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                {stat.change}
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}