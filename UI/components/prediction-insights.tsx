"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Lightbulb } from "lucide-react"

// Sample data for the prediction chart
const predictionData = [
  { name: "Week 1", actual: 42, predicted: null },
  { name: "Week 2", actual: 38, predicted: null },
  { name: "Week 3", actual: 45, predicted: null },
  { name: "Week 4", actual: 39, predicted: null },
  { name: "Week 5", actual: 40, predicted: null },
  { name: "Week 6", actual: 43, predicted: null },
  { name: "Week 7", actual: 41, predicted: null },
  { name: "Week 8", actual: 44, predicted: null },
  { name: "Week 9", actual: null, predicted: 46 },
  { name: "Week 10", actual: null, predicted: 48 },
  { name: "Week 11", actual: null, predicted: 52 },
  { name: "Week 12", actual: null, predicted: 49 },
]

export function PredictionInsights() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Task Volume Prediction</CardTitle>
          <Badge variant="outline" className="gap-1 border-blue-500 text-blue-500">
            <Lightbulb className="h-3 w-3" />
            AI Powered
          </Badge>
        </div>
        <CardDescription>Predicted task volumes for the next 4 weeks based on historical data</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={predictionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis domain={[30, 60]} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <ChartTooltip>
                          <ChartTooltipContent>
                            <div className="font-medium">{label}</div>
                            <div className="mt-2 flex flex-col gap-1">
                              {data.actual !== null && (
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                                  <span>Actual: {data.actual} tasks</span>
                                </div>
                              )}
                              {data.predicted !== null && (
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                  <span>Predicted: {data.predicted} tasks</span>
                                </div>
                              )}
                            </div>
                          </ChartTooltipContent>
                        </ChartTooltip>
                      )
                    }
                    return null
                  }}
                />
                <ReferenceLine x="Week 8" stroke="#888" strokeDasharray="3 3" label="Today" />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Chart>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
            <div>
              <span className="font-medium">Historical Data</span>
              <p className="text-sm text-muted-foreground">Actual task volumes from the past 8 weeks</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
            <div>
              <span className="font-medium">Predicted Trend</span>
              <p className="text-sm text-muted-foreground">
                AI-powered prediction shows a 15% increase in task volume over the next 4 weeks. Consider allocating
                additional resources to handle the increased workload.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

