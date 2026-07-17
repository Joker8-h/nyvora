'use client';

import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@nyvora/ui/components/ui/dialog';
import { Button } from '@nyvora/ui/components/ui/button';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import { useToast } from '@nyvora/ui/hooks/use-toast';
import type { UseMutationResult } from '@tanstack/react-query';

export interface ImportColumnMap {
  field: string;
  label: string;
}

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  columns: ImportColumnMap[];
  typeColumn?: { field: string; clientValue: string; employeeValue: string };
  mutation: UseMutationResult<any, any, any[], unknown>;
  onSuccess?: (result: any) => void;
}

export function ExcelImportDialog({
  open,
  onOpenChange,
  title,
  description,
  columns,
  typeColumn,
  mutation,
  onSuccess,
}: ExcelImportDialogProps) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');
  const [mapping, setMapping] = useState<Record<string, string>>({});

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (json.length === 0) {
      toast({ title: 'Archivo vacío', description: 'No se encontraron filas.', variant: 'destructive' });
      return;
    }

    if (json.length > 500) {
      toast({
        title: 'Archivo demasiado grande',
        description: 'Máximo 500 filas por importación. Divide el archivo.',
        variant: 'destructive',
      });
      return;
    }

    const headers = Object.keys(json[0]);
    const initialMapping: Record<string, string> = {};
    for (const col of columns) {
      const match = headers.find((h) =>
        h.toLowerCase().includes(col.field.toLowerCase()) ||
        h.toLowerCase().includes(col.label.toLowerCase()),
      );
      if (match) initialMapping[col.field] = match;
    }
    if (typeColumn) {
      const match = headers.find((h) => h.toLowerCase().includes('tipo') || h.toLowerCase().includes('type'));
      if (match) initialMapping[typeColumn.field] = match;
    }
    setMapping(initialMapping);

    const mapped = json.map((row) => {
      const out: Record<string, any> = {};
      for (const col of columns) {
        const src = mapping[col.field] || initialMapping[col.field];
        if (src) out[col.field] = row[src];
      }
      if (typeColumn) {
        const src = initialMapping[typeColumn.field];
        const raw = (src ? String(row[src] || '').toLowerCase() : '').trim();
        out.type = raw.includes('trabajador') || raw.includes('empleado') || raw === 'employee'
          ? 'employee'
          : 'client';
      }
      return out;
    });
    setRows(mapped);
  }

  async function handleImport() {
    if (rows.length === 0) return;
    try {
      const result = await mutation.mutateAsync(rows);
      const parts = [`${result.created} creados`];
      if (result.skipped) parts.push(`${result.skipped} omitidos (duplicados)`);
      if (result.errors?.length) parts.push(`${result.errors.length} errores`);
      toast({
        title: 'Importación completada',
        description: parts.join(' · '),
      });
      onSuccess?.(result);
      setRows([]);
      setFileName('');
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: 'Error al importar',
        description: err?.message || 'Revisa el archivo y vuelve a intentarlo.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="excel-file">Archivo Excel (.xlsx)</Label>
            <Input
              id="excel-file"
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFile}
            />
            {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
          </div>

          {rows.length > 0 && (
            <div className="max-h-80 overflow-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {columns.map((c) => (
                      <th key={c.field} className="px-2 py-1 text-left font-medium">
                        {c.label}
                      </th>
                    ))}
                    {typeColumn && <th className="px-2 py-1 text-left font-medium">Tipo</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 50).map((r, i) => (
                    <tr key={i} className="border-t">
                      {columns.map((c) => (
                        <td key={c.field} className="px-2 py-1 truncate max-w-[160px]">
                          {String(r[c.field] ?? '')}
                        </td>
                      ))}
                      {typeColumn && (
                        <td className="px-2 py-1">
                          {r.type === 'employee' ? 'Trabajador' : 'Cliente'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 50 && (
                <p className="px-2 py-1 text-xs text-muted-foreground">
                  +{rows.length - 50} filas más…
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={rows.length === 0 || mutation.isPending}>
            {mutation.isPending ? 'Importando…' : `Importar ${rows.length} filas`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
