'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@nyvora/ui/components/ui/card';
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
import { Plus, TrendingUp, TrendingDown, Pencil, Trash2 } from 'lucide-react';
import {
  useFinanceCategories,
  useCreateFinanceCategory,
  useUpdateFinanceCategory,
  useDeleteFinanceCategory,
} from '@/lib/hooks';

export default function FinanceCategoriesPage() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState({ name: '', type: 'income' });

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editCategory, setEditCategory] = React.useState({ id: '', name: '', type: 'income' });

  const { data, isLoading } = useFinanceCategories();
  const createMutation = useCreateFinanceCategory();
  const updateMutation = useUpdateFinanceCategory();
  const deleteMutation = useDeleteFinanceCategory();

  const categories = data?.categories || data?.data || [];
  const incomeCategories = categories.filter((c: any) => c.type === 'income');
  const expenseCategories = categories.filter((c: any) => c.type === 'expense');

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  const handleCreate = async () => {
    if (!newCategory.name) return;
    try {
      await createMutation.mutateAsync(newCategory);
      setIsCreateOpen(false);
      setNewCategory({ name: '', type: 'income' });
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleEdit = async () => {
    if (!editCategory.name) return;
    try {
      await updateMutation.mutateAsync(editCategory);
      setIsEditOpen(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const openEdit = (cat: { id: string; name: string; type: string }) => {
    setEditCategory({ id: cat.id, name: cat.name, type: cat.type });
    setIsEditOpen(true);
  };

  const renderCategoryList = (cats: any[]) => (
    <div className="space-y-2">
      {cats.map((cat: any) => (
        <div key={cat.id} className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
          <span>{cat.name}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(cat)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(cat.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
      {cats.length === 0 && (
        <p className="text-sm text-muted-foreground">No hay categorías</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categorías Financieras</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Categoría</DialogTitle>
              <DialogDescription>Crea una nueva categoría financiera</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre de la categoría"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={newCategory.type}
                  onValueChange={(value) => setNewCategory(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Ingreso</SelectItem>
                    <SelectItem value="expense">Gasto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreate}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>Modifica la categoría financiera</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                placeholder="Nombre de la categoría"
                value={editCategory.name}
                onChange={(e) => setEditCategory(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={editCategory.type}
                onValueChange={(value) => setEditCategory(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Ingreso</SelectItem>
                  <SelectItem value="expense">Gasto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-600">Ingresos</CardTitle>
          </CardHeader>
          <CardContent>{renderCategoryList(incomeCategories)}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Gastos</CardTitle>
          </CardHeader>
          <CardContent>{renderCategoryList(expenseCategories)}</CardContent>
        </Card>
      </div>
    </div>
  );
}
