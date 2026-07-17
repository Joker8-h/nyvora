'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@nyvora/ui/components/ui/button';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import { Loader2, Users, LayoutDashboard, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useUpdateOrganization, useCreateInvitation, useOrganization } from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';

const steps = [
  { id: 1, title: 'Bienvenida', description: 'Configura tu empresa' },
  { id: 2, title: 'Invitar Equipo', description: 'Conecta con tu equipo' },
  { id: 3, title: 'Tour de Modulos', description: 'Conoce la plataforma' },
];

const modules = [
  { name: 'CRM', description: 'Gestiona contactos, leads y oportunidades', icon: '👥' },
  { name: 'Ventas', description: 'Cotizaciones, ordenes y facturacion', icon: '💰' },
  { name: 'Inventario', description: 'Productos, stock y almacenes', icon: '📦' },
  { name: 'Finanzas', description: 'Cuentas, transacciones y reportes', icon: '📊' },
  { name: 'RRHH', description: 'Empleados, nomina y evaluaciones', icon: '👔' },
  { name: 'Automatizaciones', description: 'Flujos de trabajo inteligentes', icon: '⚡' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [orgName, setOrgName] = React.useState('');
  const [emails, setEmails] = React.useState(['']);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const updateOrg = useUpdateOrganization();
  const createInvitation = useCreateInvitation();
  const { data: organization } = useOrganization();

  React.useEffect(() => {
    if (organization?.name && !orgName) setOrgName(organization.name);
  }, [organization, orgName]);

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (currentStep === 1 && orgName.trim()) {
      try {
        await updateOrg.mutateAsync({ name: orgName.trim() });
        toast({ title: 'Empresa actualizada', description: 'El nombre de tu empresa se ha guardado.' });
      } catch {
        toast({ title: 'Aviso', description: 'No se pudo guardar el nombre, pero puedes continuar.', variant: 'destructive' });
      }
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = async (skipOrEvent?: boolean | React.MouseEvent) => {
    const skip = skipOrEvent === true;
    setIsSubmitting(true);
    if (!skip && orgName.trim()) {
      try {
        await updateOrg.mutateAsync({ name: orgName.trim() });
      } catch {
        /* no bloquea el flujo */
      }
    }
    if (!skip) {
      const validEmails = emails.map((e) => e.trim()).filter((e) => e && e.includes('@'));
      if (validEmails.length > 0) {
        try {
          await Promise.all(
            validEmails.map((email) => createInvitation.mutateAsync({ email, role: 'member' })),
          );
          toast({ title: 'Invitaciones enviadas', description: `${validEmails.length} invitacion(es) enviada(s).` });
        } catch {
          toast({ title: 'Aviso', description: 'No se pudieron enviar las invitaciones.', variant: 'destructive' });
        }
      }
    }
    try {
      await updateOrg.mutateAsync({ settings: { onboardingCompleted: true } });
    } catch {
      /* el flag local ya persiste la intención */
    }
    localStorage.setItem('onboarding_completed', 'true');
    window.location.href = '/home';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    currentStep > step.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : currentStep === step.id
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground/30 text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-24 mx-2 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-bold">{steps[currentStep - 1].title}</h1>
          <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
        </div>

        <div className="bg-card rounded-lg border p-6 min-h-[300px]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-xl font-bold mb-2">Bienvenido a Nyvora</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Tu Business Operating System esta listo. En pocos pasos tendras todo configurado
                  para empezar a gestionar tu empresa de forma inteligente.
                </p>
              </div>
              <div className="grid gap-2 max-w-md mx-auto">
                <Label htmlFor="org-name">Nombre de tu empresa</Label>
                <Input
                  id="org-name"
                  placeholder="Ej: Mi Empresa S.A."
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="font-medium">250+ Pantallas</div>
                  <div className="text-muted-foreground">Funcionalidades completas</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="font-medium">30+ Modulos</div>
                  <div className="text-muted-foreground">Todo lo que necesitas</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="font-medium">IA-First</div>
                  <div className="text-muted-foreground">Automatizacion inteligente</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="font-medium">Seguro</div>
                  <div className="text-muted-foreground">Datos protegidos</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Invita a tu equipo para que empiecen a usar Nyvora. Puedes saltar este paso y hacerlo despues.
              </p>
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="email@empresa.com"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {emails.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveEmail(index)}
                    >
                      X
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddEmail} className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Agregar otro email
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Estos son los modulos disponibles en Nyvora. Exploralos despues desde el sidebar.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {modules.map((mod) => (
                  <div
                    key={mod.name}
                    className="p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="text-2xl mb-2">{mod.icon}</div>
                    <div className="font-medium">{mod.name}</div>
                    <div className="text-xs text-muted-foreground">{mod.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Atras
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleFinish(true)}
              disabled={isSubmitting}
            >
              Omitir
            </Button>
          </div>

          {currentStep < 3 ? (
            <Button onClick={handleNext} disabled={updateOrg.isPending}>
              {updateOrg.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4 ml-2" />
              )}
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Ir al Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
