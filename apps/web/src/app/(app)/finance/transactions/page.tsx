'use client';

import { useState } from 'react';
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction, useAccounts, useFinanceCategories } from '@/lib/hooks';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@nyvora/ui/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const { data, isLoading } = useTransactions({ page, limit: 10, type });
  const { data: accounts } = useAccounts();
  const { data: categories } = useFinanceCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'expense', amount: '', accountId: '', categoryId: '', description: '', date: '' });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [editForm, setEditForm] = useState({ type: 'expense', amount: '', accountId: '', categoryId: '', description: '', date: '' });
  const transactions = data?.data || data?.transactions || [];
  const total = data?.total || 0;
  const limit = data?.limit || 10;
  const accountList = accounts?.data || accounts?.accounts || [];
  const categoryList = categories?.data || categories?.categories || [];

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  const openEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setEditForm({
      type: transaction.type || 'expense',
      amount: String(transaction.amount || ''),
      accountId: transaction.accountId || '',
      categoryId: transaction.categoryId || '',
      description: transaction.description || '',
      date: transaction.transactionDate ? transaction.transactionDate.split('T')[0] : '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingTransaction || !editForm.amount || !editForm.accountId) return;
    updateMutation.mutate(
      { id: editingTransaction.id, ...editForm },
      { onSuccess: () => { setIsEditOpen(false); setEditingTransaction(null); } }
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
        >
          <option value="">Todos los tipos</option>
          <option value="income">Ingreso</option>
          <option value="expense">Gasto</option>
        </select>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nueva transacción'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
            </select>
            <input placeholder="Monto" type="number" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <input type="date" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })}>
              <option value="">Cuenta</option>
              {accountList.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Categoría</option>
              {categoryList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Descripción" className="rounded-md border bg-background px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              if (form.amount && form.accountId) {
                createMutation.mutate(form, { onSuccess: () => { setForm({ type: 'expense', amount: '', accountId: '', categoryId: '', description: '', date: '' }); setShowForm(false); } });
              }
            }}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creando...' : 'Crear'}
          </button>
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar transacción</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}>
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
              </select>
              <input placeholder="Monto" type="number" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} />
              <input type="date" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.accountId} onChange={(e) => setEditForm({ ...editForm, accountId: e.target.value })}>
                <option value="">Cuenta</option>
                {accountList.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.categoryId} onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}>
                <option value="">Categoría</option>
                {categoryList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input placeholder="Descripción" className="rounded-md border bg-background px-3 py-2 text-sm" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <button className="rounded-md border px-4 py-2 text-sm" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </button>
            <button
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Actualizando...' : 'Actualizar'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="p-3">Fecha</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Monto</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t: any) => (
              <tr key={t.id} className="border-b last:border-0">
                <td className="p-3">{new Date(t.transactionDate || t.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                  </span>
                </td>
                <td className="p-3">{t.description || '-'}</td>
                <td className="p-3">${t.amount?.toLocaleString() || '0'}</td>
                <td className="p-3">{t.category?.name || '-'}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <button
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                      onClick={() => openEdit(t)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                      onClick={() => handleDelete(t.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay transacciones</div>}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total: {total} transacciones</span>
        <div className="flex items-center gap-2">
          <button className="rounded-md border px-3 py-1 disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
          <span>Página {page}</span>
          <button className="rounded-md border px-3 py-1 disabled:opacity-50" disabled={page * limit >= total} onClick={() => setPage(page + 1)}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}
