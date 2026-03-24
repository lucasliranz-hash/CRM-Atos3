import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

interface ProposalGeneratorDialogProps {
  accountId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProposalGeneratorDialog({
  accountId,
  open,
  onOpenChange,
}: ProposalGeneratorDialogProps) {
  const navigate = useNavigate()
  const [telemetry, setTelemetry] = useState(true)
  const [video, setVideo] = useState(false)
  const [ai, setAi] = useState(false)
  const [unit, setUnit] = useState('150')
  const [setup, setSetup] = useState('1000')

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!accountId) return
    const params = new URLSearchParams({
      accountId,
      telemetry: telemetry.toString(),
      video: video.toString(),
      ai: ai.toString(),
      unit: unit.toString(),
      setup: setup.toString(),
    })
    navigate(`/proposal?${params.toString()}`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerar Proposta Comercial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleGenerate} className="space-y-6 mt-4">
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500">
              Soluções Incluídas
            </h4>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Telemetria Avançada
              </label>
              <Switch checked={telemetry} onCheckedChange={setTelemetry} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Vídeo Telemetria
              </label>
              <Switch checked={video} onCheckedChange={setVideo} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Câmera IA (Fadiga)
              </label>
              <Switch checked={ai} onCheckedChange={setAi} />
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500">
              Precificação
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">
                  Valor Unitário (R$)
                </label>
                <Input
                  type="number"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">
                  Setup Total (R$)
                </label>
                <Input
                  type="number"
                  value={setup}
                  onChange={(e) => setSetup(e.target.value)}
                  required
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-bold"
            >
              Gerar Documento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
