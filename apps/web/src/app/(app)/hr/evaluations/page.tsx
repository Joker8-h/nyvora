'use client';

import { useState } from 'react';
import { useEvaluations, useCreateEvaluation, useUpdateEvaluation, useDeleteEvaluation, useEmployees } from '@/lib/hooks';

export default function EvaluationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useEvaluations({ page, limit: 10 });
  const { data: employees } = useEmployees({ limit: 100 });
  const createMutation = useCreateEvaluation();
  const updateMutation = useUpdateEvaluation();
  const deleteMutation = useDeleteEvaluation();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employeeId: '', score: '', comments: '' });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', employeeId: '', score: '', comments: '' });

  const evaluations = data?.data || data?.evaluations || [];
  const employeeList = employees?.data || employees?.employees || [];

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  const handleCreate = () => {
    if (form.employeeId && form.score) {
      createMutation.mutate(form, {
        onSuccess: () => {
          setForm({ employeeId: '', score: '', comments: '' });
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = () => {
    if (editForm.employeeId && editForm.score) {
      updateMutation.mutate(editForm, {
        onSuccess: () => {
          setIsEditOpen(false);
          setEditForm({ id: '', employeeId: '', score: '', comments: '' });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta evaluación?')) {
      deleteMutation.mutate(id);
    }
  };

  const openEdit = (ev: any) => {
    setEditForm({
      id: ev.id,
      employeeId: ev.employeeId || '',
      score: String(ev.managerScore ?? ev.selfScore ?? ev.score ?? ''),
      comments: ev.notes ?? ev.comments ?? '',
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Evaluaciones</h2>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nueva evaluación'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">Empleado</option>
              {employeeList.map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </select>
            <input placeholder="Puntuación (1-10)" type="number" min="1" max="10" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
            <textarea placeholder="Comentarios" className="rounded-md border bg-background px-3 py-2 text-sm col-span-2" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
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
          <h3 className="text-sm font-medium">Editar evaluación</h3>
          <div className="grid grid-cols-2 gap-3">
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.employeeId} onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}>
              <option value="">Empleado</option>
              {employeeList.map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </select>
            <input placeholder="Puntuación (1-10)" type="number" min="1" max="10" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.score} onChange={(e) => setEditForm({ ...editForm, score: e.target.value })} />
            <textarea placeholder="Comentarios" className="rounded-md border bg-background px-3 py-2 text-sm col-span-2" value={editForm.comments} onChange={(e) => setEditForm({ ...editForm, comments: e.target.value })} />
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
              <th className="p-3">Puntuación</th>
              <th className="p-3">Comentarios</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((ev: any) => (
              <tr key={ev.id} className="border-b last:border-0">
                <td className="p-3">{ev.employee?.firstName} {ev.employee?.lastName}</td>
                <td className="p-3">
                  {(() => {
                    const score = ev.managerScore ?? ev.selfScore ?? ev.score;
                    return (
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        score >= 7 ? 'bg-green-100 text-green-700' :
                        score >= 4 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {score ?? '-'}/10
                      </span>
                    );
                  })()}
                </td>
                <td className="p-3 max-w-xs truncate">{ev.notes ?? ev.comments ?? '-'}</td>
                <td className="p-3">{new Date(ev.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(ev)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-sm text-destructive hover:text-destructive/80"
                      onClick={() => handleDelete(ev.id)}
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
        {evaluations.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay evaluaciones</div>}
      </div>
    </div>
  );
}
