"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { GripVertical, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface WidgetItem {
  id: string
  name: string
  enabled: boolean
}

export function DashboardCustomization() {
  const [widgets, setWidgets] = useState<WidgetItem[]>([
    { id: "kpi-cards", name: "KPI Cards", enabled: true },
    { id: "task-miss-heatmap", name: "Task Miss Heatmap", enabled: true },
    { id: "trend-charts", name: "Trend Charts", enabled: true },
    { id: "risk-indicators", name: "Risk Indicators", enabled: true },
    { id: "alert-panel", name: "Alert Panel", enabled: true },
    { id: "prediction-insights", name: "Prediction Insights", enabled: false },
    { id: "risk-forecast", name: "Risk Forecast", enabled: false },
  ])

  const [isSaving, setIsSaving] = useState(false)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(widgets)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setWidgets(items)
  }

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map((widget) => (widget.id === id ? { ...widget, enabled: !widget.enabled } : widget)))
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Dashboard layout saved",
        description: "Your dashboard customization has been saved successfully.",
      })
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Customization</CardTitle>
        <CardDescription>Customize your dashboard layout and visible widgets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Widget Visibility</h3>
            <p className="text-sm text-muted-foreground">Toggle widgets on or off to customize your dashboard view</p>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="widgets">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {widgets.map((widget, index) => (
                      <Draggable key={widget.id} draggableId={widget.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center justify-between rounded-md border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <Label htmlFor={`widget-${widget.id}`} className="cursor-pointer">
                                {widget.name}
                              </Label>
                            </div>
                            <Switch
                              id={`widget-${widget.id}`}
                              checked={widget.enabled}
                              onCheckedChange={() => toggleWidget(widget.id)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Layout"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

