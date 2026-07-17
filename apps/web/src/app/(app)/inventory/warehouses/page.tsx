'use client';

import { useState } from 'react';
import { Button } from '@nyvora/ui/components/ui/button';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@nyvora/ui/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useWarehouses, useCreateWarehouse, useUpdateWarehouse, useDeleteWarehouse } from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';

export default function WarehousesPage() {
  const { data, isLoading } = useWarehouses();
  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();
  const deleteMutation = useDeleteWarehouse();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', address: '', city: '' });

  const warehouses = data?.data || data?.warehouses || [];

  const resetForm = () => setForm({ name: '', address: '', city: '' });

  const openEdit = (w: any) => {
    setForm({ name: w.name, address: w.address || '', city: w.city || '' });
    setEditId(w.id);
  };

  const handleCreate = () => {
    if (!form.name) return;
    createMutation.mutate(form, {
      onSuccess: () => {
        resetForm();
        setShowForm(false);
        toast({ title: 'Almacén creado', description: 'El almacén se ha creado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo crear el almacén.', variant: 'destructive' });
      },
    });
  };

  const handleUpdate = () => {
    if (!form.name || !editId) return;
    updateMutation.mutate({ id: editId, ...form }, {
      onSuccess: () => {
        resetForm();
        setEditId(null);
        toast({ title: 'Almacén actualizado', description: 'El almacén se ha actualizado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo actualizar el almacén.', variant: 'destructive' });
      },
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        toast({ title: 'Almacén eliminado', description: 'El almacén se ha eliminado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo eliminar el almacén.', variant: 'destructive' });
      },
    });
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Almacenes</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo almacén
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="p-3">Nombre</th>
              <th className="p-3">Dirección</th>
              <th className="p-3">Ciudad</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w: any) => (
              <tr key={w.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="p-3 font-medium">{w.name}</td>
                <td className="p-3">{w.address || '-'}</td>
                <td className="p-3">{w.city || '-'}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(w)}>Editar</Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(w.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {warehouses.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay almacenes</div>}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Almacén</DialogTitle>
            <DialogDescription>Agrega un nuevo almacén al inventario</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input placeholder="Dirección" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input placeholder="Ciudad" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setShowForm(false); }}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creando...' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editId} onOpenChange={() => { resetForm(); setEditId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Almacén</DialogTitle>
            <DialogDescription>Modifica los datos del almacén</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input placeholder="Dirección" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input placeholder="Ciudad" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setEditId(null); }}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Almacén</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este almacén? Esta acción no se puede deshacer.
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
    </div>
  );
}
