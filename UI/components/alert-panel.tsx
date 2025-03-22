"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bell, CheckCircle2, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Alert {
  id: string
  title: string
  description: string
  timestamp: string
  type: "critical" | "warning" | "info"
  isNew: boolean
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    title: "Critical Equipment Failure",
    description: "HVAC system in Building A has stopped functioning. Immediate attention required.",
    timestamp: "10 minutes ago",
    type: "critical",
    isNew: true,
  },
  {
    id: "2",
    title: "Maintenance Task Overdue",
    description: "Monthly inspection for electrical systems is 3 days overdue.",
    timestamp: "2 hours ago",
    type: "warning",
    isNew: true,
  },
  {
    id: "3",
    title: "Safety Compliance Alert",
    description: "Fire extinguisher inspection in Building C is due tomorrow.",
    timestamp: "5 hours ago",
    type: "warning",
    isNew: false,
  },
  {
    id: "4",
    title: "Task Reassignment",
    description: "5 tasks have been reassigned from Team Alpha to Team Beta.",
    timestamp: "Yesterday",
    type: "info",
    isNew: false,
  },
  {
    id: "5",
    title: "System Update Complete",
    description: "Dashboard has been updated to version 2.4.0 with new features.",
    timestamp: "2 days ago",
    type: "info",
    isNew: false,
  },
]

export function AlertPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const markAllAsRead = () => {
    setAlerts(alerts.map((alert) => ({ ...alert, isNew: false })))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "critical":
        return (
          <Badge variant="destructive" className="ml-2">
            Critical
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-500">
            Warning
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="ml-2 border-blue-500 text-blue-500">
            Info
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Alerts & Notifications</CardTitle>
            {alerts.some((alert) => alert.isNew) && (
              <Badge variant="destructive" className="h-5 px-1">
                {alerts.filter((alert) => alert.isNew).length} new
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle2 className="mr-1 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
        <CardDescription>Recent alerts and notifications requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "relative rounded-lg border p-4 transition-colors",
                  alert.isNew ? "border-l-4 border-l-primary bg-muted/50" : "bg-card",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{alert.title}</h4>
                        {getAlertBadge(alert.type)}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => dismissAlert(alert.id)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">All caught up!</h3>
              <p className="mt-2 text-sm text-muted-foreground">You have no pending alerts or notifications.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

