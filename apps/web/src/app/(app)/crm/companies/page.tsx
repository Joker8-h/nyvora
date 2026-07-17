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
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { useCompanies, useCreateCompany, useDeleteCompany, useUpdateCompany, useImportCompanies } from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';
import { ExcelImportDialog } from '@/components/excel-import-dialog';

export default function CompaniesPage() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState<any>(null);
  const [form, setForm] = useState({ name: '', industry: '', website: '', phone: '', address: '' });

  const { data, isLoading } = useCompanies({ page, limit: 10 });
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  const importMutation = useImportCompanies();
  const deleteMutation = useDeleteCompany();
  const { toast } = useToast();

  const companies = data?.companies || data?.data || [];
  const total = data?.total || 0;

  const handleCreate = () => {
    createMutation.mutate(form, {
      onSuccess: () => {
        setForm({ name: '', industry: '', website: '', phone: '', address: '' });
        setShowForm(false);
        toast({ title: 'Empresa creada', description: 'La empresa se ha creado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo crear la empresa.', variant: 'destructive' });
      },
    });
  };

  const handleEdit = (company: any) => {
    setEditCompany(company);
    setForm({
      name: company.name || '',
      industry: company.industry || '',
      website: company.website || '',
      phone: company.phone || '',
      address: company.address || '',
    });
  };

  const handleUpdate = () => {
    if (!editCompany) return;
    updateMutation.mutate({ id: editCompany.id, ...form }, {
      onSuccess: () => {
        setEditCompany(null);
        setForm({ name: '', industry: '', website: '', phone: '', address: '' });
        toast({ title: 'Empresa actualizada', description: 'La empresa se ha actualizado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo actualizar la empresa.', variant: 'destructive' });
      },
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        toast({ title: 'Empresa eliminada', description: 'La empresa se ha eliminado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo eliminar la empresa.', variant: 'destructive' });
      },
    });
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => setShowImport(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Importar Excel
        </Button>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Empresa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Empresa</DialogTitle>
              <DialogDescription>Agrega una nueva empresa a tu CRM</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2 col-span-2">
                  <Label>Nombre</Label>
                  <Input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Industria</Label>
                  <Input placeholder="Industria" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Sitio web</Label>
                  <Input placeholder="Sitio web" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Dirección</Label>
                  <Input placeholder="Dirección" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
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
                <th className="p-3">Industria</th>
                <th className="p-3">Sitio web</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c: any) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">{c.industry || '-'}</td>
                  <td className="p-3">{c.website || '-'}</td>
                  <td className="p-3">{c.phone || '-'}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
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
          {companies.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No hay empresas</div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total: {total} empresas</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Anterior
          </Button>
          <span>Página {page}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={companies.length < 10}>
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={!!editCompany} onOpenChange={() => setEditCompany(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>Modifica los datos de la empresa</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 col-span-2">
                <Label>Nombre</Label>
                <Input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Industria</Label>
                <Input placeholder="Industria" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Sitio web</Label>
                <Input placeholder="Sitio web" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input placeholder="Dirección" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCompany(null)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Empresa</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.
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

      <ExcelImportDialog
        open={showImport}
        onOpenChange={setShowImport}
        title="Importar empresas desde Excel"
        description="Sube un archivo .xlsx. Las columnas Nombre, Industria, Sitio Web, NIT y Notas serán mapeadas automáticamente."
        columns={[
          { field: 'name', label: 'Nombre' },
          { field: 'industry', label: 'Industria' },
          { field: 'website', label: 'Sitio Web' },
          { field: 'taxId', label: 'NIT' },
          { field: 'notes', label: 'Notas' },
        ]}
        mutation={importMutation}
      />
    </div>
  );
}
