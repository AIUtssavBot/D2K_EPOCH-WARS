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
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data for the charts
const dailyData = [
  { name: "Mon", completed: 42, missed: 4, total: 46 },
  { name: "Tue", completed: 38, missed: 6, total: 44 },
  { name: "Wed", completed: 45, missed: 3, total: 48 },
  { name: "Thu", completed: 39, missed: 7, total: 46 },
  { name: "Fri", completed: 40, missed: 5, total: 45 },
  { name: "Sat", completed: 30, missed: 2, total: 32 },
  { name: "Sun", completed: 25, missed: 1, total: 26 },
]

const weeklyData = [
  { name: "Week 1", completed: 250, missed: 20, total: 270 },
  { name: "Week 2", completed: 280, missed: 15, total: 295 },
  { name: "Week 3", completed: 260, missed: 25, total: 285 },
  { name: "Week 4", completed: 290, missed: 10, total: 300 },
]

const monthlyData = [
  { name: "Jan", completed: 1100, missed: 80, total: 1180 },
  { name: "Feb", completed: 980, missed: 70, total: 1050 },
  { name: "Mar", completed: 1050, missed: 90, total: 1140 },
  { name: "Apr", completed: 1200, missed: 60, total: 1260 },
  { name: "May", completed: 1150, missed: 75, total: 1225 },
  { name: "Jun", completed: 1300, missed: 50, total: 1350 },
]

interface TrendChartsProps {
  expanded?: boolean
}

export function TrendCharts({ expanded = false }: TrendChartsProps) {
  return (
    <Card className={expanded ? "col-span-full" : "col-span-1"}>
      <CardHeader>
        <CardTitle>Task Completion Trends</CardTitle>
        <CardDescription>Track task completion and miss rates over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className={expanded ? "h-[500px]" : "h-[300px]"}>
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyData}
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
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span>Completed: {payload[0].value}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                    <span>Missed: {payload[1].value}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                    <span>Total: {payload[2].value}</span>
                                  </div>
                                </div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="missed" stroke="hsl(var(--destructive))" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend className="mt-4 justify-center">
                <ChartLegendItem color="hsl(var(--primary))" label="Completed" />
                <ChartLegendItem color="hsl(var(--destructive))" label="Missed" />
                <ChartLegendItem color="hsl(var(--muted-foreground))" label="Total" />
              </ChartLegend>
            </Chart>
          </TabsContent>
          <TabsContent value="weekly" className={expanded ? "h-[500px]" : "h-[300px]"}>
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
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
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span>Completed: {payload[0].value}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                    <span>Missed: {payload[1].value}</span>
                                  </div>
                                </div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="completed" fill="hsl(var(--primary))" />
                    <Bar dataKey="missed" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend className="mt-4 justify-center">
                <ChartLegendItem color="hsl(var(--primary))" label="Completed" />
                <ChartLegendItem color="hsl(var(--destructive))" label="Missed" />
              </ChartLegend>
            </Chart>
          </TabsContent>
          <TabsContent value="monthly" className={expanded ? "h-[500px]" : "h-[300px]"}>
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
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
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span>Completed: {payload[0].value}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                    <span>Missed: {payload[1].value}</span>
                                  </div>
                                </div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="completed" fill="hsl(var(--primary))" />
                    <Bar dataKey="missed" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend className="mt-4 justify-center">
                <ChartLegendItem color="hsl(var(--primary))" label="Completed" />
                <ChartLegendItem color="hsl(var(--destructive))" label="Missed" />
              </ChartLegend>
            </Chart>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

