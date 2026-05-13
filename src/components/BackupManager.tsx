import { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Loader2,
  Database,
  FileDown,
  FileUp,
  AlertTriangle,
  Stethoscope,
} from 'lucide-react'
import {
  exportCompleteBackup,
  diagnoseBackup,
  extractDataFromBackup,
  importBackupData,
} from '@/lib/backup-utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export function BackupManager() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const diagnoseInputRef = useRef<HTMLInputElement>(null)

  const [isExporting, setIsExporting] = useState(false)
  const [importStatus, setImportStatus] = useState<string[]>([])
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null)
  const [showDiagnosticDialog, setShowDiagnosticDialog] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportCompleteBackup('crm_backup')
      toast({ title: 'Backup exportado com sucesso' })
    } catch (error: any) {
      toast({
        title: 'Erro ao exportar',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const reader = new FileReader()
    reader.onload = async (ev) => {
      const content = ev.target?.result as string
      if (!content) return

      try {
        setImportStatus(['Lendo arquivo...'])
        setShowImportDialog(true)

        const parsed = JSON.parse(content)
        setImportStatus((prev) => [...prev, 'Validando JSON...'])
        const data = extractDataFromBackup(parsed)

        setImportStatus((prev) => [...prev, 'Criando backup atual...'])
        await exportCompleteBackup('backup_before_import')

        const stats = await importBackupData(data, (msg) => {
          setImportStatus((prev) => [...prev, msg])
        })

        setImportStatus((prev) => [
          ...prev,
          `Importação concluída!`,
          `Empresas/Leads: ${stats.accounts}`,
          `Contatos: ${stats.contacts}`,
          `Oportunidades: ${stats.opportunities}`,
          `Propostas: ${stats.proposals}`,
          `Atividades: ${stats.activities}`,
          `Erros ou ignorados: ${stats.errors}`,
        ])
      } catch (error: any) {
        toast({
          title: 'Erro ao importar',
          description: 'Arquivo JSON inválido ou corrompido.',
          variant: 'destructive',
        })
        setShowImportDialog(false)
      }
    }
    reader.readAsText(file)
  }

  const handleDiagnoseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = ev.target?.result as string
      if (!content) return

      const result = diagnoseBackup(content)
      setDiagnosticResult(result)
      setShowDiagnosticDialog(true)
    }
    reader.readAsText(file)
  }

  return (
    <>
      <Card className="max-w-xl shadow-sm border-gray-200 bg-white animate-in fade-in duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-500" />
            Backup e Restauração
          </CardTitle>
          <CardDescription>
            Exporte ou importe todos os dados do CRM em formato JSON.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-orange-800">
                Antes de importar, faça um backup!
              </h4>
              <p className="text-xs text-orange-600 mt-1">
                A importação atualizará registros existentes baseados no ID. O
                sistema fará um backup automático antes de iniciar.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex-1 font-bold border-gray-300"
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4 mr-2" />
                )}
                Exportar Backup Completo
              </Button>
              <Button
                variant="outline"
                className="flex-1 font-bold border-gray-300"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="w-4 h-4 mr-2" />
                Importar Backup JSON
              </Button>
              <input
                type="file"
                accept=".json"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImportFile}
              />
            </div>

            <Button
              variant="secondary"
              className="w-full font-bold"
              onClick={() => diagnoseInputRef.current?.click()}
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Diagnosticar Backup
            </Button>
            <input
              type="file"
              accept=".json"
              className="hidden"
              ref={diagnoseInputRef}
              onChange={handleDiagnoseFile}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={showImportDialog}
        onOpenChange={(open) => {
          if (!open && !importStatus.includes('Importação concluída!')) return
          setShowImportDialog(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importando Backup</DialogTitle>
            <DialogDescription>
              Por favor, não feche esta janela até o término do processo.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 p-4 rounded-md h-64 overflow-y-auto font-mono text-sm space-y-1">
            {importStatus.map((status, i) => (
              <div key={i} className="text-gray-700">
                {status}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowImportDialog(false)
                window.location.reload()
              }}
              disabled={!importStatus.includes('Importação concluída!')}
            >
              Concluir e Recarregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDiagnosticDialog}
        onOpenChange={setShowDiagnosticDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Diagnóstico de Backup</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {diagnosticResult?.valid ? (
              <>
                <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm border border-green-200">
                  Arquivo JSON válido. Veja as tabelas encontradas:
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {Object.entries(diagnosticResult.report).map(
                    ([table, count]) => (
                      <div
                        key={table}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded border"
                      >
                        <span className="font-medium text-gray-700">
                          {table}
                        </span>
                        <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full font-bold">
                          {String(count)} registros
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </>
            ) : (
              <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200">
                <strong>Erro:</strong>{' '}
                {diagnosticResult?.error || 'Arquivo inválido'}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDiagnosticDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
