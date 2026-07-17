'use client';

import { useState } from 'react';
import { useBranches, useCreateBranch, useUpdateBranch, useDeleteBranch } from '@/lib/hooks';

export default function BranchesPage() {
  const { data, isLoading } = useBranches();
  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();
  const deleteMutation = useDeleteBranch();
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [name, setName] = useState('');
  const branches = Array.isArray(data) ? data : (data?.data || data?.branches || []);

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sucursales</h2>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nueva sucursal'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border p-4 space-y-3">
          <input
            type="text"
            placeholder="Nombre de la sucursal"
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

      {editingBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-background p-6 shadow-lg w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Editar sucursal</h3>
            <input
              type="text"
              placeholder="Nombre de la sucursal"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                onClick={() => { setEditingBranch(null); setEditName(''); }}
              >
                Cancelar
              </button>
              <button
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  if (editName) {
                    updateMutation.mutate(
                      { id: editingBranch.id, name: editName },
                      { onSuccess: () => { setEditingBranch(null); setEditName(''); } }
                    );
                  }
                }}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="p-3">Nombre</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch: any) => (
              <tr key={branch.id} className="border-b last:border-0">
                <td className="p-3">{branch.name}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    branch.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {branch.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      className="text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => { setEditingBranch(branch); setEditName(branch.name); }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-sm text-red-600 hover:text-red-800"
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) {
                          deleteMutation.mutate(branch.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {branches.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No hay sucursales</div>
        )}
      </div>
    </div>
  );
}
