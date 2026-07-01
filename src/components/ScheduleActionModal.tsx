import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { CalendarClock, Loader2 } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountId: string
  onSuccess?: () => void
}

export function ScheduleActionModal({
  open,
  onOpenChange,
  accountId,
  onSuccess,
}: Props) {
  const { toast } = useToast()
  const [type, setType] = useState('Follow-up')
  const [customType, setCustomType] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [description, setDescription] = useState('')
  const [responsible, setResponsible] = useState('none')
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      setDate(tomorrow.toISOString().split('T')[0])
      setTime('09:00')
      setType('Follow-up')
      setCustomType('')
      setDescription('')
      setResponsible('none')

      supabase
        .from('profiles')
        .select('id, nome')
        .eq('ativo', true)
        .then(({ data }) => {
          if (data) setProfiles(data)
        })
    }
  }, [open])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time) return
    setLoading(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id

      const dateTime = new Date(`${date}T${time}:00`).toISOString()

      const finalType = type === 'Outro' ? customType : type

      const payload = {
        accountId,
        type: finalType,
        date: dateTime,
        description: description || null,
        status: 'Pendente',
        completed: false,
        user_id: responsible !== 'none' ? responsible : userId,
      }

      const { error } = await supabase.from('activities').insert(payload as any)
      if (error) throw error

      toast({ title: 'Próxima ação agendada com sucesso!' })
      window.dispatchEvent(new Event('lead_updated'))
      onSuccess?.()
      onOpenChange(false)
    } catch (err: any) {
      toast({
        title: 'Erro ao agendar ação',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-slate-200 rounded-2xl bg-white">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-[#FF6A00]" />
            Agendar Próxima Ação
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSave}
          className="space-y-4 p-6 pt-2 animate-in fade-in duration-300"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">
              Tipo da Ação *
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ligação">Ligação</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="E-mail">E-mail</SelectItem>
                <SelectItem value="Reunião">Reunião</SelectItem>
                <SelectItem value="Visita">Visita</SelectItem>
                <SelectItem value="Apresentação">Apresentação</SelectItem>
                <SelectItem value="Envio de proposta">
                  Envio de proposta
                </SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'Outro' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Especifique a ação *
              </label>
              <Input
                required
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className="bg-white"
                placeholder="Ex: Envio de brinde"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Data *</label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Hora *</label>
              <Input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">
              Observação
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre a ação a ser realizada..."
              className="bg-white resize-none h-20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">
              Responsável
            </label>
            <Select value={responsible} onValueChange={setResponsible}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Atribuir a mim</SelectItem>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || (type === 'Outro' && !customType)}
              className="font-bold bg-[#FF6A00] hover:bg-[#e65c00] text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Agendando...
                </>
              ) : (
                'Agendar Ação'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
