import { useState } from 'react'
import useMainStore from '@/stores/main'
import { getActionColor } from '@/lib/crm-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Building2, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

export default function Accounts() {
  const { accounts, addAccount } = useMainStore()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')

  const filtered = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    addAccount({ name, website, status: 'Novo', priority: 'B' })
    setIsOpen(false)
    setName('')
    setWebsite('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contas e Leads</h1>
          <p className="text-muted-foreground">
            Gerencie sua base de empresas prospectadas
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 shadow-lg">
              <Plus className="w-4 h-4 mr-2" /> Criar Conta Rápida
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Conta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nome da Empresa <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex: Logística Alfa"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="exemplo.com.br"
                />
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Salvar Conta
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm overflow-hidden">
        <div className="mb-6 relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            className="pl-9 bg-gray-50 border-gray-200 rounded-xl focus-visible:ring-1"
            placeholder="Buscar contas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">
                  Empresa
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Website
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Prioridade
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">
                  Próxima Ação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhuma conta encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((acc) => (
                  <TableRow
                    key={acc.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="font-medium flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-gray-500" />
                      </div>
                      {acc.name}
                    </TableCell>
                    <TableCell>
                      {acc.website && (
                        <span className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                          <ExternalLink className="w-3 h-3" /> {acc.website}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-white">
                        {acc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          acc.priority === 'A'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200 border-0'
                            : 'bg-gray-100 text-gray-800 border-0 hover:bg-gray-200'
                        }
                      >
                        {acc.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={getActionColor(acc.nextActionDate)}
                      >
                        {acc.nextActionDate
                          ? new Date(acc.nextActionDate).toLocaleDateString()
                          : 'Sem ação'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
