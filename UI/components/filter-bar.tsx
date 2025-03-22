"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function FilterBar() {
  const [date, setDate] = useState<Date>()
  const [taskType, setTaskType] = useState<string>("")
  const [team, setTeam] = useState<string>("")
  const [filtersApplied, setFiltersApplied] = useState(false)

  const handleApplyFilters = () => {
    setFiltersApplied(true)
  }

  const handleClearFilters = () => {
    setDate(undefined)
    setTaskType("")
    setTeam("")
    setFiltersApplied(false)
  }

  // Format date using native JavaScript
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={date ? "default" : "outline"}
              className={cn("h-8 justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDate(date) : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>

        <Select value={taskType} onValueChange={setTaskType}>
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder="Task Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inspection">Inspection</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="repair">Repair</SelectItem>
          </SelectContent>
        </Select>

        <Select value={team} onValueChange={setTeam}>
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alpha">Alpha Team</SelectItem>
            <SelectItem value="beta">Beta Team</SelectItem>
            <SelectItem value="gamma">Gamma Team</SelectItem>
            <SelectItem value="delta">Delta Team</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8" onClick={handleClearFilters} disabled={!filtersApplied}>
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
        <Button size="sm" className="h-8" onClick={handleApplyFilters}>
          <Filter className="mr-1 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

