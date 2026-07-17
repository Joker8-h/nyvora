'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Check, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { NovaToolCall as NovaToolCallType } from '@nyvora/types';

interface NovaToolCallProps {
  toolCall: NovaToolCallType;
}

const toolLabels: Record<string, string> = {
  createCustomer: 'Crear Cliente',
  findCustomer: 'Buscar Cliente',
  updateCustomer: 'Actualizar Cliente',
  deleteCustomer: 'Eliminar Cliente',
  createQuote: 'Crear Cotización',
  createInvoice: 'Crear Factura',
  findProduct: 'Buscar Producto',
  updateProduct: 'Actualizar Producto',
  scheduleMeeting: 'Agendar Reunión',
  createTask: 'Crear Tarea',
  updateTask: 'Actualizar Tarea',
  getSalesReport: 'Reporte de Ventas',
  getInventoryReport: 'Reporte de Inventario',
  getFinancialReport: 'Reporte Financiero',
  createEmployee: 'Crear Empleado',
  findEmployee: 'Buscar Empleado',
  scheduleInterview: 'Agendar Entrevista',
  createCampaign: 'Crear Campaña',
  sendEmail: 'Enviar Email',
  sendWhatsApp: 'Enviar WhatsApp',
};

export function NovaToolCall({ toolCall }: NovaToolCallProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const label = toolLabels[toolCall.name] || toolCall.name;

  const getStatusIcon = () => {
    switch (toolCall.status) {
      case 'pending':
        return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />;
      case 'executing':
        return <Loader2 className="h-3 w-3 animate-spin text-primary" />;
      case 'completed':
        return <Check className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <X className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (toolCall.status) {
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'executing':
        return <Badge variant="default">Ejecutando</Badge>;
      case 'completed':
        return <Badge variant="success">Completado</Badge>;
      case 'failed':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border bg-background/50 p-3">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-2 border-t pt-3">
          {Object.keys(toolCall.arguments).length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Parámetros:</p>
              <div className="text-xs bg-muted rounded-md p-2 space-y-0.5">
                {Object.entries(toolCall.arguments).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-muted-foreground">{k}:</span>
                    <span className="break-all">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {toolCall.result && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Resultado:</p>
              <p className="text-xs bg-muted rounded-md p-2">{summarizeResult(toolCall.result)}</p>
            </div>
          )}

          {toolCall.error && (
            <div>
              <p className="text-xs font-medium text-destructive mb-1">Error:</p>
              <p className="text-xs text-destructive">{toolCall.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function summarizeResult(result: any): string {
  if (result == null) return '—';
  if (typeof result === 'string') return result;
  if (Array.isArray(result)) return `${result.length} elemento(s)`;

  const parts: string[] = [];
  const name = result.name || result.title || result.firstName || result.subject;
  if (name) parts.push(`Nombre: ${name}`);
  if (result.id) parts.push(`ID: ${result.id}`);
  if (result.status) parts.push(`Estado: ${result.status}`);
  if (result.total != null) parts.push(`Total: ${result.total}`);
  if (result.totalCount != null) parts.push(`Total: ${result.totalCount}`);
  if (result.sentCount != null) parts.push(`Enviados: ${result.sentCount}`);
  if (result.email) parts.push(`Email: ${result.email}`);
  if (result.phone) parts.push(`Teléfono: ${result.phone}`);

  if (parts.length > 0) return parts.join(' · ');

  const keys = Object.keys(result);
  if (keys.length <= 3) {
    return keys.map((k) => `${k}: ${typeof result[k] === 'object' ? JSON.stringify(result[k]) : result[k]}`).join(' · ');
  }
  return `Operación completada (${keys.length} campos).`;
}