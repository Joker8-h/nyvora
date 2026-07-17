'use client';

import { useState } from 'react';
import { Card, CardContent } from '@nyvora/ui/components/ui/card';
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
  DialogTrigger,
} from '@nyvora/ui/components/ui/dialog';
import { Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { useContacts, useCreateContact, useDeleteContact, useUpdateContact, useImportContacts } from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';
import { ExcelImportDialog } from '@/components/excel-import-dialog';

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', position: '' });

  const { data, isLoading } = useContacts({ page, limit: 10, search });
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const deleteMutation = useDeleteContact();
  const importMutation = useImportContacts();
  const { toast } = useToast();

  const contacts = data?.contacts || data?.data || [];
  const total = data?.total || 0;

  const handleCreate = () => {
    createMutation.mutate(form, {
      onSuccess: () => {
        setForm({ firstName: '', lastName: '', email: '', phone: '', position: '' });
        setShowForm(false);
        toast({ title: 'Contacto creado', description: 'El contacto se ha creado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo crear el contacto.', variant: 'destructive' });
      },
    });
  };

  const handleEdit = (c: any) => {
    setEditId(c.id);
    setForm({ firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone || '', position: c.position || '' });
  };

  const handleUpdate = () => {
    if (!editId) return;
    updateMutation.mutate({ id: editId, ...form }, {
      onSuccess: () => {
        setEditId(null);
        setForm({ firstName: '', lastName: '', email: '', phone: '', position: '' });
        toast({ title: 'Contacto actualizado', description: 'El contacto se ha actualizado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo actualizar el contacto.', variant: 'destructive' });
      },
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        toast({ title: 'Contacto eliminado', description: 'El contacto se ha eliminado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo eliminar el contacto.', variant: 'destructive' });
      },
    });
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          type="search"
          placeholder="Buscar contactos..."
          className="w-64"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <Button variant="outline" onClick={() => setShowImport(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Importar Excel
        </Button>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Contacto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Contacto</DialogTitle>
              <DialogDescription>Agrega un nuevo contacto a tu CRM</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input placeholder="Nombre" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Apellido</Label>
                  <Input placeholder="Apellido" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Cargo</Label>
                  <Input placeholder="Cargo" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creando...' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3">Nombre</th>
                <th className="p-3">Email</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Cargo</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c: any) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">{c.firstName} {c.lastName}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone || '-'}</td>
                  <td className="p-3">{c.position || '-'}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(c.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contacts.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No hay contactos</div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total: {total} contactos</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Anterior
          </Button>
          <span>Página {page}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={contacts.length < 10}>
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Contacto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer.
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
            <DialogTitle>Editar Contacto</DialogTitle>
            <DialogDescription>Actualiza la información del contacto</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input placeholder="Nombre" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Apellido</Label>
                <Input placeholder="Apellido" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Cargo</Label>
                <Input placeholder="Cargo" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              </div>
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

      <ExcelImportDialog
        open={showImport}
        onOpenChange={setShowImport}
        title="Importar contactos desde Excel"
        description="Sube un archivo .xlsx. Las columnas Nombre, Apellido, Email, Teléfono y Empresa serán mapeadas automáticamente."
        columns={[
          { field: 'firstName', label: 'Nombre' },
          { field: 'lastName', label: 'Apellido' },
          { field: 'email', label: 'Email' },
          { field: 'phone', label: 'Teléfono' },
          { field: 'companyName', label: 'Empresa' },
        ]}
        mutation={importMutation}
        onSuccess={() => {
          (data as any)?.contacts !== undefined && setPage(1);
        }}
      />
    </div>
  );
}
