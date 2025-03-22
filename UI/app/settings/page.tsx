import { DashboardHeader } from "@/components/dashboard-header"
import { SettingsForm } from "@/components/settings-form"
import { DashboardCustomization } from "@/components/dashboard-customization"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DashboardHeader title="Settings" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SettingsForm />
        <DashboardCustomization />
      </div>
    </div>
  )
}

