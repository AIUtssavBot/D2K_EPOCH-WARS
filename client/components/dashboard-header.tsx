import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

interface DashboardHeaderProps {
  title?: string
}

export function DashboardHeader({ title = "Dashboard Overview" }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">Monitor task performance, visualize trends, and manage risk</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </div>
  )
}

