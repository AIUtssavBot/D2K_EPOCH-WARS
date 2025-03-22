"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowRight, Lightbulb } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface RiskAreaProps {
  name: string
  currentRisk: number
  predictedRisk: number
  impact: "low" | "medium" | "high"
  recommendation: string
}

function RiskArea({ name, currentRisk, predictedRisk, impact, recommendation }: RiskAreaProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getImpactText = (impact: string) => {
    switch (impact) {
      case "low":
        return "Low Impact"
      case "medium":
        return "Medium Impact"
      case "high":
        return "High Impact"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{name}</h4>
        <Badge variant="outline" className={`${getImpactColor(impact)}`}>
          {getImpactText(impact)}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>Current Risk</span>
            <span className="font-medium">{currentRisk}%</span>
          </div>
          <Progress value={currentRisk} className="h-2" />
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>Predicted Risk</span>
            <span className="font-medium">{predictedRisk}%</span>
          </div>
          <Progress value={predictedRisk} className="h-2" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{recommendation}</p>
    </div>
  )
}

export function RiskForecast() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Risk Forecast</CardTitle>
          <Badge variant="outline" className="gap-1 border-blue-500 text-blue-500">
            <Lightbulb className="h-3 w-3" />
            AI Powered
          </Badge>
        </div>
        <CardDescription>Predicted risk levels and recommended actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Risk Alert</h4>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                Maintenance backlog is predicted to increase by 25% in the next 30 days if current trends continue.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <RiskArea
            name="Equipment Failure"
            currentRisk={35}
            predictedRisk={48}
            impact="high"
            recommendation="Schedule preventive maintenance for critical equipment in Building A."
          />
          <RiskArea
            name="Maintenance Backlog"
            currentRisk={60}
            predictedRisk={85}
            impact="high"
            recommendation="Allocate additional resources to address the growing backlog."
          />
          <RiskArea
            name="Safety Compliance"
            currentRisk={25}
            predictedRisk={20}
            impact="medium"
            recommendation="Continue current safety protocols and training programs."
          />
          <RiskArea
            name="Budget Overrun"
            currentRisk={40}
            predictedRisk={55}
            impact="medium"
            recommendation="Review spending patterns and identify cost-saving opportunities."
          />
        </div>
      </CardContent>
    </Card>
  )
}

