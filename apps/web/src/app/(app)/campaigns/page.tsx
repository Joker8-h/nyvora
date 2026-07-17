'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@nyvora/ui/components/ui/card';
import { Button } from '@nyvora/ui/components/ui/button';
import { Badge } from '@nyvora/ui/components/ui/badge';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import { Progress } from '@nyvora/ui/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nyvora/ui/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@nyvora/ui/components/ui/dialog';
import { Send, Plus, Trash2, Megaphone, Play, Users, Clock } from 'lucide-react';
import {
  useCampaigns,
  useCreateCampaign,
  useStartCampaign,
  useDeleteCampaign,
  useCampaign,
  type Campaign,
} from '@/lib/hooks';

const CHANNELS = [
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'slack', label: 'Slack' },
];

const STATUS_META: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', variant: 'outline' },
  sending: { label: 'Enviando', variant: 'default' },
  completed: { label: 'Completada', variant: 'secondary' },
  completed_with_errors: { label: 'Completada con errores', variant: 'destructive' },
};

export default function CampaignsPage() {
  const { data, isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const deleteCampaign = useDeleteCampaign();

  const [showCreate, setShowCreate] = React.useState(false);
  const [startTarget, setStartTarget] = React.useState<Campaign | null>(null);
  const [detailId, setDetailId] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: '',
    channel: 'email',
    subject: '',
    body: '',
    delaySeconds: 5,
  });

  const resetForm = () => setForm({ name: '', channel: 'email', subject: '', body: '', delaySeconds: 5 });

  const handleCreate = async () => {
    if (!form.name.trim() || !form.body.trim()) return;
    await createCampaign.mutateAsync({
      name: form.name.trim(),
      channel: form.channel,
      subject: form.channel === 'email' ? form.subject : undefined,
      body: form.body,
      delayMs: Math.max(4000, form.delaySeconds * 1000),
    });
    resetForm();
    setShowCreate(false);
  };

  const campaigns = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campañas</h1>
          <p className="text-muted-foreground">Envía mensajes masivos por email, WhatsApp, SMS o Slack</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-1 h-4 w-4" /> Nueva campaña
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse"><CardHeader><div className="h-16 bg-muted rounded" /></CardHeader></Card>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aún no tienes campañas</h3>
            <p className="text-sm text-muted-foreground mb-4">Crea tu primera campaña para llegar a tus contactos.</p>
            <Button onClick={() => setShowCreate(true)}><Plus className="mr-1 h-4 w-4" /> Nueva campaña</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((c) => {
            const meta = STATUS_META[c.status] ?? { label: c.status, variant: 'outline' as const };
            const done = c.sentCount + c.failedCount;
            const pct = c.totalCount > 0 ? Math.round((done / c.totalCount) * 100) : 0;
            return (
              <Card key={c.id} className="cursor-pointer transition-colors hover:border-primary/50" onClick={() => setDetailId(c.id)}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{c.name}</CardTitle>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{c.channel}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {Math.round(c.delayMs / 1000)}s</span>
                      </div>
                    </div>
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{c.body}</p>

                  {c.status !== 'draft' && (
                    <div className="space-y-1">
                      <Progress value={pct} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{c.sentCount} enviados · {c.failedCount} fallidos</span>
                        <span>{done}/{c.totalCount}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {(c.status === 'draft' || c.status === 'completed' || c.status === 'completed_with_errors') && (
                      <Button size="sm" onClick={() => setStartTarget(c)}>
                        <Play className="mr-1 h-4 w-4" /> {c.status === 'draft' ? 'Iniciar' : 'Reenviar'}
                      </Button>
                    )}
                    {c.status !== 'sending' && (
                      <Button size="sm" variant="outline" onClick={() => deleteCampaign.mutate(c.id)} disabled={deleteCampaign.isPending}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Crear */}
      <Dialog open={showCreate} onOpenChange={(o) => { if (!o) { setShowCreate(false); resetForm(); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva campaña</DialogTitle>
            <DialogDescription>Define el mensaje. Usa <code className="rounded bg-muted px-1">{'{{name}}'}</code> para personalizar con el nombre del contacto.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="c-name">Nombre</Label>
              <Input id="c-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Promo de verano" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Canal</Label>
                <Select value={form.channel} onValueChange={(v) => setForm((f) => ({ ...f, channel: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map((ch) => <SelectItem key={ch.value} value={ch.value}>{ch.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="c-delay">Retraso entre envíos (s)</Label>
                <Input id="c-delay" type="number" min={4} value={form.delaySeconds} onChange={(e) => setForm((f) => ({ ...f, delaySeconds: Number(e.target.value) }))} />
              </div>
            </div>
            {form.channel === 'email' && (
              <div className="space-y-1">
                <Label htmlFor="c-subject">Asunto</Label>
                <Input id="c-subject" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Novedades de este mes" />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="c-body">Mensaje</Label>
              <textarea
                id="c-body"
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                placeholder="Hola {{name}}, tenemos algo especial para ti..."
                rows={5}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createCampaign.isPending || !form.name.trim() || !form.body.trim()}>
              {createCampaign.isPending ? 'Creando...' : 'Crear borrador'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Iniciar */}
      <StartDialog campaign={startTarget} onClose={() => setStartTarget(null)} />

      {/* Detalle */}
      <DetailDialog id={detailId} onClose={() => setDetailId(null)} />
    </div>
  );
}

function StartDialog({ campaign, onClose }: { campaign: Campaign | null; onClose: () => void }) {
  const startCampaign = useStartCampaign();
  const [audience, setAudience] = React.useState('crm_all');
  const [customText, setCustomText] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (campaign) { setAudience('crm_all'); setCustomText(''); setError(null); }
  }, [campaign]);

  const parseRecipients = () => {
    return customText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [to, ...rest] = line.split(',');
        return { to: to.trim(), name: rest.join(',').trim() || undefined };
      })
      .filter((r) => r.to);
  };

  const handleStart = async () => {
    if (!campaign) return;
    setError(null);
    const recipients = audience === 'custom' ? parseRecipients() : undefined;
    if (audience === 'custom' && (!recipients || recipients.length === 0)) {
      setError('Agrega al menos un destinatario.');
      return;
    }
    try {
      await startCampaign.mutateAsync({ id: campaign.id, recipients });
      onClose();
    } catch (e: any) {
      setError(e?.message || 'No se pudo iniciar la campaña');
    }
  };

  return (
    <Dialog open={!!campaign} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Iniciar «{campaign?.name}»</DialogTitle>
          <DialogDescription>Elige a quién enviar. El envío respeta el retraso configurado ({campaign ? Math.round(campaign.delayMs / 1000) : 0}s entre mensajes).</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label>Audiencia</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="crm_all">Todos los contactos del CRM</SelectItem>
                <SelectItem value="custom">Lista personalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {audience === 'crm_all' && (
            <p className="flex items-center gap-2 rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Se usará el {campaign?.channel === 'email' ? 'email' : 'teléfono'} de cada contacto del CRM.
            </p>
          )}
          {audience === 'custom' && (
            <div className="space-y-1">
              <Label htmlFor="s-recipients">Destinatarios (uno por línea: destino,nombre)</Label>
              <textarea
                id="s-recipients"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={6}
                placeholder={campaign?.channel === 'email' ? 'ana@correo.com,Ana\nbeto@correo.com,Beto' : '+521234567890,Ana\n+521234567891,Beto'}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          )}
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleStart} disabled={startCampaign.isPending}>
            <Send className="mr-1 h-4 w-4" />
            {startCampaign.isPending ? 'Iniciando...' : 'Enviar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { data: campaign } = useCampaign(id || '', true);
  const isSending = campaign?.status === 'sending';
  const done = (campaign?.sentCount ?? 0) + (campaign?.failedCount ?? 0);
  const pct = campaign && campaign.totalCount > 0 ? Math.round((done / campaign.totalCount) * 100) : 0;

  return (
    <Dialog open={!!id} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{campaign?.name || 'Campaña'}</DialogTitle>
          <DialogDescription>
            {campaign?.status && (STATUS_META[campaign.status]?.label ?? campaign.status)}
            {isSending ? ' · actualizando en vivo…' : ''}
          </DialogDescription>
        </DialogHeader>
        {campaign && (
          <div className="space-y-4">
            {campaign.status !== 'draft' && (
              <div className="space-y-1">
                <Progress value={pct} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{campaign.sentCount} enviados · {campaign.failedCount} fallidos</span>
                  <span>{done}/{campaign.totalCount}</span>
                </div>
              </div>
            )}
            {campaign.messages && campaign.messages.length > 0 ? (
              <div className="max-h-72 space-y-1 overflow-y-auto rounded-md border p-2">
                {campaign.messages.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-2 border-b py-1.5 text-sm last:border-0">
                    <span className="truncate">{m.recipient}</span>
                    <Badge variant={m.status === 'sent' ? 'secondary' : m.status === 'failed' ? 'destructive' : 'outline'}>
                      {m.status === 'sent' ? 'Enviado' : m.status === 'failed' ? 'Fallido' : 'Pendiente'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Esta campaña aún no se ha enviado.</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
