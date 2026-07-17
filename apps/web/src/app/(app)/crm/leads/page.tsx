'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@nyvora/ui/components/ui/card';
import { Button } from '@nyvora/ui/components/ui/button';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import { Badge } from '@nyvora/ui/components/ui/badge';
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
import { Plus, Pencil, Trash2, Eye, ArrowRightCircle, UserCheck, XCircle } from 'lucide-react';
import {
  useLeads,
  useCreateLead,
  useDeleteLead,
  useUpdateLead,
  usePipelines,
  useContacts,
  useLead,
  useMoveLeadStage,
  useConvertLead,
  useMarkLeadLost,
  useLeadActivities,
  useCreateLeadActivity,
} from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';

const SOURCES = ['web', 'referido', 'publicidad', 'evento', 'otro'];
const emptyForm = { title: '', contactId: '', firstName: '', email: '', estimatedValue: '', pipelineId: '', stage: '', source: '', notes: '' };

function stageNames(stages: any): string[] {
  if (!Array.isArray(stages)) return [];
  return stages.map((s: any) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
}

function statusBadge(status: string) {
  if (status === 'converted') return <Badge>Convertido</Badge>;
  if (status === 'lost') return <Badge variant="destructive">Perdido</Badge>;
  return <Badge variant="secondary">Activo</Badge>;
}

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const [stage, setStage] = useState('all');
  const [status, setStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const { data, isLoading } = useLeads({
    page,
    limit: 10,
    stage: stage === 'all' ? undefined : stage,
    status: status === 'all' ? undefined : status,
  });
  const { data: pipelines } = usePipelines();
  const { data: contactsResp } = useContacts({ limit: 100 });
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();
  const { toast } = useToast();

  const leads = data?.data || [];
  const total = data?.total || 0;
  const pipelineList = pipelines?.data || [];
  const contacts = contactsResp?.data || [];

  const selectedPipeline = useMemo(
    () => pipelineList.find((p: any) => p.id === form.pipelineId),
    [pipelineList, form.pipelineId],
  );
  const stageOptions = useMemo(() => stageNames(selectedPipeline?.stages), [selectedPipeline]);
  const allStages = useMemo(() => {
    const set = new Set<string>();
    pipelineList.forEach((p: any) => stageNames(p.stages).forEach((s) => set.add(s)));
    return Array.from(set);
  }, [pipelineList]);

  const resetForm = () => setForm({ ...emptyForm });

  const buildPayload = () => {
    const payload: any = {
      title: form.title || undefined,
      estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : undefined,
      pipelineId: form.pipelineId || undefined,
      stage: form.stage || undefined,
      source: form.source || undefined,
      notes: form.notes || undefined,
    };
    if (form.contactId) {
      payload.contactId = form.contactId;
    } else if (form.firstName || form.email) {
      payload.firstName = form.firstName || undefined;
      payload.email = form.email || undefined;
    }
    return payload;
  };

  const handleCreate = () => {
    createMutation.mutate(buildPayload(), {
      onSuccess: () => {
        resetForm();
        setShowForm(false);
        toast({ title: 'Lead creado', description: 'El lead se ha creado correctamente.' });
      },
      onError: (e: any) => toast({ title: 'Error', description: e?.message || 'No se pudo crear el lead.', variant: 'destructive' }),
    });
  };

  const openEdit = (lead: any) => {
    setEditId(lead.id);
    setForm({
      title: lead.title || '',
      contactId: lead.contactId || '',
      firstName: '',
      email: '',
      estimatedValue: lead.estimatedValue?.toString() || '',
      pipelineId: lead.pipelineId || '',
      stage: lead.stage || '',
      source: lead.source || '',
      notes: lead.notes || '',
    });
  };

  const handleUpdate = () => {
    if (!editId) return;
    updateMutation.mutate(
      {
        id: editId,
        title: form.title || undefined,
        contactId: form.contactId || undefined,
        estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : undefined,
        pipelineId: form.pipelineId || undefined,
        stage: form.stage || undefined,
        source: form.source || undefined,
        notes: form.notes || undefined,
      },
      {
        onSuccess: () => {
          setEditId(null);
          resetForm();
          toast({ title: 'Lead actualizado', description: 'El lead se ha actualizado correctamente.' });
        },
        onError: (e: any) => toast({ title: 'Error', description: e?.message || 'No se pudo actualizar el lead.', variant: 'destructive' }),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        toast({ title: 'Lead eliminado', description: 'El lead se ha eliminado correctamente.' });
      },
      onError: (e: any) => toast({ title: 'Error', description: e?.message || 'No se pudo eliminar el lead.', variant: 'destructive' }),
    });
  };

  if (isLoading) return <div className="text-muted-foreground">Cargando...</div>;

  const contactLabel = (c: any) => `${c.firstName || ''} ${c.lastName || ''}`.trim() + (c.email ? ` (${c.email})` : '');

  const LeadFields = ({ isEdit }: { isEdit: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2 col-span-2">
          <Label>Título</Label>
          <Input placeholder="Ej: Implementación ERP" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Contacto</Label>
          <Select value={form.contactId || 'none'} onValueChange={(v) => setForm({ ...form, contactId: v === 'none' ? '' : v })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar contacto existente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Crear nuevo contacto —</SelectItem>
              {contacts.map((c: any) => (
                <SelectItem key={c.id} value={c.id}>{contactLabel(c)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!form.contactId && !isEdit && (
          <>
            <div className="space-y-2">
              <Label>Nombre del contacto</Label>
              <Input placeholder="Nombre" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email del contacto</Label>
              <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </>
        )}
        <div className="space-y-2">
          <Label>Valor estimado</Label>
          <Input placeholder="0" type="number" value={form.estimatedValue} onChange={(e) => setForm({ ...form, estimatedValue: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Fuente</Label>
          <Select value={form.source || 'none'} onValueChange={(v) => setForm({ ...form, source: v === 'none' ? '' : v })}>
            <SelectTrigger>
              <SelectValue placeholder="Fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin especificar</SelectItem>
              {SOURCES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Pipeline</Label>
          <Select value={form.pipelineId} onValueChange={(v) => setForm({ ...form, pipelineId: v, stage: '' })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar pipeline" />
            </SelectTrigger>
            <SelectContent>
              {pipelineList.map((p: any) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Etapa</Label>
          <Select value={form.stage || 'auto'} onValueChange={(v) => setForm({ ...form, stage: v === 'auto' ? '' : v })}>
            <SelectTrigger>
              <SelectValue placeholder="Primera etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Primera etapa</SelectItem>
              {stageOptions.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Notas</Label>
          <textarea
            className="flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Notas del lead"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Select value={stage} onValueChange={(v) => { setStage(v); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas las etapas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las etapas</SelectItem>
              {allStages.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="converted">Convertido</SelectItem>
              <SelectItem value="lost">Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Lead</DialogTitle>
              <DialogDescription>Agrega un nuevo lead a tu pipeline</DialogDescription>
            </DialogHeader>
            <LeadFields isEdit={false} />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creando...' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3">Título / Contacto</th>
                <th className="p-3">Empresa</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Etapa</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3">
                    <div className="font-medium">{lead.title || `${lead.contact?.firstName || ''} ${lead.contact?.lastName || ''}`.trim() || 'Sin título'}</div>
                    <div className="text-xs text-muted-foreground">{lead.contact?.email || lead.contact?.firstName || '-'}</div>
                  </td>
                  <td className="p-3">{lead.contact?.company?.name || '-'}</td>
                  <td className="p-3">${Number(lead.estimatedValue || 0).toLocaleString()}</td>
                  <td className="p-3"><Badge variant="outline">{lead.stage}</Badge></td>
                  <td className="p-3">{statusBadge(lead.status)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" title="Ver" onClick={() => setDetailId(lead.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Editar" onClick={() => openEdit(lead)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Eliminar" onClick={() => setDeleteId(lead.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay leads</div>}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total: {total} leads</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
          <span>Página {page}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={leads.length < 10}>Siguiente</Button>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editId} onOpenChange={(o) => { if (!o) { setEditId(null); resetForm(); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
            <DialogDescription>Modifica los datos del lead</DialogDescription>
          </DialogHeader>
          <LeadFields isEdit={true} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditId(null); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      {detailId && <LeadDetailDialog leadId={detailId} onClose={() => setDetailId(null)} />}

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Lead</DialogTitle>
            <DialogDescription>¿Estás seguro de que deseas eliminar este lead? Esta acción no se puede deshacer.</DialogDescription>
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

function LeadDetailDialog({ leadId, onClose }: { leadId: string; onClose: () => void }) {
  const { data: lead } = useLead(leadId);
  const { data: activities } = useLeadActivities(leadId);
  const moveMutation = useMoveLeadStage();
  const convertMutation = useConvertLead();
  const lostMutation = useMarkLeadLost();
  const createActivity = useCreateLeadActivity();
  const { toast } = useToast();

  const [moveStage, setMoveStage] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [activity, setActivity] = useState({ type: 'note', content: '' });

  const stages = stageNames(lead?.pipeline?.stages);
  const acts = Array.isArray(activities) ? activities : [];

  const handleMove = () => {
    if (!moveStage) return;
    moveMutation.mutate({ id: leadId, stage: moveStage }, {
      onSuccess: () => toast({ title: 'Etapa actualizada', description: `Movido a ${moveStage}.` }),
      onError: (e: any) => toast({ title: 'Error', description: e?.message, variant: 'destructive' }),
    });
  };

  const handleConvert = () => {
    convertMutation.mutate(leadId, {
      onSuccess: () => toast({ title: 'Lead convertido', description: 'El contacto ahora es cliente.' }),
      onError: (e: any) => toast({ title: 'Error', description: e?.message, variant: 'destructive' }),
    });
  };

  const handleLost = () => {
    lostMutation.mutate({ id: leadId, reason: lostReason }, {
      onSuccess: () => toast({ title: 'Lead marcado como perdido' }),
      onError: (e: any) => toast({ title: 'Error', description: e?.message, variant: 'destructive' }),
    });
  };

  const handleAddActivity = () => {
    if (!activity.content) return;
    createActivity.mutate({ leadId, type: activity.type, content: activity.content }, {
      onSuccess: () => {
        setActivity({ type: 'note', content: '' });
        toast({ title: 'Actividad registrada' });
      },
      onError: (e: any) => toast({ title: 'Error', description: e?.message, variant: 'destructive' }),
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{lead?.title || `${lead?.contact?.firstName || ''} ${lead?.contact?.lastName || ''}`.trim() || 'Lead'}</DialogTitle>
          <DialogDescription>
            {statusBadge(lead?.status || 'active')} · Etapa: {lead?.stage} · ${Number(lead?.estimatedValue || 0).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm">
            <p><span className="text-muted-foreground">Contacto:</span> {lead?.contact ? `${lead.contact.firstName || ''} ${lead.contact.lastName || ''}`.trim() : '-'}</p>
            <p><span className="text-muted-foreground">Email:</span> {lead?.contact?.email || '-'}</p>
            <p><span className="text-muted-foreground">Fuente:</span> {lead?.source || '-'}</p>
            {lead?.notes && <p><span className="text-muted-foreground">Notas:</span> {lead.notes}</p>}
          </div>

          {lead?.status === 'active' && (
            <div className="space-y-2 rounded-md border p-3">
              <Label>Acciones</Label>
              <div className="flex items-center gap-2">
                <Select value={moveStage} onValueChange={setMoveStage}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Mover a etapa..." /></SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={handleMove} disabled={moveMutation.isPending}>
                  <ArrowRightCircle className="mr-1 h-4 w-4" />Mover
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleConvert} disabled={convertMutation.isPending || !lead?.contactId}>
                  <UserCheck className="mr-1 h-4 w-4" />Convertir a cliente
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Motivo de pérdida" value={lostReason} onChange={(e) => setLostReason(e.target.value)} />
                <Button size="sm" variant="destructive" onClick={handleLost} disabled={lostMutation.isPending}>
                  <XCircle className="mr-1 h-4 w-4" />Perdido
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Actividades</Label>
            <div className="flex items-center gap-2">
              <Select value={activity.type} onValueChange={(v) => setActivity({ ...activity, type: v })}>
                <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Nota</SelectItem>
                  <SelectItem value="call">Llamada</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Reunión</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Contenido" value={activity.content} onChange={(e) => setActivity({ ...activity, content: e.target.value })} />
              <Button size="sm" onClick={handleAddActivity} disabled={createActivity.isPending}>Agregar</Button>
            </div>
            <div className="space-y-2 pt-2">
              {acts.length === 0 && <p className="text-sm text-muted-foreground">Sin actividades registradas.</p>}
              {acts.map((a: any) => (
                <div key={a.id} className="rounded-md border p-2 text-sm">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{a.type}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(a.occurredAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-1">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
