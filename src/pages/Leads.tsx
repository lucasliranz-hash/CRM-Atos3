import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Search, Filter } from 'lucide-react'
import { useLeads, LeadStatus } from '@/contexts/LeadsContext'

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  company: z.string().min(2, 'Nome da empresa é obrigatório'),
  contact: z.string().min(2, 'Nome do contato é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(8, 'Telefone inválido'),
  fleetSize: z.coerce.number().min(1, 'Tamanho da frota é obrigatório'),
  vehicleType: z.enum(['Bus', 'Truck', 'Mixed Fleet'], {
    required_error: 'Selecione o tipo de veículo',
  }),
  status: z
    .enum([
      'Prospect',
      'Contacted',
      'Proposal Sent',
      'Closed Won',
      'Closed Lost',
    ])
    .default('Prospect'),
})

export default function Leads() {
  const { leads, addLead } = useLeads()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('todos')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: '',
      contact: '',
      email: '',
      phone: '',
      fleetSize: 0,
      vehicleType: undefined,
      status: 'Prospect',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    addLead(values)
    setIsOpen(false)
    form.reset()
  }

  const filteredLeads = leads.filter((lead) => {
    const statusMatch = filterStatus === 'todos' || lead.status === filterStatus
    const searchMatch = lead.company
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    return statusMatch && searchMatch
  })

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'Closed Won':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'Closed Lost':
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      case 'Prospect':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'Contacted':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'Proposal Sent':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestão de Leads de Frota
          </h1>
          <p className="text-muted-foreground">
            Gerencie potenciais clientes e operadoras logísticas
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 shadow-lg">
              <Plus className="w-4 h-4 mr-2" /> Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glass-card border-white/60">
            <DialogHeader>
              <DialogTitle>Novo Lead - Transporte</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Viação Brasil"
                          {...field}
                          className="bg-white/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pessoa de Contato</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome completo"
                            {...field}
                            className="bg-white/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(00) 00000-0000"
                            {...field}
                            className="bg-white/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="contato@empresa.com"
                          {...field}
                          className="bg-white/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Veículo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/50">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Bus">Bus</SelectItem>
                            <SelectItem value="Truck">Truck</SelectItem>
                            <SelectItem value="Mixed Fleet">
                              Mixed Fleet
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fleetSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamanho da Frota</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Qtd. veículos"
                            {...field}
                            className="bg-white/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status do Lead</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/50">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Prospect">Prospect</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Proposal Sent">
                            Proposal Sent
                          </SelectItem>
                          <SelectItem value="Closed Won">Closed Won</SelectItem>
                          <SelectItem value="Closed Lost">
                            Closed Lost
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
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
                    Salvar Lead
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card rounded-[24px] p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome da empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white/50 border-gray-200 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px] bg-white/50 rounded-xl border-gray-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5" />
                  <SelectValue placeholder="Filtrar por Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="Prospect">Prospect</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                <SelectItem value="Closed Won">Closed Won</SelectItem>
                <SelectItem value="Closed Lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-100 bg-white/50">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">
                  Empresa
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Contato
                </TableHead>
                <TableHead className="font-semibold text-gray-700 hidden sm:table-cell">
                  Tipo de Veículo
                </TableHead>
                <TableHead className="font-semibold text-gray-700 hidden lg:table-cell">
                  Tamanho da Frota
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum lead encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="hover:bg-white/40 transition-colors border-b border-gray-100/50"
                  >
                    <TableCell className="font-medium text-gray-900">
                      {lead.company}
                    </TableCell>
                    <TableCell>{lead.contact}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="bg-white font-medium">
                        {lead.vehicleType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 hidden lg:table-cell font-medium">
                      {lead.fleetSize} veículos
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'border-0 shadow-none font-semibold transition-colors',
                          getStatusColor(lead.status),
                        )}
                      >
                        {lead.status}
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
