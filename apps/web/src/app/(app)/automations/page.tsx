'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@nyvora/ui/components/ui/card';
import { Button } from '@nyvora/ui/components/ui/button';
import { Badge } from '@nyvora/ui/components/ui/badge';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import { cn } from '@nyvora/ui/lib/utils';
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
import {
  Zap,
  Plus,
  Play,
  Pause,
  Trash2,
  CheckCircle,
  X,
  BookOpen,
  Lightbulb,
  Mail,
  Bell,
  UserPlus,
  RefreshCw,
  FileText,
  Database,
  Globe,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { useAutomations, useCreateAutomation, useToggleAutomation, useDeleteAutomation, useExecuteAutomation } from '@/lib/hooks';

const triggerTypes = [
  { value: 'lead.created', label: 'Lead creado' },
  { value: 'lead.stage_changed', label: 'Lead cambió etapa' },
  { value: 'order.created', label: 'Orden creada' },
  { value: 'invoice.paid', label: 'Factura pagada' },
  { value: 'invoice.overdue', label: 'Factura vencida' },
  { value: 'stock.low', label: 'Stock bajo' },
  { value: 'employee.hired', label: 'Empleado contratado' },
  { value: 'schedule.cron', label: 'Programado (cron)' },
];

const actionTypes = [
  { value: 'email.send', label: 'Enviar email', icon: Mail },
  { value: 'notify', label: 'Notificar', icon: Bell },
  { value: 'lead.assign', label: 'Asignar lead', icon: UserPlus },
  { value: 'lead.update_stage', label: 'Actualizar etapa del lead', icon: RefreshCw },
  { value: 'invoice.create', label: 'Crear factura', icon: FileText },
  { value: 'record.update', label: 'Actualizar registro', icon: Database },
  { value: 'webhook.call', label: 'Llamar webhook', icon: Globe },
];

interface ActionConfig {
  type: string;
  config: Record<string, string>;
}

function ActionConfigFields({
  action,
  index,
  onChange,
}: {
  action: ActionConfig;
  index: number;
  onChange: (index: number, field: string, value: string) => void;
}) {
  switch (action.type) {
    case 'email.send':
      return (
        <div className="grid gap-3 mt-2">
          <div className="space-y-1">
            <Label htmlFor={`email-to-${index}`} className="text-xs">Para (email)</Label>
            <Input
              id={`email-to-${index}`}
              placeholder="destinatario@ejemplo.com"
              value={action.config.to || ''}
              onChange={(e) => onChange(index, 'to', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`email-subject-${index}`} className="text-xs">Asunto</Label>
            <Input
              id={`email-subject-${index}`}
              placeholder="Asunto del email"
              value={action.config.subject || ''}
              onChange={(e) => onChange(index, 'subject', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`email-body-${index}`} className="text-xs">Cuerpo</Label>
            <textarea
              id={`email-body-${index}`}
              placeholder="Cuerpo del mensaje..."
              rows={3}
              value={action.config.body || ''}
              onChange={(e) => onChange(index, 'body', e.target.value)}
              className={cn(
                'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              )}
            />
          </div>
        </div>
      );
    case 'notify':
      return (
        <div className="grid gap-3 mt-2">
          <div className="space-y-1">
            <Label htmlFor={`notify-title-${index}`} className="text-xs">Título</Label>
            <Input
              id={`notify-title-${index}`}
              placeholder="Título de la notificación"
              value={action.config.title || ''}
              onChange={(e) => onChange(index, 'title', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`notify-message-${index}`} className="text-xs">Mensaje</Label>
            <textarea
              id={`notify-message-${index}`}
              placeholder="Mensaje de la notificación..."
              rows={2}
              value={action.config.message || ''}
              onChange={(e) => onChange(index, 'message', e.target.value)}
              className={cn(
                'flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              )}
            />
          </div>
        </div>
      );
    case 'lead.assign':
      return (
        <div className="grid gap-3 mt-2">
          <div className="space-y-1">
            <Label htmlFor={`lead-assignee-${index}`} className="text-xs">Asignar a (email o ID)</Label>
            <Input
              id={`lead-assignee-${index}`}
              placeholder="vendedor@ejemplo.com"
              value={action.config.assignee || ''}
              onChange={(e) => onChange(index, 'assignee', e.target.value)}
            />
          </div>
        </div>
      );
    case 'lead.update_stage':
      return (
        <div className="grid gap-3 mt-2">
          <div className="space-y-1">
            <Label htmlFor={`lead-stage-${index}`} className="text-xs">Nueva etapa</Label>
            <Input
              id={`lead-stage-${index}`}
              placeholder="Ej: Calificado"
              value={action.config.stage || ''}
              onChange={(e) => onChange(index, 'stage', e.target.value)}
            />
          </div>
        </div>
      );
    case 'invoice.create':
      return (
        <div className="grid gap-3 mt-2">
          <div className="space-y-1">
            <Label htmlFor={`invoice-template-${index}`} className="text-xs">Plantilla</Label>
            <Input
              id={`invoice-template-${index}`}
              placeholder="plantilla-factura"
              value={action.config.template || ''}
              onChange={(e) => onChange(index, 'template', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`invoice-concept-${index}`} className="text-xs">Concepto</Label>
            <Input
              id={`invoice-concept-${index}`}
              placeholder="Concepto de la factura"
              value={action.config.concept || ''}
              onChange={(e) => onChange(index, 'concept', e.target.value)}
            />
          </div>
        </div>
      );
    case 'record.update':
      return (
        <div className="grid gap-3 mt-2">
          <div className="space-y-1">
            <Label htmlFor={`record-entity-${index}`} className="text-xs">Entidad</Label>
            <Input
              id={`record-entity-${index}`}
              placeholder="lead, order, invoice..."
              value={action.config.entity || ''}
              onChange={(e) => onChange(index, 'entity', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`record-field-${index}`} className="text-xs">Campo</Label>
            <Input
              id={`record-field-${index}`}
              placeholder="Campo a actualizar"
              value={action.config.field || ''}
              onChange={(e) => onChange(index, 'field', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`record-value-${index}`} className="text-xs">Nuevo valor</Label>
            <Input
              id={`record-value-${index}`}
              placeholder="Valor a asignar"
              value={action.config.value || ''}
              onChange={(e) => onChange(index, 'value', e.target.value)}
            />
          </div>
        </div>
      );
    case 'webhook.call':
      return (
        <div className="grid gap-3 mt-2">
          <div className="space-y-1">
            <Label htmlFor={`webhook-url-${index}`} className="text-xs">URL del webhook</Label>
            <Input
              id={`webhook-url-${index}`}
              placeholder="https://api.ejemplo.com/webhook"
              value={action.config.url || ''}
              onChange={(e) => onChange(index, 'url', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`webhook-method-${index}`} className="text-xs">Método</Label>
            <Select
              value={action.config.method || 'POST'}
              onValueChange={(value) => onChange(index, 'method', value)}
            >
              <SelectTrigger id={`webhook-method-${index}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    default:
      return null;
  }
}

const tutorialSteps = [
  {
    title: 'Define tu trigger',
    subtitle: '¿Cuándo ocurrirá?',
    description: 'Selecciona el evento que activará tu automatización. Puede ser un lead nuevo, una factura pagada, stock bajo, o un horario programado.',
    icon: Zap,
    tips: [
      'Los triggers se ejecutan en tiempo real',
      'Puedes usar "Programado (cron)" para tareas periódicas',
      'Cada trigger solo puede tener una automatización activa',
    ],
  },
  {
    title: 'Configura las acciones',
    subtitle: '¿Qué hará?',
    description: 'Define qué acciones se ejecutarán cuando se active el trigger. Puedes enviar emails, notificar al equipo, asignar leads y más.',
    icon: Sparkles,
    tips: [
      'Las acciones se ejecutan en orden secuencial',
      'Puedes agregar múltiples acciones por automatización',
      'Cada tipo de acción tiene sus propios campos de configuración',
    ],
  },
  {
    title: 'Activa y monitorea',
    subtitle: '¿Cómo funciona?',
    description: 'Activa tu automatización y revisa cuántas veces se ha ejecutado. Puedes pausar o reactivar en cualquier momento.',
    icon: CheckCircle,
    tips: [
      'Las automatizaciones se pausan automáticamente si fallan 5 veces',
      'Revisa el historial de ejecuciones en el dashboard',
      'Puedes pausar y reactivar sin perder configuración',
    ],
  },
];

export default function AutomationsPage() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = React.useState(false);
  const [isTipsPanelOpen, setIsTipsPanelOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; name: string } | null>(null);
  const [showFirstVisitTooltip, setShowFirstVisitTooltip] = React.useState(false);
  const [tutorialStep, setTutorialStep] = React.useState(0);

  const [newAutomation, setNewAutomation] = React.useState({
    name: '',
    description: '',
    triggerType: '',
    actions: [] as { type: string; config: Record<string, string> }[],
  });

  const { data: automationsData, isLoading } = useAutomations();
  const createAutomation = useCreateAutomation();
  const toggleAutomation = useToggleAutomation();
  const deleteAutomation = useDeleteAutomation();
  const executeAutomation = useExecuteAutomation();

  const automations = automationsData?.data || [];

  React.useEffect(() => {
    const hasVisited = localStorage.getItem('automations-tutorial-seen');
    if (!hasVisited && automations.length === 0) {
      setShowFirstVisitTooltip(true);
    }
  }, [automations.length]);

  const dismissTutorial = () => {
    localStorage.setItem('automations-tutorial-seen', 'true');
    setShowFirstVisitTooltip(false);
  };

  const handleCreate = async () => {
    if (!newAutomation.name || !newAutomation.triggerType) return;

    await createAutomation.mutateAsync({
      ...newAutomation,
      triggerConfig: {},
      actions:
        newAutomation.actions.length > 0
          ? newAutomation.actions
          : [{ type: 'notify', config: { title: 'Automation ejecutada', message: 'Se ejecutó la automación' } }],
    });

    setIsCreateOpen(false);
    setNewAutomation({ name: '', description: '', triggerType: '', actions: [] });
  };

  const handleToggle = async (id: string) => {
    await toggleAutomation.mutateAsync(id);
  };

  const [execResult, setExecResult] = React.useState<{ name: string; ok: boolean; detail: string } | null>(null);

  const handleExecute = async (automation: any) => {
    try {
      const res: any = await executeAutomation.mutateAsync(automation.id);
      const failed = (res.results || []).filter((r: any) => !r.success);
      if (failed.length > 0) {
        setExecResult({ name: automation.name, ok: false, detail: failed.map((f: any) => `${f.type}: ${f.error}`).join('; ') });
      } else {
        setExecResult({ name: automation.name, ok: true, detail: `${(res.results || []).length} acción(es) ejecutada(s) correctamente` });
      }
    } catch (err: any) {
      setExecResult({ name: automation.name, ok: false, detail: err?.message || 'Error al ejecutar' });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAutomation.mutateAsync(id);
    setDeleteTarget(null);
  };

  const addAction = () => {
    setNewAutomation((prev) => ({
      ...prev,
      actions: [...prev.actions, { type: 'notify', config: {} }],
    }));
  };

  const removeAction = (index: number) => {
    setNewAutomation((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }));
  };

  const updateActionType = (index: number, type: string) => {
    setNewAutomation((prev) => ({
      ...prev,
      actions: prev.actions.map((a, i) => (i === index ? { type, config: {} } : a)),
    }));
  };

  const updateActionConfig = (index: number, field: string, value: string) => {
    setNewAutomation((prev) => ({
      ...prev,
      actions: prev.actions.map((a, i) =>
        i === index ? { ...a, config: { ...a.config, [field]: value } } : a
      ),
    }));
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Automatizaciones</h1>
            <p className="text-muted-foreground">Flujos automáticos para tu negocio</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTipsPanelOpen(!isTipsPanelOpen)}
            >
              <Lightbulb className="mr-1 h-4 w-4" />
              Tips
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsTutorialOpen(true)}>
              <BookOpen className="mr-1 h-4 w-4" />
              Tutorial
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Automatización
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Automatización</DialogTitle>
                  <DialogDescription>
                    Configura un flujo automático que se ejecuta cuando ocurre un evento
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      placeholder="Ej: Notificar stock bajo"
                      value={newAutomation.name}
                      onChange={(e) => setNewAutomation((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                      id="description"
                      placeholder="Descripción del flujo"
                      value={newAutomation.description}
                      onChange={(e) =>
                        setNewAutomation((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trigger (Evento)</Label>
                    <Select
                      value={newAutomation.triggerType}
                      onValueChange={(value) =>
                        setNewAutomation((prev) => ({ ...prev, triggerType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar evento..." />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerTypes.map((trigger) => (
                          <SelectItem key={trigger.value} value={trigger.value}>
                            {trigger.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Acciones</Label>
                      <Button variant="outline" size="sm" onClick={addAction}>
                        <Plus className="mr-1 h-3 w-3" />
                        Agregar
                      </Button>
                    </div>
                    {newAutomation.actions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No hay acciones. Agrega al menos una.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {newAutomation.actions.map((action, index) => {
                          const actionDef = actionTypes.find((t) => t.value === action.type);
                          const Icon = actionDef?.icon || Zap;
                          return (
                            <div key={index} className="rounded-lg border p-3 space-y-1">
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <Select
                                  value={action.type}
                                  onValueChange={(value) => updateActionType(index, value)}
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {actionTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAction(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <ActionConfigFields
                                action={action}
                                index={index}
                                onChange={updateActionConfig}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate} disabled={createAutomation.isPending}>
                    {createAutomation.isPending ? 'Creando...' : 'Crear'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {showFirstVisitTooltip && (
          <div className="relative rounded-lg border border-primary/20 bg-primary/5 p-4">
            <button
              onClick={dismissTutorial}
              className="absolute right-2 top-2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Bienvenido a Automatizaciones</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Crea flujos automáticos para ahorrar tiempo. Haz clic en "Tutorial" para
                  aprender cómo funciona o en "Tips" para ver consejos útiles.
                </p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="default" onClick={() => { dismissTutorial(); setIsTutorialOpen(true); }}>
                    <BookOpen className="mr-1 h-3 w-3" />
                    Ver Tutorial
                  </Button>
                  <Button size="sm" variant="outline" onClick={dismissTutorial}>
                    Entendido
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {execResult && (
          <div className={`flex items-center justify-between rounded-lg border p-3 ${execResult.ok ? 'border-green-500/30 bg-green-500/10' : 'border-destructive/30 bg-destructive/10'}`}>
            <div className="text-sm">
              <span className="font-medium">{execResult.name}: </span>
              {execResult.detail}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setExecResult(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Cargando automatizaciones...</div>
          </div>
        ) : automations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Zap className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No hay automatizaciones</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crea tu primera automatización para empezar a ahorrar tiempo
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Automatización
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {automations.map((automation: any) => (
              <Card key={automation.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{automation.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {automation.description || 'Sin descripción'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={automation.status === 'active' ? 'default' : 'secondary'}
                        >
                          {automation.status === 'active'
                            ? 'Activo'
                            : automation.status === 'paused'
                              ? 'Pausado'
                              : 'Borrador'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Trigger: {automation.triggerType}
                        </span>
                        {automation.executionCount > 0 && (
                          <span className="text-xs text-muted-foreground">
                            · Ejecutado {automation.executionCount} veces
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExecute(automation)}
                      disabled={executeAutomation.isPending}
                      title="Ejecutar ahora"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(automation.id)}
                      disabled={toggleAutomation.isPending}
                    >
                      {automation.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setDeleteTarget({ id: automation.id, name: automation.name })
                      }
                      disabled={deleteAutomation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {isTipsPanelOpen && (
        <div className="w-72 shrink-0 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Tips de Automatizaciones</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsTipsPanelOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Triggers
                </h4>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li>• Usa "Lead creado" para procesar nuevos leads automáticamente</li>
                  <li>• "Stock bajo" te alerta antes de quedarte sin producto</li>
                  <li>• "Programado (cron)" ejecuta tareas en horarios específicos</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Acciones
                </h4>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li>• "Enviar email" requiere configurar destinatario, asunto y cuerpo</li>
                  <li>• "Llamar webhook" permite conectar con APIs externas</li>
                  <li>• Puedes encadenar múltiples acciones en secuencia</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  Monitoreo
                </h4>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li>• Revisa el contador de ejecuciones para medir uso</li>
                  <li>• Las automatizaciones pausan automáticamente tras 5 fallos</li>
                  <li>• Usa el botón de pausa para mantenimiento temporal</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Como crear automatizaciones
            </DialogTitle>
            <DialogDescription>
              Guía paso a paso para configurar tus flujos automáticos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-1">
              {tutorialSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= tutorialStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            {(() => {
              const step = tutorialSteps[tutorialStep];
              const Icon = step.icon;
              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  <ul className="space-y-1.5">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>
          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={tutorialStep === 0}
              onClick={() => setTutorialStep((s) => s - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>
            <span className="text-xs text-muted-foreground self-center">
              {tutorialStep + 1} / {tutorialSteps.length}
            </span>
            {tutorialStep < tutorialSteps.length - 1 ? (
              <Button size="sm" onClick={() => setTutorialStep((s) => s + 1)}>
                Siguiente
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  dismissTutorial();
                  setIsTutorialOpen(false);
                  setTutorialStep(0);
                }}
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Entendido
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar automatización</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar <span className="font-medium text-foreground">{deleteTarget?.name}</span>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
              disabled={deleteAutomation.isPending}
            >
              {deleteAutomation.isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
