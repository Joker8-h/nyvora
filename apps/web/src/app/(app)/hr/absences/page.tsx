'use client';

import { useState } from 'react';
import { useAbsences, useCreateAbsence, useUpdateAbsence, useDeleteAbsence, useEmployees } from '@/lib/hooks';

export default function AbsencesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAbsences({ page, limit: 10 });
  const { data: employees } = useEmployees({ limit: 100 });
  const createMutation = useCreateAbsence();
  const updateMutation = useUpdateAbsence();
  const deleteMutation = useDeleteAbsence();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employeeId: '', type: 'vacation', startDate: '', endDate: '', reason: '' });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', employeeId: '', type: 'vacation', startDate: '', endDate: '', reason: '' });
  const absences = data?.data || data?.absences || [];
  const employeeList = employees?.data || employees?.employees || [];

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  const handleCreate = () => {
    if (form.employeeId && form.startDate) {
      createMutation.mutate(form, {
        onSuccess: () => {
          setForm({ employeeId: '', type: 'vacation', startDate: '', endDate: '', reason: '' });
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = () => {
    if (editForm.employeeId && editForm.startDate) {
      updateMutation.mutate(editForm, {
        onSuccess: () => {
          setIsEditOpen(false);
          setEditForm({ id: '', employeeId: '', type: 'vacation', startDate: '', endDate: '', reason: '' });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta ausencia?')) {
      deleteMutation.mutate(id);
    }
  };

  const openEdit = (absence: any) => {
    setEditForm({
      id: absence.id,
      employeeId: absence.employeeId || '',
      type: absence.type || 'vacation',
      startDate: absence.startDate ? absence.startDate.split('T')[0] : '',
      endDate: absence.endDate ? absence.endDate.split('T')[0] : '',
      reason: absence.notes || absence.reason || '',
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ausencias</h2>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nueva ausencia'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">Empleado</option>
              {employeeList.map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </select>
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="vacation">Vacaciones</option>
              <option value="sick">Enfermedad</option>
              <option value="personal">Personal</option>
              <option value="other">Otro</option>
            </select>
            <input type="date" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <input type="date" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            <textarea placeholder="Motivo" className="rounded-md border bg-background px-3 py-2 text-sm col-span-2" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
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
          <h3 className="text-sm font-medium">Editar ausencia</h3>
          <div className="grid grid-cols-2 gap-3">
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.employeeId} onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}>
              <option value="">Empleado</option>
              {employeeList.map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </select>
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}>
              <option value="vacation">Vacaciones</option>
              <option value="sick">Enfermedad</option>
              <option value="personal">Personal</option>
              <option value="other">Otro</option>
            </select>
            <input type="date" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} />
            <input type="date" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} />
            <textarea placeholder="Motivo" className="rounded-md border bg-background px-3 py-2 text-sm col-span-2" value={editForm.reason} onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })} />
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
              <th className="p-3">Empleado</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Inicio</th>
              <th className="p-3">Fin</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {absences.map((a: any) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="p-3">{a.employee?.firstName} {a.employee?.lastName}</td>
                <td className="p-3">{a.type}</td>
                <td className="p-3">{new Date(a.startDate).toLocaleDateString()}</td>
                <td className="p-3">{a.endDate ? new Date(a.endDate).toLocaleDateString() : '-'}</td>
                <td className="p-3">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                    {a.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(a)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-sm text-destructive hover:text-destructive/80"
                      onClick={() => handleDelete(a.id)}
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
        {absences.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay ausencias</div>}
      </div>
    </div>
  );
}
