import { DashboardHeader } from "@/components/dashboard-header"
import { FilterBar } from "@/components/filter-bar"
import { TrendCharts } from "@/components/trend-charts"
import { DetailedTrendAnalysis } from "@/components/detailed-trend-analysis"

export default function TrendsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader title="Trends Analysis" />
      <FilterBar />
      <div className="grid grid-cols-1 gap-6">
        <TrendCharts expanded />
        <DetailedTrendAnalysis />
      </div>
    </div>
  )
}

