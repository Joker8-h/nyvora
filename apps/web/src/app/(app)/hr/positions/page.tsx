'use client';

import { useState } from 'react';
import { usePositions, useCreatePosition, useUpdatePosition, useDeletePosition } from '@/lib/hooks';

export default function PositionsPage() {
  const { data, isLoading } = usePositions();
  const createMutation = useCreatePosition();
  const updateMutation = useUpdatePosition();
  const deleteMutation = useDeletePosition();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', department: '', salary: '' });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', name: '', department: '', salary: '' });

  const positions = data?.data || data?.positions || [];

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  const handleCreate = () => {
    if (form.name) {
      createMutation.mutate(form, {
        onSuccess: () => {
          setForm({ name: '', department: '', salary: '' });
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = () => {
    if (editForm.name) {
      updateMutation.mutate(editForm, {
        onSuccess: () => {
          setIsEditOpen(false);
          setEditForm({ id: '', name: '', department: '', salary: '' });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este cargo?')) {
      deleteMutation.mutate(id);
    }
  };

  const openEdit = (pos: any) => {
    setEditForm({
      id: pos.id,
      name: pos.name || '',
      department: pos.department || '',
      salary: pos.salary ?? '',
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cargos</h2>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nuevo cargo'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Nombre del cargo" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Departamento" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <input placeholder="Salario" type="number" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          </div>
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={handleCreate}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creando...' : 'Crear'}
          </button>
        </div>
      )}

      {isEditOpen && (
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium">Editar cargo</h3>
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Nombre del cargo" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <input placeholder="Departamento" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} />
            <input placeholder="Salario" type="number" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.salary} onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={handleEdit}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setIsEditOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="p-3">Nombre</th>
              <th className="p-3">Departamento</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p: any) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.department || '-'}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-sm text-destructive hover:text-destructive/80"
                      onClick={() => handleDelete(p.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {positions.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay cargos</div>}
      </div>
    </div>
  );
}
