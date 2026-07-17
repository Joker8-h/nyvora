'use client';

import { useState } from 'react';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee, useDepartments, useImportEmployees } from '@/lib/hooks';
import { ExcelImportDialog } from '@/components/excel-import-dialog';

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useEmployees({ page, limit: 10 });
  const { data: departments } = useDepartments();
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();
  const importMutation = useImportEmployees();

  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', departmentId: '', hireDate: '' });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', firstName: '', lastName: '', email: '', departmentId: '', hireDate: '' });

  const employees = data?.data || data?.employees || [];
  const total = data?.total || 0;
  const limit = data?.limit || 10;
  const deptList = departments?.data || departments?.departments || departments || [];

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  const handleCreate = () => {
    if (form.firstName && form.email) {
      createMutation.mutate(form, {
        onSuccess: () => {
          setForm({ firstName: '', lastName: '', email: '', departmentId: '', hireDate: '' });
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = () => {
    if (editForm.firstName && editForm.email) {
      updateMutation.mutate(editForm, {
        onSuccess: () => {
          setIsEditOpen(false);
          setEditForm({ id: '', firstName: '', lastName: '', email: '', departmentId: '', hireDate: '' });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      deleteMutation.mutate(id);
    }
  };

  const openEdit = (emp: any) => {
    setEditForm({
      id: emp.id,
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      departmentId: emp.departmentId || '',
      hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : '',
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Empleados</h2>
        <div className="flex gap-2">
          <button
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            onClick={() => setShowImport(true)}
          >
            Importar Excel
          </button>
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : 'Nuevo empleado'}
          </button>
        </div>
      </div>

      <ExcelImportDialog
        open={showImport}
        onOpenChange={setShowImport}
        title="Importar trabajadores desde Excel"
        description="Sube un archivo .xlsx. Las columnas Nombre, Apellido, Email, Teléfono, Departamento y Cargo serán mapeadas automáticamente. Los departamentos y cargos se crearán si no existen."
        columns={[
          { field: 'firstName', label: 'Nombre' },
          { field: 'lastName', label: 'Apellido' },
          { field: 'email', label: 'Email' },
          { field: 'phone', label: 'Teléfono' },
          { field: 'departmentName', label: 'Departamento' },
          { field: 'positionName', label: 'Cargo' },
        ]}
        mutation={importMutation}
      />

      {showForm && (
        <div className="rounded-lg border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Nombre" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input placeholder="Apellido" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <input placeholder="Email" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
              <option value="">Departamento</option>
              {deptList.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input type="date" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} />
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
          <h3 className="text-sm font-medium">Editar empleado</h3>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Nombre" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} />
            <input placeholder="Apellido" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} />
            <input placeholder="Email" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.departmentId} onChange={(e) => setEditForm({ ...editForm, departmentId: e.target.value })}>
              <option value="">Departamento</option>
              {deptList.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input type="date" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.hireDate} onChange={(e) => setEditForm({ ...editForm, hireDate: e.target.value })} />
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
              <th className="p-3">Email</th>
              <th className="p-3">Departamento</th>
              <th className="p-3">Fecha ingreso</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e: any) => (
              <tr key={e.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{e.firstName} {e.lastName}</td>
                <td className="p-3">{e.email}</td>
                <td className="p-3">{e.department?.name || '-'}</td>
                <td className="p-3">{e.hireDate ? new Date(e.hireDate).toLocaleDateString() : '-'}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(e)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-sm text-destructive hover:text-destructive/80"
                      onClick={() => handleDelete(e.id)}
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
        {employees.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay empleados</div>}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total: {total} empleados</span>
        <div className="flex items-center gap-2">
          <button className="rounded-md border px-3 py-1 disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
          <span>Página {page}</span>
          <button className="rounded-md border px-3 py-1 disabled:opacity-50" disabled={page * limit >= total} onClick={() => setPage(page + 1)}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}
