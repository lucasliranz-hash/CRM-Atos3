import { BackupManager } from '@/components/BackupManager'
import { DatabaseDiagnostic } from '@/components/DatabaseDiagnostic'
import { CompanySettingsForm } from '@/components/settings/CompanySettingsForm'

export default function Settings() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-black text-black tracking-tight">
          Configurações
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Personalize a experiência, identidade e integrações do seu CRM.
        </p>
      </div>

      <DatabaseDiagnostic />
      <CompanySettingsForm />
      <BackupManager />
    </div>
  )
}
