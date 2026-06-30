import { useState } from 'react'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  MapPin,
  Phone,
  Building2,
  Mail,
  Users,
} from 'lucide-react'
import { NewLeadDialog } from '@/components/leads/NewLeadDialog'
import { Card, CardContent } from '@/components/ui/card'
import { exportLeadsToExcel } from '@/lib/export-utils'

export default function Accounts() {
  const { accounts } = useMainStore()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')

  const filtered = accounts.filter(
    (a) =>
      a.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.contactName?.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.includes(search),
  )

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Contas & Leads
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Gerencie sua base de clientes e prospects
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => exportLeadsToExcel(filtered)}
            variant="outline"
            className="h-10 border-slate-200 text-green-600 hover:text-green-700 hover:bg-green-50 font-bold"
          >
            Exportar Leads Excel
          </Button>
          <NewLeadDialog>
            <Button className="bg-[#FF6A00] text-white hover:bg-[#e65c00] rounded-[8px] font-bold h-10 shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Novo Lead
            </Button>
          </NewLeadDialog>
        </div>
      </div>

      <Card className="rounded-[10px] border border-slate-100 shadow-sm bg-white flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 shrink-0">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por empresa, contato ou telefone..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </div>
        <CardContent className="p-0 overflow-y-auto flex-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center h-full">
              <Users className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-500 font-medium">
                Nenhum lead encontrado.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => navigate(`/leads/${acc.id}`)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm shrink-0">
                      {(acc.companyName || acc.name || 'E')
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {acc.companyName || acc.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Building2 className="w-3 h-3" />{' '}
                          {acc.segment || 'Não informado'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{' '}
                          {acc.city || 'Não informado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 md:gap-8 bg-white p-3 md:p-0 rounded-lg border md:border-none border-slate-100">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Contato
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {acc.contactName || 'Não informado'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Telefone
                      </span>
                      <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />{' '}
                        {acc.phone || 'Não informado'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        E-mail
                      </span>
                      <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />{' '}
                        {acc.email || 'Não informado'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Estágio
                      </span>
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                        {acc.pipelineStage || acc.status || 'Prospecção'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
