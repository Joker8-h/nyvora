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
  DialogClose,
  DialogFooter,
} from '@nyvora/ui/components/ui/dialog';
import {
  Puzzle,
  Search,
  Download,
  Check,
  X,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useMarketplaceCatalog, useInstallApp, useUninstallApp, useUpdateAppConfig } from '@/lib/hooks';
import { ApiKeyGuide } from '@nyvora/ui/components/help/api-key-guide';
import { marketplaceAppGuides, providerGuides, providerFieldMeta } from '@nyvora/ui/lib/help-content';

const TUTORIAL_KEY = 'marketplace-tutorial-seen';

const GENERIC_CONFIG_FIELDS = ['webhookUrl', 'apiKey', 'token'];

function getConfigFieldKeys(appId: string): string[] {
  const provider = marketplaceAppGuides[appId]?.provider;
  const fields = provider ? providerGuides[provider]?.fields : undefined;
  return fields && fields.length ? fields : GENERIC_CONFIG_FIELDS;
}

const tutorialSteps = [
  {
    title: 'Explora las integraciones disponibles',
    description: 'Navega por el catálogo de aplicaciones y encuentra las integraciones que mejor se adapten a tu negocio.',
  },
  {
    title: 'Instala la que necesites con un clic',
    description: 'Haz clic en "Instalar" para conectar una aplicación al instante. Sin configuración complicada.',
  },
  {
    title: 'Configura y conecta con tus herramientas',
    description: 'Una vez instalada, configura cada integración para que funcione exactamente como necesitas.',
  },
];

export default function MarketplacePage() {
  const [search, setSearch] = React.useState('');
  const [showTutorial, setShowTutorial] = React.useState(false);
  const [tutorialStep, setTutorialStep] = React.useState(0);

  const { data: apps, isLoading } = useMarketplaceCatalog();
  const installApp = useInstallApp();
  const uninstallApp = useUninstallApp();
  const updateAppConfig = useUpdateAppConfig();

  const [configApp, setConfigApp] = React.useState<any>(null);
  const [configFields, setConfigFields] = React.useState<Record<string, string>>({});

  const handleOpenConfig = (app: any) => {
    setConfigApp(app);
    const initial: Record<string, string> = {};
    getConfigFieldKeys(app.id).forEach((key) => {
      initial[key] = app.config?.[key] || '';
    });
    setConfigFields(initial);
  };

  const handleSaveConfig = async () => {
    if (!configApp?.installationId) return;
    const cleaned = Object.fromEntries(
      Object.entries(configFields).filter(([, v]) => v && v.trim() !== '')
    );
    try {
      await updateAppConfig.mutateAsync({ id: configApp.installationId, config: cleaned });
      setConfigApp(null);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  React.useEffect(() => {
    const seen = localStorage.getItem(TUTORIAL_KEY);
    if (!seen) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialClose = () => {
    setShowTutorial(false);
    setTutorialStep(0);
    localStorage.setItem(TUTORIAL_KEY, 'true');
  };

  const handleTutorialNext = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep((s) => s + 1);
    } else {
      handleTutorialClose();
    }
  };

  const handleTutorialPrev = () => {
    if (tutorialStep > 0) {
      setTutorialStep((s) => s - 1);
    }
  };

  const handleInstall = async (appId: string) => {
    try {
      await installApp.mutateAsync({ appId });
    } catch (error) {
      console.error('Error installing app:', error);
    }
  };

  const handleUninstall = async (appId: string) => {
    try {
      await uninstallApp.mutateAsync(appId);
    } catch (error) {
      console.error('Error uninstalling app:', error);
    }
  };

  const appList = apps ?? [];

  const filteredApps = appList.filter(
    (app: any) =>
      app.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.description?.toLowerCase().includes(search.toLowerCase()) ||
      app.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">
          Extiende Nexora con aplicaciones y integraciones
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar aplicaciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-10 bg-muted rounded" />
                <div className="h-8 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app: any) => (
            <Card key={app.id} className="relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                    {app.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                    <Badge variant={app.pricing === 'free' ? 'secondary' : 'default'} className="mt-1">
                      {app.pricing === 'free' ? 'Gratis' : 'Premium'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{app.description}</CardDescription>
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-muted-foreground">{app.category}</span>
                   {app.installed ? (
                     <div className="flex items-center gap-2">
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => handleOpenConfig(app)}
                       >
                         Configurar
                       </Button>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => handleUninstall(app.id)}
                         disabled={uninstallApp.isPending}
                       >
                         <Trash2 className="mr-1 h-4 w-4" />
                         {uninstallApp.isPending ? 'Desinstalando...' : 'Desinstalar'}
                       </Button>
                     </div>
                   ) : (
                     <Button
                       size="sm"
                       onClick={() => handleInstall(app.id)}
                       disabled={installApp.isPending}
                     >
                       <Download className="mr-1 h-4 w-4" />
                       {installApp.isPending ? 'Instalando...' : 'Instalar'}
                     </Button>
                   )}
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredApps.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Puzzle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No se encontraron aplicaciones</h3>
            <p className="text-sm text-muted-foreground">
              Intenta con otros términos de búsqueda
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!configApp} onOpenChange={(open) => !open && setConfigApp(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar {configApp?.name}</DialogTitle>
            <DialogDescription>
              Ingresa las credenciales reales de la integración. Estos datos se usan cuando las automatizaciones ejecutan acciones de esta app.
            </DialogDescription>
          </DialogHeader>

          {configApp && marketplaceAppGuides[configApp.id]?.provider ? (
            <ApiKeyGuide provider={marketplaceAppGuides[configApp.id].provider} defaultOpen />
          ) : null}

          {configApp && marketplaceAppGuides[configApp.id]?.howToUse ? (
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="mb-1.5 text-sm font-medium">Como usar esta app</p>
              <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                {marketplaceAppGuides[configApp.id].howToUse.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="space-y-3 py-2">
            {configApp &&
              getConfigFieldKeys(configApp.id).map((key) => {
                const meta = providerFieldMeta[key] ?? { label: key };
                return (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={`cfg-${key}`}>{meta.label}</Label>
                    <Input
                      id={`cfg-${key}`}
                      type={meta.secret ? 'password' : 'text'}
                      autoComplete="off"
                      placeholder={meta.placeholder}
                      value={configFields[key] || ''}
                      onChange={(e) => setConfigFields((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                );
              })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigApp(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveConfig} disabled={updateAppConfig.isPending}>
              {updateAppConfig.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTutorial} onOpenChange={(open) => !open && handleTutorialClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Como conectar integraciones
            </DialogTitle>
            <DialogDescription>
              Sigue estos pasos para comenzar a usar el Marketplace
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {tutorialStep + 1}
                </div>
                <div>
                  <h4 className="font-medium">{tutorialSteps[tutorialStep].title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tutorialSteps[tutorialStep].description}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-1">
                {tutorialSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-colors ${
                      i === tutorialStep ? 'bg-primary w-6' : 'bg-muted w-1.5'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {tutorialStep > 0 && (
                  <Button variant="outline" size="sm" onClick={handleTutorialPrev}>
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Anterior
                  </Button>
                )}
                <Button size="sm" onClick={handleTutorialNext}>
                  {tutorialStep < tutorialSteps.length - 1 ? (
                    <>
                      Siguiente
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    'Entendido'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
