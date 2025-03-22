"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowUpRight, ShieldAlert } from "lucide-react"

interface RiskItemProps {
  name: string
  value: number
  trend: number
  status: "low" | "medium" | "high" | "critical"
}

function RiskItem({ name, value, trend, status }: RiskItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "low":
        return "Low Risk"
      case "medium":
        return "Medium Risk"
      case "high":
        return "High Risk"
      case "critical":
        return "Critical Risk"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{name}</span>
          {status === "high" || status === "critical" ? <AlertTriangle className="h-4 w-4 text-red-500" /> : null}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getStatusColor(status)} text-white`}>
            {getStatusText(status)}
          </Badge>
          {trend > 0 && (
            <span className="flex items-center text-xs text-red-500">
              <ArrowUpRight className="h-3 w-3" />
              {trend}%
            </span>
          )}
        </div>
      </div>
      <Progress value={value} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  )
}

export function RiskIndicators() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Risk Indicators</CardTitle>
          <ShieldAlert className="h-5 w-5 text-orange-500" />
        </div>
        <CardDescription>Key risk metrics and their current status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RiskItem name="Equipment Failure" value={75} trend={12} status="high" />
        <RiskItem name="Maintenance Backlog" value={85} trend={8} status="critical" />
        <RiskItem name="Safety Compliance" value={35} trend={0} status="medium" />
        <RiskItem name="Staff Availability" value={20} trend={0} status="low" />
        <RiskItem name="Budget Utilization" value={60} trend={5} status="medium" />
      </CardContent>
    </Card>
  )
}

