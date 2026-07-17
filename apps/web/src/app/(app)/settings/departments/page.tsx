'use client';

import { useState } from 'react';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '@/lib/hooks';

export default function DepartmentsPage() {
  const { data, isLoading } = useDepartments();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [name, setName] = useState('');
  const departments = Array.isArray(data) ? data : (data?.data || data?.departments || []);

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Departamentos</h2>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nuevo departamento'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border p-4 space-y-3">
          <input
            type="text"
            placeholder="Nombre del departamento"
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

      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-background p-6 shadow-lg w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Editar departamento</h3>
            <input
              type="text"
              placeholder="Nombre del departamento"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                onClick={() => { setEditingDept(null); setEditName(''); }}
              >
                Cancelar
              </button>
              <button
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  if (editName) {
                    updateMutation.mutate(
                      { id: editingDept.id, name: editName },
                      { onSuccess: () => { setEditingDept(null); setEditName(''); } }
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
              <th className="p-3">Empleados</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept: any) => (
              <tr key={dept.id} className="border-b last:border-0">
                <td className="p-3">{dept.name}</td>
                <td className="p-3">{dept._count?.employees || 0}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      className="text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => { setEditingDept(dept); setEditName(dept.name); }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-sm text-red-600 hover:text-red-800"
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
                          deleteMutation.mutate(dept.id);
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
        {departments.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No hay departamentos</div>
        )}
      </div>
    </div>
  );
}
