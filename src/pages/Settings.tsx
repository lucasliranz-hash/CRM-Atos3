import { useLocation, useNavigate } from 'react-router-dom'
import { BackupManager } from '@/components/BackupManager'
import { DatabaseDiagnostic } from '@/components/DatabaseDiagnostic'
import { CompanySettingsForm } from '@/components/settings/CompanySettingsForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Settings() {
  const location = useLocation()
  const navigate = useNavigate()

  const currentTab = location.pathname.includes('/settings/company')
    ? 'company'
    : 'system'

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-8 mt-8">
      <div>
        <h1 className="text-3xl font-black text-black tracking-tight">
          Configurações
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Personalize a experiência, identidade e integrações do seu CRM.
        </p>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={(val) =>
          navigate(val === 'company' ? '/settings/company' : '/settings')
        }
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="company" className="text-base px-6 py-2">
            Empresa Emitente
          </TabsTrigger>
          <TabsTrigger value="system" className="text-base px-6 py-2">
            Sistema e Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-0">
          <CompanySettingsForm />
        </TabsContent>

        <TabsContent value="system" className="space-y-6 mt-0">
          <DatabaseDiagnostic />
          <BackupManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
