'use client';

import * as React from 'react';
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
import { useOrders, useCreateOrder, useUpdateOrder, useDeleteOrder, useContacts } from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';

export default function OrdersPage() {
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState('');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ contactId: '', notes: '' });

  const { data, isLoading } = useOrders({ page, limit: 10, status });
  const { data: contactsData } = useContacts({ limit: 100 });
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const deleteMutation = useDeleteOrder();
  const { toast } = useToast();

  const orders = data?.orders || data?.data || [];
  const contacts = contactsData?.contacts || contactsData?.data || [];
  const total = data?.total || 0;

  const handleCreate = async () => {
    if (!form.contactId) return;

    try {
      await createMutation.mutateAsync({
        contactId: form.contactId,
        notes: form.notes,
        items: [],
      });

      setIsCreateOpen(false);
      setForm({ contactId: '', notes: '' });
      toast({ title: 'Orden creada', description: 'La orden se ha creado correctamente.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo crear la orden.', variant: 'destructive' });
    }
  };

  const handleEdit = (o: any) => {
    setEditId(o.id);
    setForm({ contactId: o.contactId || o.contact?.id || '', notes: o.notes || '' });
  };

  const handleUpdate = async () => {
    if (!editId) return;

    try {
      await updateMutation.mutateAsync({
        id: editId,
        contactId: form.contactId,
        notes: form.notes,
      });

      setEditId(null);
      setForm({ contactId: '', notes: '' });
      toast({ title: 'Orden actualizada', description: 'La orden se ha actualizado correctamente.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo actualizar la orden.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);

      setDeleteId(null);
      toast({ title: 'Orden eliminada', description: 'La orden se ha eliminado correctamente.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar la orden.', variant: 'destructive' });
    }
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
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="confirmed">Confirmada</SelectItem>
              <SelectItem value="processing">Procesando</SelectItem>
              <SelectItem value="shipped">Enviada</SelectItem>
              <SelectItem value="delivered">Entregada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Orden
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Orden</DialogTitle>
              <DialogDescription>
                Crea una nueva orden de venta
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Contacto</Label>
                <Select
                  value={form.contactId}
                  onValueChange={(value) => setForm(prev => ({ ...prev, contactId: value }))}
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
                <Label htmlFor="notes">Notas</Label>
                <Input
                  id="notes"
                  placeholder="Notas adicionales..."
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
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
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 font-mono text-sm">{o.number}</td>
                    <td className="p-3">{o.contact?.firstName} {o.contact?.lastName}</td>
                    <td className="p-3">${Number(o.total || 0).toLocaleString()}</td>
                    <td className="p-3">
                      <Badge variant={
                        o.status === 'delivered' ? 'default' :
                        o.status === 'cancelled' ? 'destructive' :
                        'secondary'
                      }>
                        {o.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(o)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(o.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No hay órdenes
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total: {total} órdenes</span>
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
            disabled={orders.length < 10}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Orden</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.
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
            <DialogTitle>Editar Orden</DialogTitle>
            <DialogDescription>Actualiza la información de la orden</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Contacto</Label>
              <Select
                value={form.contactId}
                onValueChange={(value) => setForm(prev => ({ ...prev, contactId: value }))}
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
              <Label htmlFor="edit-notes">Notas</Label>
              <Input
                id="edit-notes"
                placeholder="Notas adicionales..."
                value={form.notes}
                onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
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
