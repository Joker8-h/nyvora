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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nyvora/ui/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useCategories } from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', sku: '', unitPrice: '', categoryId: '', description: '' });
  const [form, setForm] = useState({ name: '', sku: '', unitPrice: '', categoryId: '', description: '' });

  const { data, isLoading } = useProducts({ page, limit: 10, search });
  const { data: categories } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const { toast } = useToast();

  const products = data?.products || data?.data || [];
  const total = data?.total || 0;
  const categoryList = categories?.data || categories?.categories || [];

  const handleCreate = () => {
    createMutation.mutate(form, {
      onSuccess: () => {
        setForm({ name: '', sku: '', unitPrice: '', categoryId: '', description: '' });
        setShowForm(false);
        toast({ title: 'Producto creado', description: 'El producto se ha creado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo crear el producto.', variant: 'destructive' });
      },
    });
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setEditForm({
      name: p.name || '',
      sku: p.sku || '',
      unitPrice: String(p.unitPrice || ''),
      categoryId: p.categoryId || p.category?.id || '',
      description: p.description || '',
    });
  };

  const handleEdit = () => {
    if (!editId) return;
    updateMutation.mutate(
      { id: editId, ...editForm },
      {
        onSuccess: () => {
          setEditId(null);
          toast({ title: 'Producto actualizado', description: 'El producto se ha actualizado correctamente.' });
        },
        onError: () => {
          toast({ title: 'Error', description: 'No se pudo actualizar el producto.', variant: 'destructive' });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        toast({ title: 'Producto eliminado', description: 'El producto se ha eliminado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo eliminar el producto.', variant: 'destructive' });
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
          placeholder="Buscar productos..."
          className="w-64"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Producto</DialogTitle>
              <DialogDescription>Agrega un nuevo producto al inventario</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2 col-span-2">
                  <Label>Nombre</Label>
                  <Input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Precio unitario</Label>
                  <Input placeholder="Precio" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Categoría</Label>
                  <Select value={form.categoryId} onValueChange={(value) => setForm({ ...form, categoryId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sin categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryList.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Descripción</Label>
                  <Input placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
                <th className="p-3">SKU</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 font-mono text-sm">{p.sku}</td>
                  <td className="p-3">${p.unitPrice?.toLocaleString() || '0'}</td>
                  <td className="p-3">{p.category?.name || '-'}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No hay productos</div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total: {total} productos</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Anterior
          </Button>
          <span>Página {page}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={products.length < 10}>
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Producto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleteMutation.isPending}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editId} onOpenChange={() => setEditId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>Modifica los datos del producto</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 col-span-2">
                <Label>Nombre</Label>
                <Input placeholder="Nombre" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input placeholder="SKU" value={editForm.sku} onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Precio unitario</Label>
                <Input placeholder="Precio" type="number" value={editForm.unitPrice} onChange={(e) => setEditForm({ ...editForm, unitPrice: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Categoría</Label>
                <Select value={editForm.categoryId} onValueChange={(value) => setEditForm({ ...editForm, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sin categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryList.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Descripción</Label>
                <Input placeholder="Descripción" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditId(null)} disabled={updateMutation.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
