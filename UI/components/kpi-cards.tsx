"use client"

import type React from "react"

import { ArrowDownIcon, ArrowUpIcon, CheckCircle2, Clock, AlertTriangle, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

function KpiCard({ title, value, description, icon, trend }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          {trend && (
            <span
              className={cn("mr-1 flex items-center text-xs", trend.isPositive ? "text-green-500" : "text-red-500")}
            >
              {trend.isPositive ? <ArrowUpIcon className="mr-1 h-3 w-3" /> : <ArrowDownIcon className="mr-1 h-3 w-3" />}
              {trend.value}%
            </span>
          )}
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
      </CardContent>
    </Card>
  )
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total Tasks"
        value="1,248"
        description="vs. previous month"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 12, isPositive: true }}
      />
      <KpiCard
        title="Completed Tasks"
        value="867"
        description="69.5% completion rate"
        icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
        trend={{ value: 8, isPositive: true }}
      />
      <KpiCard
        title="Missed Tasks"
        value="124"
        description="9.9% miss rate"
        icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
        trend={{ value: 2, isPositive: false }}
      />
      <KpiCard
        title="Risk Score"
        value="42"
        description="Medium risk level"
        icon={<ShieldAlert className="h-4 w-4 text-orange-500" />}
        trend={{ value: 5, isPositive: true }}
      />
    </div>
  )
}

