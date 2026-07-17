'use client';

import { useState } from 'react';
import { useProfitLoss, useBalanceSheet } from '@/lib/hooks';

export default function ReportsPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const { data: plData, isLoading: plLoading } = useProfitLoss({ from, to });
  const { data: bsData, isLoading: bsLoading } = useBalanceSheet();

  const sumBalance = (accounts: any[]) =>
    (accounts || []).reduce((acc: number, a: any) => acc + Number(a.balance || 0), 0);
  const assetsTotal = sumBalance(bsData?.assets);
  const liabilitiesTotal = sumBalance(bsData?.liabilities);
  const equityTotal = sumBalance(bsData?.equity);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input type="date" className="rounded-md border bg-background px-3 py-2 text-sm" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="date" className="rounded-md border bg-background px-3 py-2 text-sm" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="font-medium">Estado de Resultados</h3>
          {plLoading ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ingresos</span>
                <span className="text-green-600">${plData?.income?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Gastos</span>
                <span className="text-red-600">${plData?.expenses?.toLocaleString() || '0'}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm font-medium">
                <span>Utilidad Neta</span>
                <span>${plData?.netIncome?.toLocaleString() || '0'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="font-medium">Balance General</h3>
          {bsLoading ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Activos</span>
                <span>${assetsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pasivos</span>
                <span>${liabilitiesTotal.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm font-medium">
                <span>Patrimonio</span>
                <span>${equityTotal.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
