'use client';

import { useState } from 'react';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/lib/hooks';

export default function AccountsPage() {
  const { data, isLoading } = useAccounts();
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'checking', bank: '', accountNumber: '' });
  const [editAccount, setEditAccount] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ name: '', type: 'checking', bank: '', accountNumber: '' });
  const accounts = data?.data || data?.accounts || [];

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cuentas bancarias</h2>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nueva cuenta'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Nombre" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="checking">Corriente</option>
              <option value="savings">Ahorro</option>
              <option value="cash">Efectivo</option>
              <option value="credit">Crédito</option>
            </select>
            <input placeholder="Banco" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} />
            <input placeholder="Número de cuenta" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
          </div>
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              if (form.name) {
                createMutation.mutate(form, { onSuccess: () => { setForm({ name: '', type: 'checking', bank: '', accountNumber: '' }); setShowForm(false); } });
              }
            }}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creando...' : 'Crear'}
          </button>
        </div>
      )}

      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="p-3">Nombre</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Banco</th>
              <th className="p-3">Saldo</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a: any) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3">{a.type}</td>
                <td className="p-3">{a.bank || '-'}</td>
                <td className="p-3">${a.balance?.toLocaleString() || '0'}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      className="text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setEditAccount(a);
                        setEditForm({ name: a.name, type: a.type, bank: a.bank || '', accountNumber: a.accountNumber || '' });
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-sm text-destructive hover:text-destructive/80"
                      onClick={() => {
                        if (confirm('¿Eliminar esta cuenta?')) {
                          deleteMutation.mutate(a.id);
                        }
                      }}
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
        {accounts.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay cuentas</div>}
      </div>

      {editAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg border bg-background p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Editar cuenta</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Nombre" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}>
                <option value="checking">Corriente</option>
                <option value="savings">Ahorro</option>
                <option value="cash">Efectivo</option>
                <option value="credit">Crédito</option>
              </select>
              <input placeholder="Banco" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.bank} onChange={(e) => setEditForm({ ...editForm, bank: e.target.value })} />
              <input placeholder="Número de cuenta" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.accountNumber} onChange={(e) => setEditForm({ ...editForm, accountNumber: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                onClick={() => setEditAccount(null)}
              >
                Cancelar
              </button>
              <button
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  if (editForm.name) {
                    updateMutation.mutate(
                      { id: editAccount.id, ...editForm },
                      { onSuccess: () => setEditAccount(null) }
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
    </div>
  );
}
