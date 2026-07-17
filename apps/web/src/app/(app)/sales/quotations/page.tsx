'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nyvora/ui/components/ui/card';
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
import { Plus, FileText, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useQuotations, useCreateQuotation, useUpdateQuotation, useDeleteQuotation, useContacts } from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';

export default function QuotationsPage() {
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState('');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newQuotation, setNewQuotation] = React.useState({
    contactId: '',
    notes: '',
    validUntil: '',
  });
  const [editingQuotation, setEditingQuotation] = React.useState<any>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editQuotation, setEditQuotation] = React.useState({
    contactId: '',
    notes: '',
    validUntil: '',
    status: '',
  });

  const { data, isLoading } = useQuotations({ page, limit: 10, status });
  const { data: contactsData } = useContacts({ limit: 100 });
  const createMutation = useCreateQuotation();
  const updateMutation = useUpdateQuotation();
  const deleteMutation = useDeleteQuotation();
  const { toast } = useToast();

  const quotations = data?.quotations || data?.data || [];
  const contacts = contactsData?.contacts || contactsData?.data || [];
  const total = data?.total || 0;

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const handleCreate = async () => {
    if (!newQuotation.contactId) return;

    try {
      await createMutation.mutateAsync({
        contactId: newQuotation.contactId,
        notes: newQuotation.notes,
        validUntil: newQuotation.validUntil || undefined,
        items: [],
      });

      setIsCreateOpen(false);
      setNewQuotation({ contactId: '', notes: '', validUntil: '' });
      toast({ title: 'Cotización creada', description: 'La cotización se ha creado correctamente.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo crear la cotización.', variant: 'destructive' });
    }
  };

  const handleUpdate = async () => {
    if (!editingQuotation) return;

    try {
      await updateMutation.mutateAsync({
        id: editingQuotation.id,
        contactId: editQuotation.contactId,
        notes: editQuotation.notes,
        validUntil: editQuotation.validUntil || undefined,
        status: editQuotation.status,
      });

      setIsEditOpen(false);
      setEditingQuotation(null);
      toast({ title: 'Cotización actualizada', description: 'La cotización se ha actualizado correctamente.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo actualizar la cotización.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Cotización eliminada', description: 'La cotización se ha eliminado correctamente.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar la cotización.', variant: 'destructive' });
    }
  };

  const openEdit = (quotation: any) => {
    setEditingQuotation(quotation);
    setEditQuotation({
      contactId: quotation.contactId || '',
      notes: quotation.notes || '',
      validUntil: quotation.validUntil ? quotation.validUntil.split('T')[0] : '',
      status: quotation.status || '',
    });
    setIsEditOpen(true);
  };

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
              <SelectItem value="approved">Aprobada</SelectItem>
              <SelectItem value="rejected">Rechazada</SelectItem>
              <SelectItem value="expired">Expirada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cotización
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Cotización</DialogTitle>
              <DialogDescription>
                Crea una nueva cotización para un cliente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Contacto</Label>
                <Select
                  value={newQuotation.contactId}
                  onValueChange={(value) => setNewQuotation(prev => ({ ...prev, contactId: value }))}
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
                <Label htmlFor="validUntil">Válida hasta</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={newQuotation.validUntil}
                  onChange={(e) => setNewQuotation(prev => ({ ...prev, validUntil: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Input
                  id="notes"
                  placeholder="Notas adicionales..."
                  value={newQuotation.notes}
                  onChange={(e) => setNewQuotation(prev => ({ ...prev, notes: e.target.value }))}
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
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cotización</DialogTitle>
              <DialogDescription>
                Actualiza la información de la cotización
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Contacto</Label>
                <Select
                  value={editQuotation.contactId}
                  onValueChange={(value) => setEditQuotation(prev => ({ ...prev, contactId: value }))}
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
                <Label>Estado</Label>
                <Select
                  value={editQuotation.status}
                  onValueChange={(value) => setEditQuotation(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="sent">Enviada</SelectItem>
                    <SelectItem value="approved">Aprobada</SelectItem>
                    <SelectItem value="rejected">Rechazada</SelectItem>
                    <SelectItem value="expired">Expirada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editValidUntil">Válida hasta</Label>
                <Input
                  id="editValidUntil"
                  type="date"
                  value={editQuotation.validUntil}
                  onChange={(e) => setEditQuotation(prev => ({ ...prev, validUntil: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNotes">Notas</Label>
                <Input
                  id="editNotes"
                  placeholder="Notas adicionales..."
                  value={editQuotation.notes}
                  onChange={(e) => setEditQuotation(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Actualizando...' : 'Actualizar'}
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
                {quotations.map((q: any) => (
                  <tr key={q.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 font-mono text-sm">{q.number}</td>
                    <td className="p-3">{q.contact?.firstName} {q.contact?.lastName}</td>
                    <td className="p-3">${Number(q.total || 0).toLocaleString()}</td>
                    <td className="p-3">
                      <Badge variant={
                        q.status === 'approved' ? 'default' :
                        q.status === 'rejected' ? 'destructive' :
                        'secondary'
                      }>
                        {q.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(q)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(q.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {quotations.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                <FileText className="h-10 w-10 mb-2 opacity-50" />
                <p className="text-lg font-medium">No hay cotizaciones</p>
                <p className="text-sm">Crea una nueva cotización para comenzar.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total: {total} cotizaciones</span>
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
            disabled={quotations.length < 10}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
