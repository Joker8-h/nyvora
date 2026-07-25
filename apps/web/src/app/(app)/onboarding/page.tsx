'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@nyvora/ui/components/ui/button';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import {
  Loader2,
  Users,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Scissors,
  Store,
  Briefcase,
  Laptop,
  Utensils,
  Building2,
  Bot,
  Zap,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Boxes,
  Receipt,
} from 'lucide-react';
import { useUpdateOrganization, useCreateInvitation, useOrganization } from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';

const steps = [
  { id: 1, title: 'Identidad del Negocio', description: 'Nombre y sector de tu empresa' },
  { id: 2, title: 'Asistente Nova AI', description: 'Configura tus metas operativas' },
  { id: 3, title: 'Tour & Capacidades', description: 'Conoce todo lo que Nyvora puede hacer' },
  { id: 4, title: 'Invitar Equipo', description: 'Agrega a tus colaboradores' },
  { id: 5, title: '¡Listo para Empezar!', description: 'Despega con tu negocio' },
];

const businessTypes = [
  { id: 'barbershop', name: 'Barbería / Salón de Belleza', icon: Scissors, desc: 'Citas, comisiones por corte e inventario de insumos' },
  { id: 'retail', name: 'Tienda / Comercio / E-Commerce', icon: Store, desc: 'Punto de venta, stock de productos y facturación' },
  { id: 'services', name: 'Servicios & Consultoría', icon: Briefcase, desc: 'CRM de clientes, proyectos, cotizaciones y cobros' },
  { id: 'tech', name: 'Tecnología & Software', icon: Laptop, desc: 'Suscripciones, tareas agiles, soporte y finanzas' },
  { id: 'gastronomy', name: 'Gastronomía & Restaurantes', icon: Utensils, desc: 'Inventario de insumos, proveedores y ventas' },
  { id: 'general', name: 'Empresa General / Empresa Tradicional', icon: Building2, desc: 'Módulos completos de ERP para gestión integral' },
];

