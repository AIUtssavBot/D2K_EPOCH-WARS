import { DashboardHeader } from "@/components/dashboard-header"
import { KpiCards } from "@/components/kpi-cards"
import { TaskMissHeatmap } from "@/components/task-miss-heatmap"
import { TrendCharts } from "@/components/trend-charts"
import { RiskIndicators } from "@/components/risk-indicators"
import { AlertPanel } from "@/components/alert-panel"
import { FilterBar } from "@/components/filter-bar"
import { LiveDataTicker } from "@/components/live-data-ticker"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader />
      <FilterBar />
      <LiveDataTicker />
      <KpiCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TaskMissHeatmap />
        <TrendCharts />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RiskIndicators />
        <div className="lg:col-span-2">
          <AlertPanel />
        </div>
      </div>
    </div>
  )
}

