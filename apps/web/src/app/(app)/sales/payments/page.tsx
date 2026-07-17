'use client';

import * as React from 'react';
import { Card, CardContent } from '@nyvora/ui/components/ui/card';
import { Button } from '@nyvora/ui/components/ui/button';
import { Badge } from '@nyvora/ui/components/ui/badge';
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
import { Plus, DollarSign, Loader2, Trash2 } from 'lucide-react';
import { usePayments, useCreatePayment, useDeletePayment, useInvoices } from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';

export default function PaymentsPage() {
  const [page, setPage] = React.useState(1);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [newPayment, setNewPayment] = React.useState({
    invoiceId: '',
    amount: '',
    method: 'cash',
    reference: '',
    notes: '',
  });

  const { data, isLoading } = usePayments({ page, limit: 10 });
  const { data: invoicesData } = useInvoices({ limit: 100, status: 'sent' });
  const createMutation = useCreatePayment();
  const deleteMutation = useDeletePayment();
  const { toast } = useToast();

  const payments = data?.payments || data?.data || [];
  const invoices = invoicesData?.invoices || invoicesData?.data || [];
  const total = data?.total || 0;

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        toast({ title: 'Pago eliminado', description: 'El pago se ha eliminado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo eliminar el pago.', variant: 'destructive' });
      },
    });
  };

  const handleCreate = async () => {
    if (!newPayment.invoiceId || !newPayment.amount) return;

    await createMutation.mutateAsync({
      invoiceId: newPayment.invoiceId,
      amount: Number(newPayment.amount) * 100, // Convert to cents
      method: newPayment.method,
      reference: newPayment.reference,
      notes: newPayment.notes,
    });

    setIsCreateOpen(false);
    setNewPayment({ invoiceId: '', amount: '', method: 'cash', reference: '', notes: '' });
    toast({ title: 'Pago registrado', description: 'El pago se ha registrado correctamente.' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pagos recibidos</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Registrar Pago
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Pago</DialogTitle>
              <DialogDescription>
                Registra un pago recibido para una factura
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Factura</Label>
                <Select
                  value={newPayment.invoiceId}
                  onValueChange={(value) => setNewPayment(prev => ({ ...prev, invoiceId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar factura..." />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices.map((invoice: any) => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {invoice.number} - ${Number(invoice.total || 0).toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Método de pago</Label>
                <Select
                  value={newPayment.method}
                  onValueChange={(value) => setNewPayment(prev => ({ ...prev, method: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="card">Tarjeta</SelectItem>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Referencia</Label>
                <Input
                  id="reference"
                  placeholder="Número de referencia..."
                  value={newPayment.reference}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, reference: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Input
                  id="notes"
                  placeholder="Notas adicionales..."
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Registrando...' : 'Registrar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Factura</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Método</th>
                  <th className="p-3">Referencia</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3">{new Date(p.paidAt || p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 font-mono text-sm">{p.invoice?.number || '-'}</td>
                    <td className="p-3">${Number(p.amount || 0).toLocaleString()}</td>
                    <td className="p-3">
                      <Badge variant="secondary">
                        {p.method === 'cash' ? 'Efectivo' :
                         p.method === 'card' ? 'Tarjeta' :
                         p.method === 'transfer' ? 'Transferencia' :
                         p.method}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{p.reference || '-'}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No hay pagos registrados
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total: {total} pagos</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span>Página {page}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={payments.length < 10}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Pago</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este pago? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
