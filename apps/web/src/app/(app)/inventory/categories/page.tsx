'use client';

import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/lib/hooks';

export default function CategoriesPage() {
  const { data, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const categories = data?.data || data?.categories || [];

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categorías de productos</h2>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nueva categoría'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border p-4 space-y-3">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              if (name) {
                createMutation.mutate({ name }, { onSuccess: () => { setName(''); setShowForm(false); } });
              }
            }}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creando...' : 'Crear'}
          </button>
        </div>
      )}

      {editId && (
        <div className="rounded-lg border p-4 space-y-3">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              if (editName) {
                updateMutation.mutate({ id: editId, name: editName }, { onSuccess: () => { setEditId(null); setEditName(''); } });
              }
            }}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            onClick={() => { setEditId(null); setEditName(''); }}
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="p-3">Nombre</th>
              <th className="p-3">Productos</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3">{cat._count?.products || 0}</td>
                <td className="p-3 flex gap-2">
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                  >
                    Editar
                  </button>
                  <button
                    className="text-sm text-red-500 hover:text-red-700"
                    onClick={() => {
                      if (confirm(`¿Eliminar la categoría "${cat.name}"?`)) {
                        deleteMutation.mutate(cat.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay categorías</div>}
      </div>
    </div>
  );
}
