'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nyvora/ui/components/ui/card';
import { Button } from '@nyvora/ui/components/ui/button';
import { Badge } from '@nyvora/ui/components/ui/badge';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@nyvora/ui/components/ui/dialog';
import { Check, X, Trash2, Plug, RefreshCw, QrCode, Smartphone } from 'lucide-react';
import { ApiKeyGuide } from '@nyvora/ui/components/help/api-key-guide';
import { providerGuides, providerFieldMeta } from '@nyvora/ui/lib/help-content';
import {
  useIntegrations,
  useUpsertIntegration,
  useTestIntegration,
  useDeleteIntegration,
  useWhatsappSession,
  useStartWhatsappSession,
  useLogoutWhatsappSession,
  type IntegrationCredential,
} from '@/lib/hooks';

interface ProviderDef {
  provider: string;
  guideKey: string;
  name: string;
  description: string;
  icon: string;
}

const PROVIDERS: ProviderDef[] = [
  { provider: 'resend', guideKey: 'resend', name: 'Resend', description: 'Email transaccional y campañas', icon: '📧' },
  { provider: 'sendgrid', guideKey: 'sendgrid', name: 'SendGrid', description: 'Email transaccional y campañas', icon: '✉️' },
  { provider: 'slack', guideKey: 'slack', name: 'Slack', description: 'Notificaciones a canales de Slack', icon: '💬' },
  { provider: 'twilio', guideKey: 'twilio', name: 'Twilio SMS', description: 'Envío de SMS global', icon: '📱' },
  { provider: 'whatsapp', guideKey: 'meta-whatsapp', name: 'WhatsApp Cloud API', description: 'API oficial de WhatsApp (Meta)', icon: '🟢' },
];

function fieldsFor(guideKey: string): string[] {
  return providerGuides[guideKey]?.fields ?? ['apiKey'];
}