const goals = [
  { id: 'sales', title: 'Vender y Cobrar Rápido', desc: 'Facturas, cotizaciones y registros de pago en 1 clic', icon: Receipt, module: 'Ventas & Facturación' },
  { id: 'inventory', title: 'Controlar Inventario y Stock', desc: 'Alertas de faltantes y catálogo de productos', icon: Boxes, module: 'Inventario & Almacén' },
  { id: 'crm', title: 'Gestionar Clientes y Citas', desc: 'Fidelización, historial de clientes y agendamiento', icon: Users, module: 'CRM & Calendario' },
  { id: 'finance', title: 'Finanzas y Ganancias Reales', desc: 'Flujo de caja, control de gastos y utilidades', icon: TrendingUp, module: 'Finanzas & Reportes' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);

  // State
  const [orgName, setOrgName] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('barbershop');
  const [selectedGoal, setSelectedGoal] = React.useState('sales');
  const [currency, setCurrency] = React.useState('USD');
  const [emails, setEmails] = React.useState(['']);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const updateOrg = useUpdateOrganization();
  const createInvitation = useCreateInvitation();
  const { data: organization } = useOrganization();

  React.useEffect(() => {
    if (organization?.name && !orgName) setOrgName(organization.name);
  }, [organization, orgName]);

  const handleAddEmail = () => setEmails([...emails, '']);
  const handleEmailChange = (index: number, val: string) => {
    const copy = [...emails];
    copy[index] = val;
    setEmails(copy);
  };
  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (currentStep === 1 && orgName.trim()) {
      try {
        await updateOrg.mutateAsync({
          name: orgName.trim(),
          settings: { businessType: selectedType, currency },
        });
        toast({ title: 'Configuración guardada', description: 'Se actualizó la información básica de tu negocio.' });
      } catch {
        /* ignora error no crítico */
      }
    }
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = async (skip = false) => {
    setIsSubmitting(true);

    if (!skip) {
      if (orgName.trim()) {
        try {
          await updateOrg.mutateAsync({
            name: orgName.trim(),
            settings: {
              businessType: selectedType,
              primaryGoal: selectedGoal,
              currency,
              onboardingCompleted: true,
            },
          });
        } catch {}
      }

      const validEmails = emails.map((e) => e.trim()).filter((e) => e && e.includes('@'));
      if (validEmails.length > 0) {
        try {
          await Promise.all(
            validEmails.map((email) => createInvitation.mutateAsync({ email, role: 'member' }))
          );
          toast({ title: 'Invitaciones enviadas', description: `Enviamos la invitación a ${validEmails.length} miembro(s).` });
        } catch {}
      }
    }

    localStorage.setItem('onboarding_completed', 'true');
    window.location.href = '/home';
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full mb-6">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Asistente de Configuración Nyvora</h1>
              <p className="text-xs text-muted-foreground">Paso {currentStep} de 5: {steps[currentStep - 1].title}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => handleFinish(true)} className="text-muted-foreground text-xs">
            Saltar al Dashboard →
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStep >= step.id ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="bg-card border rounded-2xl p-6 sm:p-10 shadow-xl backdrop-blur-md">
          {/* STEP 1: Business Identity */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="inline-block p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                  <Building2 className="h-8 w-8" />
                </span>
                <h2 className="text-2xl font-bold">Configura la identidad de tu empresa</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Personalizaremos los módulos y plantillas de acuerdo al sector de tu negocio.
                </p>
              </div>

              <div className="space-y-4 max-w-lg mx-auto pt-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name" className="font-semibold">Nombre del Negocio o Razón Social</Label>
                  <Input
                    id="org-name"
                    placeholder="Ej: Barbería El Imperio / Mi Empresa S.A.S"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="h-12 text-base rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="font-semibold">Moneda Principal</Label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-12 rounded-xl border bg-background px-3 text-sm border-input"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="COP">COP ($)</option>
                      <option value="MXN">MXN ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">País / Región</Label>
                    <div className="h-12 border rounded-xl flex items-center px-4 text-sm bg-muted/30">
                      América Latina / Internacional
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="font-semibold">¿A qué sector pertenece tu negocio?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {businessTypes.map((b) => {
                      const Icon = b.icon;
                      const isSelected = selectedType === b.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => setSelectedType(b.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'border-primary bg-primary/10 shadow-sm'
                              : 'hover:border-border/80 hover:bg-muted/50'
                          }`}
                        >
                          <Icon className={`h-6 w-6 shrink-0 mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <div className="font-semibold text-sm">{b.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{b.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Nova AI Assistant Setup */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="inline-block p-3 rounded-2xl bg-purple-500/10 text-purple-500 mb-2">
                  <Bot className="h-8 w-8" />
                </span>
                <h2 className="text-2xl font-bold">Conoce a Nova, tu Co-Piloto de Negocio</h2>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                  Nova es la Inteligencia Artificial integrada que ejecutará tareas operativas por ti (crear productos, facturar, agendar citas y generar reportes).
                </p>
              </div>

              <div className="space-y-3 max-w-lg mx-auto pt-2">
                <Label className="font-semibold text-center block text-sm">
                  ¿Cuál es tu objetivo prioritario para comenzar?
                </Label>

                <div className="grid grid-cols-1 gap-3">
                  {goals.map((g) => {
                    const Icon = g.icon;
                    const isSelected = selectedGoal === g.id;
                    return (
                      <div
                        key={g.id}
                        onClick={() => setSelectedGoal(g.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                            : 'hover:border-border/80 hover:bg-muted/40'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{g.title}</div>
                            <div className="text-xs text-muted-foreground">{g.desc}</div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-primary shrink-0 ml-2" />}
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-600 dark:text-purple-300 flex items-center gap-3 mt-4">
                  <Sparkles className="h-5 w-5 shrink-0" />
                  <span>
                    Nova activará atajos y automatizaciones automáticas para el módulo de <strong>{goals.find(g => g.id === selectedGoal)?.module}</strong>.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Modules Tour & Capabilities */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="inline-block p-3 rounded-2xl bg-blue-500/10 text-blue-500 mb-2">
                  <Zap className="h-8 w-8" />
                </span>
                <h2 className="text-2xl font-bold">Todo lo que puedes hacer en Nyvora</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Tu nuevo Sistema Operativo Empresarial incluye 30+ módulos conectados entre sí.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border bg-card/60 space-y-2">
                  <div className="text-2xl">💈 / 🛍️</div>
                  <h3 className="font-bold text-sm">CRM & Clientes</h3>
                  <p className="text-xs text-muted-foreground">
                    Crea fichas de clientes, guarda preferencias, historial de compras y envía recordatorios automáticos.
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-card/60 space-y-2">
                  <div className="text-2xl">💰 / 🧾</div>
                  <h3 className="font-bold text-sm">Ventas & Facturación</h3>
                  <p className="text-xs text-muted-foreground">
                    Genera cotizaciones, pedidos y facturas electrónicas o comprobantes en segundos.
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-card/60 space-y-2">
                  <div className="text-2xl">📦 / 🧴</div>
                  <h3 className="font-bold text-sm">Inventario & Stock</h3>
                  <p className="text-xs text-muted-foreground">
                    Controla productos de reventa e insumos internos con alertas automáticas de falta de stock.
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-card/60 space-y-2">
                  <div className="text-2xl">📊 / 💳</div>
                  <h3 className="font-bold text-sm">Finanzas & Gastos</h3>
                  <p className="text-xs text-muted-foreground">
                    Supervisa tu flujo de caja, cuentas bancarias, gastos fijos y reporte de Estado de Resultados (P&L).
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-card/60 space-y-2">
                  <div className="text-2xl">👥 / 👔</div>
                  <h3 className="font-bold text-sm">RRHH & Comisiones</h3>
                  <p className="text-xs text-muted-foreground">
                    Administra a tu equipo, calcula comisiones por ventas o servicios y lleva el registro de nómina.
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-card/60 space-y-2">
                  <div className="text-2xl">🤖 / ⚡</div>
                  <h3 className="font-bold text-sm">Nova AI Chat</h3>
                  <p className="text-xs text-muted-foreground">
                    Pídele por voz o texto que ejecute cualquier tarea o reporte sin tener que buscar en menús.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Team Invitations */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="text-center space-y-2">
                <span className="inline-block p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-2">
                  <Users className="h-8 w-8" />
                </span>
                <h2 className="text-2xl font-bold">Conecta a tu Equipo de Trabajo</h2>
                <p className="text-muted-foreground text-sm">
                  Ingresa los correos de tus colaboradores (barberos, vendedores, administradores) para enviarles acceso.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="ejemplo@tuempresa.com"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className="flex-1 h-11"
                    />
                    {emails.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveEmail(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddEmail} className="w-full h-10 gap-2">
                  <Users className="h-4 w-4" />
                  Agregar otro colaborador
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: Final Ready Screen */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center max-w-lg mx-auto py-4">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/20 text-primary text-4xl animate-bounce">
                🎉
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold">¡Todo listo para despegar!</h2>
                <p className="text-muted-foreground text-sm">
                  Hemos personalizado Nyvora para <strong>{orgName || 'tu empresa'}</strong>. Ya puedes comenzar a utilizar todos los módulos e interactuar con Nova AI.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border text-left space-y-3 shadow-inner">
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Organización configurada ({currency})
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Módulos optimizados para {businessTypes.find(b => b.id === selectedType)?.name}
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Nova AI activado en tiempo real
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation Controls */}
      <div className="max-w-4xl mx-auto w-full mt-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </Button>

        {currentStep < 5 ? (
          <Button onClick={handleNext} disabled={updateOrg.isPending} className="gap-2 px-6">
            {updateOrg.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button onClick={() => handleFinish(false)} disabled={isSubmitting} className="gap-2 px-8 h-12 text-base font-bold bg-primary hover:bg-primary/90">
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Entrar al Dashboard Principal
                <Sparkles className="h-5 w-5" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
