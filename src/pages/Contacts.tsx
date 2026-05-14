import { useState } from 'react'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
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
} from '@/components/ui/dialog'
import { Plus, Pencil } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Contact } from '@/types/crm'
import { ContactForm } from '@/components/contacts/ContactForm'

export default function Contacts() {
  const { contacts, accounts, addContact, updateContact } =
    useMainStore() as any
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [editContact, setEditContact] = useState<Contact | null>(null)

  const accountsWithoutContacts = accounts.filter(
    (acc: any) => !contacts.some((c: any) => c.accountId === acc.id),
  )

  const allList = [
    ...contacts,
    ...accountsWithoutContacts.map((acc: any) => ({
      id: `acc-no-contact-${acc.id}`,
      accountId: acc.id,
      name: 'Sem contato',
      role: '-',
      processRole: '-',
      email: acc.email,
      whatsapp: acc.phone,
      isDecisionMaker: false,
      isPseudoContact: true,
    })),
  ]

  const handleUpdate = async (payload: any) => {
    if (!editContact) return

    const { error } = await supabase
      .from('contacts')
      .update(payload)
      .eq('id', editContact.id)

    if (error) {
      toast({ title: 'Erro ao atualizar contato', variant: 'destructive' })
      return
    }

    toast({ title: 'Contato atualizado com sucesso!' })
    setEditContact(null)

    if (updateContact) {
      updateContact(editContact.id, payload)
    } else {
      setTimeout(() => window.location.reload(), 500)
    }
  }

  const handleCreate = async (payload: any) => {
    await addContact(payload)
    setIsOpen(false)
    toast({ title: 'Contato adicionado com sucesso!' })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black">Contatos</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Pessoas e decisores vinculados às contas
          </p>
        </div>

        <Dialog
          open={!!editContact}
          onOpenChange={(open) => !open && setEditContact(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Contato</DialogTitle>
            </DialogHeader>
            {editContact && (
              <ContactForm
                initialData={editContact}
                accounts={accounts}
                onSubmit={handleUpdate}
                submitLabel="Salvar Alterações"
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 text-white rounded font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20">
              <Plus className="w-4 h-4 mr-2" /> Novo Contato
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Contato</DialogTitle>
            </DialogHeader>
            <ContactForm
              accounts={accounts}
              onSubmit={handleCreate}
              submitLabel="Salvar Contato"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-bold text-black">
                Nome / Cargo
              </TableHead>
              <TableHead className="font-bold text-black">Conta</TableHead>
              <TableHead className="font-bold text-black">Papel</TableHead>
              <TableHead className="font-bold text-black">Contato</TableHead>
              <TableHead className="font-bold text-black w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allList.map((c: any) => {
              const acc = accounts.find((a: any) => a.id === c.accountId)
              return (
                <TableRow key={c.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="font-bold text-black">{c.name}</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      {c.role || '-'}
                    </div>
                  </TableCell>
                  <TableCell
                    className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/leads/${c.accountId}`)}
                  >
                    {acc?.companyName || acc?.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${c.isDecisionMaker ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {c.processRole}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-gray-600 space-y-1">
                      {c.email && <div>{c.email}</div>}
                      {c.whatsapp && <div>{c.whatsapp}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {!c.isPseudoContact && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditContact(c)}
                        className="h-8 w-8 text-gray-500 hover:text-black hover:bg-gray-100"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
            {allList.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  Nenhum contato cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