export default function IntegrationsPage() {
  const { data: integrationsData, isLoading } = useIntegrations();
  const upsert = useUpsertIntegration();
  const test = useTestIntegration();
  const remove = useDeleteIntegration();

  const credentials = integrationsData?.data ?? [];
  const byProvider = React.useMemo(() => {
    const map: Record<string, IntegrationCredential> = {};
    credentials.forEach((c) => { map[c.provider] = c; });
    return map;
  }, [credentials]);

  const [active, setActive] = React.useState<ProviderDef | null>(null);
  const [fields, setFields] = React.useState<Record<string, string>>({});
  const [testResult, setTestResult] = React.useState<{ ok: boolean; error?: string } | null>(null);

  const openConfig = (def: ProviderDef) => {
    setActive(def);
    setTestResult(null);
    const existing = byProvider[def.provider];
    const initial: Record<string, string> = {};
    fieldsFor(def.guideKey).forEach((k) => {
      initial[k] = existing?.fields?.[k] && !existing.fields[k].includes('*') ? existing.fields[k] : '';
    });
    setFields(initial);
  };

  const handleSave = async () => {
    if (!active) return;
    const cleaned = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v && v.trim() !== ''),
    );
    if (Object.keys(cleaned).length === 0) return;
    await upsert.mutateAsync({ provider: active.provider, data: cleaned });
    setActive(null);
  };

  const handleTest = async (provider: string) => {
    setTestResult(null);
    try {
      const res = await test.mutateAsync(provider);
      setTestResult({ ok: res.ok, error: res.error });
    } catch (e: any) {
      setTestResult({ ok: false, error: e?.message || 'Error' });
    }
  };

  const handleDelete = async (provider: string) => {
    await remove.mutateAsync(provider);
    setActive(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Integraciones de mensajería</h2>
        <p className="text-sm text-muted-foreground">
          Conecta tus proveedores de email, SMS y WhatsApp. Las credenciales se guardan cifradas y se usan en campañas y automatizaciones.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse"><CardHeader><div className="h-12 bg-muted rounded" /></CardHeader></Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROVIDERS.map((def) => {
            const cred = byProvider[def.provider];
            return (
              <Card key={def.provider}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-2xl">{def.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{def.name}</CardTitle>
                      {cred ? (
                        cred.lastTestOk === true ? (
                          <Badge variant="secondary" className="mt-1 gap-1"><Check className="h-3 w-3" /> Conectado</Badge>
                        ) : cred.lastTestOk === false ? (
                          <Badge variant="destructive" className="mt-1 gap-1"><X className="h-3 w-3" /> Error</Badge>
                        ) : (
                          <Badge variant="outline" className="mt-1">Configurado</Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="mt-1">Sin configurar</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription>{def.description}</CardDescription>
                  <div className="flex gap-2">
                    <Button size="sm" variant={cred ? 'outline' : 'default'} onClick={() => openConfig(def)}>
                      <Plug className="mr-1 h-4 w-4" />
                      {cred ? 'Editar' : 'Conectar'}
                    </Button>
                    {cred && (
                      <Button size="sm" variant="outline" onClick={() => handleTest(def.provider)} disabled={test.isPending}>
                        <RefreshCw className={`mr-1 h-4 w-4 ${test.isPending ? 'animate-spin' : ''}`} />
                        Probar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <WhatsappWebCard />

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Conectar {active?.name}</DialogTitle>
            <DialogDescription>
              Ingresa las credenciales reales del proveedor. Se guardan cifradas (AES-256).
            </DialogDescription>
          </DialogHeader>

          {active ? <ApiKeyGuide provider={active.guideKey} defaultOpen /> : null}

          <div className="space-y-3 py-2">
            {active &&
              fieldsFor(active.guideKey).map((key) => {
                const meta = providerFieldMeta[key] ?? { label: key };
                return (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={`int-${key}`}>{meta.label}</Label>
                    <Input
                      id={`int-${key}`}
                      type={meta.secret ? 'password' : 'text'}
                      autoComplete="off"
                      placeholder={meta.placeholder}
                      value={fields[key] || ''}
                      onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                );
              })}
          </div>

          {testResult && (
            <div className={`rounded-md p-3 text-sm ${testResult.ok ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
              {testResult.ok ? 'Conexión exitosa.' : `Error: ${testResult.error}`}
            </div>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              {active && byProvider[active.provider] && (
                <>
                  <Button variant="outline" onClick={() => active && handleTest(active.provider)} disabled={test.isPending}>
                    <RefreshCw className={`mr-1 h-4 w-4 ${test.isPending ? 'animate-spin' : ''}`} />
                    Probar
                  </Button>
                  <Button variant="outline" onClick={() => active && handleDelete(active.provider)} disabled={remove.isPending}>
                    <Trash2 className="mr-1 h-4 w-4" />
                    Eliminar
                  </Button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActive(null)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={upsert.isPending}>
                {upsert.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WhatsappWebCard() {
  const [polling, setPolling] = React.useState(false);
  const { data: session } = useWhatsappSession(polling);
  const start = useStartWhatsappSession();
  const logout = useLogoutWhatsappSession();

  React.useEffect(() => {
    if (session?.status === 'qr' || session?.status === 'connecting') setPolling(true);
    if (session?.status === 'connected' || session?.status === 'disconnected') setPolling(false);
  }, [session?.status]);

  const handleConnect = async () => {
    setPolling(true);
    await start.mutateAsync();
  };

  const status = session?.status ?? 'disconnected';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-2xl">📲</div>
          <div className="flex-1">
            <CardTitle className="text-base">WhatsApp Web (QR)</CardTitle>
            <CardDescription>Conecta tu número escaneando un código QR, sin API de Meta.</CardDescription>
          </div>
          {status === 'connected' ? (
            <Badge variant="secondary" className="gap-1"><Check className="h-3 w-3" /> Conectado</Badge>
          ) : status === 'qr' ? (
            <Badge variant="outline" className="gap-1"><QrCode className="h-3 w-3" /> Escanea el QR</Badge>
          ) : status === 'connecting' ? (
            <Badge variant="outline" className="gap-1"><RefreshCw className="h-3 w-3 animate-spin" /> Conectando</Badge>
          ) : (
            <Badge variant="outline">Desconectado</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'qr' && session?.qr && (
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={session.qr} alt="Código QR de WhatsApp" className="h-56 w-56 rounded-md border bg-white p-2" />
            <p className="text-sm text-muted-foreground">
              Abre WhatsApp → Dispositivos vinculados → Vincular un dispositivo, y escanea este código.
            </p>
          </div>
        )}

        {status === 'connected' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="h-4 w-4" />
            {session?.phoneNumber ? `Conectado como ${session.phoneNumber}` : 'Sesión activa'}
          </div>
        )}

        <div className="flex gap-2">
          {status === 'connected' ? (
            <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending}>
              <Trash2 className="mr-1 h-4 w-4" />
              Desvincular
            </Button>
          ) : (
            <Button size="sm" onClick={handleConnect} disabled={start.isPending || status === 'connecting'}>
              <QrCode className="mr-1 h-4 w-4" />
              {status === 'qr' ? 'Regenerar QR' : start.isPending ? 'Iniciando...' : 'Conectar WhatsApp'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
