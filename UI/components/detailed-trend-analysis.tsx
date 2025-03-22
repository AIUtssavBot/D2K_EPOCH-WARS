"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartLegendItem,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for the area chart
const areaData = [
  { name: "Week 1", maintenance: 40, inspection: 24, cleaning: 18, repair: 12 },
  { name: "Week 2", maintenance: 35, inspection: 28, cleaning: 20, repair: 15 },
  { name: "Week 3", maintenance: 45, inspection: 22, cleaning: 15, repair: 10 },
  { name: "Week 4", maintenance: 50, inspection: 26, cleaning: 22, repair: 18 },
  { name: "Week 5", maintenance: 42, inspection: 30, cleaning: 25, repair: 14 },
  { name: "Week 6", maintenance: 48, inspection: 32, cleaning: 20, repair: 16 },
  { name: "Week 7", maintenance: 52, inspection: 28, cleaning: 22, repair: 20 },
  { name: "Week 8", maintenance: 55, inspection: 34, cleaning: 24, repair: 22 },
]

// Sample data for the pie chart
const pieData = [
  { name: "Maintenance", value: 42, color: "#3b82f6" },
  { name: "Inspection", value: 28, color: "#10b981" },
  { name: "Cleaning", value: 20, color: "#f59e0b" },
  { name: "Repair", value: 10, color: "#ef4444" },
]

export function DetailedTrendAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Trend Analysis</CardTitle>
        <CardDescription>Comprehensive breakdown of task types and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="distribution">
          <TabsList className="mb-4">
            <TabsTrigger value="distribution">Task Distribution</TabsTrigger>
            <TabsTrigger value="trends">Task Type Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="distribution" className="h-[400px]">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Chart>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <ChartTooltip>
                                <ChartTooltipContent>
                                  <div className="font-medium">{data.name}</div>
                                  <div className="mt-2 font-bold">
                                    {data.value} tasks ({((data.value / 100) * 100).toFixed(0)}%)
                                  </div>
                                </ChartTooltipContent>
                              </ChartTooltip>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </Chart>
              <div className="flex flex-col justify-center space-y-4">
                <h3 className="text-lg font-medium">Task Type Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  Maintenance tasks make up the largest portion of facility work at 42%, followed by inspections at 28%.
                  Cleaning and repair tasks account for 20% and 10% respectively.
                </p>
                <div className="space-y-2">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value} tasks</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="trends" className="h-[400px]">
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart
                    data={areaData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltip>
                              <ChartTooltipContent>
                                <div className="font-medium">{label}</div>
                                <div className="mt-2 flex flex-col gap-1">
                                  {payload.map((entry) => (
                                    <div key={entry.name} className="flex items-center gap-2">
                                      <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                      ></div>
                                      <span>
                                        {entry.name}: {entry.value} tasks
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          )
                        }
                        return null
                      }}
                    />
                    <Area type="monotone" dataKey="maintenance" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                    <Area type="monotone" dataKey="inspection" stackId="1" stroke="#10b981" fill="#10b981" />
                    <Area type="monotone" dataKey="cleaning" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                    <Area type="monotone" dataKey="repair" stackId="1" stroke="#ef4444" fill="#ef4444" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend className="mt-4 justify-center">
                <ChartLegendItem color="#3b82f6" label="Maintenance" />
                <ChartLegendItem color="#10b981" label="Inspection" />
                <ChartLegendItem color="#f59e0b" label="Cleaning" />
                <ChartLegendItem color="#ef4444" label="Repair" />
              </ChartLegend>
            </Chart>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

