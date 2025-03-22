"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

// Generate sample data for the heatmap
const generateHeatmapData = (days: number, areas: number) => {
  const data = []
  for (let day = 0; day < days; day++) {
    for (let area = 0; area < areas; area++) {
      // Random value between 0 and 100
      const value = Math.floor(Math.random() * 100)
      data.push({
        day,
        area,
        value,
      })
    }
  }
  return data
}

const weeklyData = generateHeatmapData(7, 10)
const monthlyData = generateHeatmapData(30, 10)

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const areaNames = [
  "Building A",
  "Building B",
  "Building C",
  "Building D",
  "Building E",
  "Building F",
  "Building G",
  "Building H",
  "Building I",
  "Building J",
]

// Color scale for the heatmap
const getColor = (value: number) => {
  if (value < 20) return "#10b981" // Green for low miss rate
  if (value < 50) return "#f59e0b" // Yellow for medium miss rate
  if (value < 80) return "#f97316" // Orange for high miss rate
  return "#ef4444" // Red for very high miss rate
}

export function TaskMissHeatmap() {
  const [activeTab, setActiveTab] = useState("weekly")
  const data = activeTab === "weekly" ? weeklyData : monthlyData

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Task Miss Heatmap</CardTitle>
        <CardDescription>Visualize task miss patterns across different areas and time periods</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" className="h-[300px]">
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 40,
                      left: 20,
                    }}
                  >
                    <XAxis
                      type="number"
                      dataKey="day"
                      name="Day"
                      domain={[0, 6]}
                      tickFormatter={(value) => dayNames[value]}
                      tick={{ fontSize: 12 }}
                      tickCount={7}
                    />
                    <YAxis
                      type="number"
                      dataKey="area"
                      name="Area"
                      domain={[0, 9]}
                      tickFormatter={(value) => areaNames[value]}
                      tick={{ fontSize: 12 }}
                    />
                    <ZAxis type="number" dataKey="value" range={[100, 500]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <ChartTooltip>
                              <ChartTooltipContent>
                                <div className="font-medium">{areaNames[data.area]}</div>
                                <div className="text-sm text-muted-foreground">{dayNames[data.day]}</div>
                                <div className="mt-2 font-bold">{data.value}% Miss Rate</div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter data={data}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Chart>
          </TabsContent>
          <TabsContent value="monthly" className="h-[300px]">
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 40,
                      left: 20,
                    }}
                  >
                    <XAxis
                      type="number"
                      dataKey="day"
                      name="Day"
                      domain={[0, 29]}
                      tickFormatter={(value) => value + 1}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="area"
                      name="Area"
                      domain={[0, 9]}
                      tickFormatter={(value) => areaNames[value]}
                      tick={{ fontSize: 12 }}
                    />
                    <ZAxis type="number" dataKey="value" range={[100, 500]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <ChartTooltip>
                              <ChartTooltipContent>
                                <div className="font-medium">{areaNames[data.area]}</div>
                                <div className="text-sm text-muted-foreground">Day {data.day + 1}</div>
                                <div className="mt-2 font-bold">{data.value}% Miss Rate</div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter data={data}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Chart>
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span>Risk Level:</span>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-orange-500"></span>
              <span>High</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span>Critical</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

