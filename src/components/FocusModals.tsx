import { useState, useEffect } from 'react'
import useMainStore from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export function FocusModals({ modalState, onClose, onSuccess }: any) {
  const { addActivity, updateAccount, completeActivity } = useMainStore()
  const { toast } = useToast()

  const [wppMsg, setWppMsg] = useState('')
  const [wppSched, setWppSched] = useState(true)
  const [wppNext, setWppNext] = useState('')
  const [wppDate, setWppDate] = useState('')

  const [callAnswered, setCallAnswered] = useState('sim')
  const [callObs, setCallObs] = useState('')
  const [callSched, setCallSched] = useState(true)
  const [callNext, setCallNext] = useState('')
  const [callDate, setCallDate] = useState('')

  const [emailSubj, setEmailSubj] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [emailSched, setEmailSched] = useState(true)
  const [emailNext, setEmailNext] = useState('')
  const [emailDate, setEmailDate] = useState('')

  const [resPipe, setResPipe] = useState('')
  const [resObs, setResObs] = useState('')
  const [resSched, setResSched] = useState(true)
  const [resNext, setResNext] = useState('')
  const [resDate, setResDate] = useState('')

  useEffect(() => {
    if (modalState) {
      const now = new Date()
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
      const d = now.toISOString().slice(0, 16)
      const nextActStr = modalState.account.nextAction || ''
      const nextActDateStr = modalState.account.nextActionDate
        ? modalState.account.nextActionDate.slice(0, 16)
        : d

      setWppMsg(
        'Olá, tudo bem? Aqui é o Lucas da ATOS3. Estou entrando em contato para dar continuidade ao nosso atendimento.',
      )
      setWppSched(true)
      setWppNext(nextActStr)
      setWppDate(nextActDateStr)

      setCallAnswered('sim')
      setCallObs('')
      setCallSched(true)
      setCallNext(nextActStr)
      setCallDate(nextActDateStr)

      setEmailSubj('Acompanhamento ATOS3')
      setEmailBody(
        'Olá,\n\nGostaria de dar continuidade ao nosso contato...\n\nAtenciosamente,',
      )
      setEmailSched(true)
      setEmailNext(nextActStr)
      setEmailDate(nextActDateStr)

      setResPipe(modalState.account.pipelineStage || 'Prospecção')
      setResObs('')
      setResSched(true)
      setResNext(nextActStr)
      setResDate(nextActDateStr)
    }
  }, [modalState])

  const wrapSubmit = async (fn: () => Promise<void>) => {
    try {
      await fn()
      if (modalState.task.type === 'activity') {
        await completeActivity(modalState.task.item.id)
      }
      toast({ title: 'Ação registrada com sucesso!' })
      onSuccess?.()
      onClose()
    } catch (e) {
      toast({ title: 'Erro ao registrar ação', variant: 'destructive' })
    }
  }

  const handleWhatsApp = () =>
    wrapSubmit(async () => {
      const msg = encodeURIComponent(wppMsg)
      window.open(
        `https://wa.me/55${modalState.account.phone.replace(/\D/g, '')}?text=${msg}`,
        '_blank',
      )

      await addActivity({
        accountId: modalState.account.id,
        type: 'Mensagem',
        channel: 'WhatsApp',
        result: `Enviou mensagem via WhatsApp Web:\n${wppMsg}`,
        date: new Date().toISOString(),
        completed: true,
        ...(wppSched
          ? {
              nextAction: wppNext,
              nextActionDate: new Date(wppDate).toISOString(),
            }
          : {}),
      } as any)

      if (!wppSched) {
        await updateAccount(modalState.account.id, {
          nextAction: null as any,
          nextActionDate: null as any,
          lastTouchDate: new Date().toISOString(),
        })
      }
    })

  const handleCall = () =>
    wrapSubmit(async () => {
      await addActivity({
        accountId: modalState.account.id,
        type: 'Ligação',
        channel: 'Telefone',
        result: `Ligação ${callAnswered === 'sim' ? 'atendida' : 'não atendida'}. ${callObs}`,
        date: new Date().toISOString(),
        completed: true,
        ...(callSched
          ? {
              nextAction: callNext,
              nextActionDate: new Date(callDate).toISOString(),
            }
          : {}),
      } as any)

      if (!callSched) {
        await updateAccount(modalState.account.id, {
          nextAction: null as any,
          nextActionDate: null as any,
          lastTouchDate: new Date().toISOString(),
        })
      }
    })

  const handleEmail = () =>
    wrapSubmit(async () => {
      window.location.href = `mailto:${modalState.account.email}?subject=${encodeURIComponent(emailSubj)}&body=${encodeURIComponent(emailBody)}`

      await addActivity({
        accountId: modalState.account.id,
        type: 'E-mail',
        channel: 'E-mail',
        result: `E-mail enviado.\nAssunto: ${emailSubj}\nMensagem: ${emailBody}`,
        date: new Date().toISOString(),
        completed: true,
        ...(emailSched
          ? {
              nextAction: emailNext,
              nextActionDate: new Date(emailDate).toISOString(),
            }
          : {}),
      } as any)

      if (!emailSched) {
        await updateAccount(modalState.account.id, {
          nextAction: null as any,
          nextActionDate: null as any,
          lastTouchDate: new Date().toISOString(),
        })
      }
    })

  const handleResolve = () =>
    wrapSubmit(async () => {
      await addActivity({
        accountId: modalState.account.id,
        type: 'Follow-up',
        channel: 'WhatsApp',
        result: `Ação resolvida no Focus Mode. ${resObs}`,
        date: new Date().toISOString(),
        completed: true,
        ...(resSched
          ? {
              nextAction: resNext,
              nextActionDate: new Date(resDate).toISOString(),
            }
          : {}),
      } as any)
      await updateAccount(modalState.account.id, {
        pipelineStage: resPipe,
        status:
          resPipe === 'Perdido'
            ? 'Perdido'
            : resPipe === 'Fechado'
              ? 'Fechado'
              : 'Em andamento',
        ...(resSched
          ? {
              nextAction: resNext,
              nextActionDate: new Date(resDate).toISOString(),
            }
          : { nextAction: null as any, nextActionDate: null as any }),
        lastTouchDate: new Date().toISOString(),
      })
    })

  if (!modalState) return null

  return (
    <Dialog open={!!modalState} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        {modalState.type === 'whatsapp' && (
          <>
            <DialogHeader>
              <DialogTitle>Enviar WhatsApp</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Mensagem
                </label>
                <Textarea
                  value={wppMsg}
                  onChange={(e) => setWppMsg(e.target.value)}
                  className="h-24 resize-none"
                />
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <label className="text-sm font-bold text-gray-700">
                  Agendar próxima ação?
                </label>
                <Switch checked={wppSched} onCheckedChange={setWppSched} />
              </div>
              {wppSched && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      O que fazer?
                    </label>
                    <Input
                      value={wppNext}
                      onChange={(e) => setWppNext(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Quando?
                    </label>
                    <Input
                      type="datetime-local"
                      value={wppDate}
                      onChange={(e) => setWppDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleWhatsApp}
                disabled={!wppMsg || (wppSched && (!wppNext || !wppDate))}
              >
                Enviar e Registrar
              </Button>
            </DialogFooter>
          </>
        )}

        {modalState.type === 'call' && (
          <>
            <DialogHeader>
              <DialogTitle>Registrar Ligação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Ligação Atendida?
                </label>
                <Select value={callAnswered} onValueChange={setCallAnswered}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim, falei com o lead</SelectItem>
                    <SelectItem value="nao">
                      Não atendeu / Caixa postal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Observações
                </label>
                <Textarea
                  value={callObs}
                  onChange={(e) => setCallObs(e.target.value)}
                  className="h-20 resize-none"
                />
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <label className="text-sm font-bold text-gray-700">
                  Agendar próxima ação?
                </label>
                <Switch checked={callSched} onCheckedChange={setCallSched} />
              </div>
              {callSched && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      O que fazer?
                    </label>
                    <Input
                      value={callNext}
                      onChange={(e) => setCallNext(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Quando?
                    </label>
                    <Input
                      type="datetime-local"
                      value={callDate}
                      onChange={(e) => setCallDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleCall}
                disabled={callSched && (!callNext || !callDate)}
              >
                Salvar
              </Button>
            </DialogFooter>
          </>
        )}

        {modalState.type === 'email' && (
          <>
            <DialogHeader>
              <DialogTitle>Enviar E-mail</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Assunto
                </label>
                <Input
                  value={emailSubj}
                  onChange={(e) => setEmailSubj(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Mensagem
                </label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="h-32 resize-none"
                />
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <label className="text-sm font-bold text-gray-700">
                  Agendar próxima ação?
                </label>
                <Switch checked={emailSched} onCheckedChange={setEmailSched} />
              </div>
              {emailSched && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      O que fazer?
                    </label>
                    <Input
                      value={emailNext}
                      onChange={(e) => setEmailNext(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Quando?
                    </label>
                    <Input
                      type="datetime-local"
                      value={emailDate}
                      onChange={(e) => setEmailDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleEmail}
                disabled={
                  !emailSubj ||
                  !emailBody ||
                  (emailSched && (!emailNext || !emailDate))
                }
              >
                Enviar e Registrar
              </Button>
            </DialogFooter>
          </>
        )}

        {modalState.type === 'resolve' && (
          <>
            <DialogHeader>
              <DialogTitle>Resolver Ação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Observações da Resolução
                </label>
                <Textarea
                  value={resObs}
                  onChange={(e) => setResObs(e.target.value)}
                  className="h-20 resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Mover Pipeline
                </label>
                <Select value={resPipe} onValueChange={setResPipe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prospecção">Prospecção</SelectItem>
                    <SelectItem value="Contato realizado">
                      Contato realizado
                    </SelectItem>
                    <SelectItem value="Reunião agendada">
                      Reunião agendada
                    </SelectItem>
                    <SelectItem value="Proposta enviada">
                      Proposta enviada
                    </SelectItem>
                    <SelectItem value="Negociação">Negociação</SelectItem>
                    <SelectItem value="Fechado">Fechado</SelectItem>
                    <SelectItem value="Perdido">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <label className="text-sm font-bold text-gray-700">
                  Criar próxima ação?
                </label>
                <Switch checked={resSched} onCheckedChange={setResSched} />
              </div>
              {resSched && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Próximo Passo
                    </label>
                    <Input
                      value={resNext}
                      onChange={(e) => setResNext(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Data / Hora
                    </label>
                    <Input
                      type="datetime-local"
                      value={resDate}
                      onChange={(e) => setResDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleResolve}
                disabled={!resObs || (resSched && (!resNext || !resDate))}
              >
                Resolver Lead
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
