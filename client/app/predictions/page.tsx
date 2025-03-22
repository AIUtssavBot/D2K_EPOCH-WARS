import { DashboardHeader } from "@/components/dashboard-header"
import { FilterBar } from "@/components/filter-bar"
import { PredictionInsights } from "@/components/prediction-insights"
import { RiskForecast } from "@/components/risk-forecast"

export default function PredictionsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader title="Predictions & Insights" />
      <FilterBar />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PredictionInsights />
        <RiskForecast />
      </div>
    </div>
  )
}

