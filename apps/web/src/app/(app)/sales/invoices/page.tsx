'use client';

import { useState } from 'react';
import { Card, CardContent } from '@nyvora/ui/components/ui/card';
import { Button } from '@nyvora/ui/components/ui/button';
import { Badge } from '@nyvora/ui/components/ui/badge';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@nyvora/ui/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nyvora/ui/components/ui/select';
import { Plus, FileText, Pencil, Trash2 } from 'lucide-react';
import { useInvoices, useCreateInvoice, useUpdateInvoice, useDeleteInvoice, useContacts } from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';

export default function InvoicesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newInvoice, setNewInvoice] = useState({ contactId: '', dueDate: '', notes: '' });
  const [editForm, setEditForm] = useState({ contactId: '', dueDate: '', notes: '' });

  const { data, isLoading } = useInvoices({ page, limit: 10, status });
  const { data: contactsData } = useContacts({ limit: 100 });
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();
  const deleteMutation = useDeleteInvoice();
  const { toast } = useToast();

  const invoices = data?.invoices || data?.data || [];
  const contacts = contactsData?.contacts || contactsData?.data || [];
  const total = data?.total || 0;

  const handleCreate = async () => {
    if (!newInvoice.contactId) return;

    try {
      await createMutation.mutateAsync({
        contactId: newInvoice.contactId,
        dueDate: newInvoice.dueDate || undefined,
        notes: newInvoice.notes,
        items: [],
      });

      setIsCreateOpen(false);
      setNewInvoice({ contactId: '', dueDate: '', notes: '' });
      toast({ title: 'Factura creada', description: 'La factura se ha creado correctamente.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo crear la factura.', variant: 'destructive' });
    }
  };

  const handleEdit = (inv: any) => {
    setEditId(inv.id);
    setEditForm({
      contactId: inv.contactId || '',
      dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString().split('T')[0] : '',
      notes: inv.notes || '',
    });
  };

  const handleUpdate = () => {
    if (!editId) return;
    updateMutation.mutate(
      { id: editId, ...editForm },
      {
        onSuccess: () => {
          setEditId(null);
          toast({ title: 'Factura actualizada', description: 'La factura se ha actualizado correctamente.' });
        },
        onError: () => {
          toast({ title: 'Error', description: 'No se pudo actualizar la factura.', variant: 'destructive' });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        toast({ title: 'Factura eliminada', description: 'La factura se ha eliminado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo eliminar la factura.', variant: 'destructive' });
      },
    });
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los estados</SelectItem>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="sent">Enviada</SelectItem>
              <SelectItem value="paid">Pagada</SelectItem>
              <SelectItem value="overdue">Vencida</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Factura
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Factura</DialogTitle>
              <DialogDescription>
                Crea una nueva factura para un cliente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Contacto</Label>
                <Select
                  value={newInvoice.contactId}
                  onValueChange={(value) => setNewInvoice(prev => ({ ...prev, contactId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar contacto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact: any) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.firstName} {contact.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha de vencimiento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Input
                  id="notes"
                  placeholder="Notas adicionales..."
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creando...' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3">Número</th>
                  <th className="p-3">Contacto</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Vencimiento</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 font-mono text-sm">{inv.number}</td>
                    <td className="p-3">{inv.contact?.firstName} {inv.contact?.lastName}</td>
                    <td className="p-3">${Number(inv.total || 0).toLocaleString()}</td>
                    <td className="p-3">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="p-3">
                      <Badge variant={
                        inv.status === 'paid' ? 'default' :
                        inv.status === 'overdue' ? 'destructive' :
                        'secondary'
                      }>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(inv)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(inv.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {invoices.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <FileText className="mb-2 h-8 w-8" />
                <p>No hay facturas</p>
                <p className="text-sm">Crea una nueva factura para comenzar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total: {total} facturas</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span>Página {page}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={invoices.length < 10}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Factura</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta factura? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editId} onOpenChange={() => setEditId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Factura</DialogTitle>
            <DialogDescription>Actualiza la información de la factura</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Contacto</Label>
              <Select
                value={editForm.contactId}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, contactId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contacto..." />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact: any) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDueDate">Fecha de vencimiento</Label>
              <Input
                id="editDueDate"
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNotes">Notas</Label>
              <Input
                id="editNotes"
                placeholder="Notas adicionales..."
                value={editForm.notes}
                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditId(null)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
