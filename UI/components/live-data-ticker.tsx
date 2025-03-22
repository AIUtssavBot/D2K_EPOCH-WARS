"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export function LiveDataTicker() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isUpdating, setIsUpdating] = useState(false)
  const [timeAgo, setTimeAgo] = useState("")

  useEffect(() => {
    // Update the time ago text every minute
    const updateTimeAgo = () => {
      const now = new Date()
      const diffMs = now.getTime() - lastUpdated.getTime()
      const diffMins = Math.floor(diffMs / 60000)

      if (diffMins < 1) {
        setTimeAgo("just now")
      } else if (diffMins === 1) {
        setTimeAgo("1 minute ago")
      } else {
        setTimeAgo(`${diffMins} minutes ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000)

    // Simulate data updates every 5 minutes
    const dataUpdateInterval = setInterval(() => {
      setIsUpdating(true)
      setTimeout(() => {
        setLastUpdated(new Date())
        setIsUpdating(false)
      }, 2000)
    }, 300000)

    return () => {
      clearInterval(interval)
      clearInterval(dataUpdateInterval)
    }
  }, [lastUpdated])

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Badge variant="outline" className="gap-1 px-2 py-1">
        {isUpdating ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Updating data...</span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span>Last updated: {timeAgo}</span>
          </>
        )}
      </Badge>
    </div>
  )
}

