'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nyvora/ui/components/ui/card';
import { Button } from '@nyvora/ui/components/ui/button';
import { NovaInput } from '@nyvora/ui/components/nova/nova-input';
import {
  Users,
  FileText,
  Bot,
  Package,
  Briefcase,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import Link from 'next/link';
import { useContacts, useInvoices, useProducts, useEmployees } from '@/lib/hooks';

const ONBOARDING_KEY = 'nyvora-onboarding-completed';

export default function HomePage() {
  const { data: contactsData } = useContacts({ limit: 1 });
  const { data: invoicesData } = useInvoices({ limit: 1 });
  const { data: productsData } = useProducts({ limit: 1 });
  const { data: employeesData } = useEmployees({ limit: 1 });
  const [onboardingCompleted, setOnboardingCompleted] = React.useState(false);

  React.useEffect(() => {
    setOnboardingCompleted(localStorage.getItem(ONBOARDING_KEY) === 'true');
  }, []);

  const handleNovaSend = async (message: string) => {
    window.location.href = `/nova?q=${encodeURIComponent(message)}`;
  };

  const onboardingSteps = [
    { label: 'Explora los modulos', done: true },
    { label: 'Crea tu primer contacto', done: (contactsData?.total || 0) > 0 },
    { label: 'Registra un producto', done: (productsData?.total || 0) > 0 },
    { label: 'Crea una factura', done: (invoicesData?.total || 0) > 0 },
    { label: 'Agrega un empleado', done: (employeesData?.total || 0) > 0 },
  ];

  const stats = [
    {
      title: 'Contactos CRM',
      value: String(contactsData?.total || 0),
      icon: Users,
      href: '/crm/contacts',
    },
    {
      title: 'Facturas',
      value: String(invoicesData?.total || 0),
      icon: FileText,
      href: '/sales/invoices',
    },
    {
      title: 'Productos',
      value: String(productsData?.total || 0),
      icon: Package,
      href: '/inventory/products',
    },
    {
      title: 'Empleados',
      value: String(employeesData?.total || 0),
      icon: Briefcase,
      href: '/hr/employees',
    },
  ];

  const quickActions = [
    { label: 'Crear Contacto', href: '/crm/contacts' },
    { label: 'Nueva Factura', href: '/sales/invoices' },
    { label: 'Ver Reportes', href: '/finance/reports' },
    { label: 'Agregar Producto', href: '/inventory/products' },
    { label: 'Gestionar Equipo', href: '/hr/employees' },
    { label: 'Configuración', href: '/settings/organization' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de tu negocio
        </p>
      </div>

      {!onboardingCompleted && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Bienvenido a Nyvora</CardTitle>
            <CardDescription>
              Completa estos pasos para empezar a usar la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onboardingSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  {step.done ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={step.done ? 'text-muted-foreground line-through' : ''}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                localStorage.setItem(ONBOARDING_KEY, 'true');
                setOnboardingCompleted(true);
              }}
            >
              Ocultar checklist
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-background">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>¿Qué quieres hacer hoy?</CardTitle>
              <CardDescription>
                Pregúntale a Nova o elige una acción rápida
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <NovaInput
            onSend={handleNovaSend}
            placeholder="Ej: Crear una factura para Juan Pérez..."
          />
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button key={action.label} variant="outline" size="sm" asChild>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Módulos</CardTitle>
          <CardDescription>Accede a todas las áreas de tu negocio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'CRM', href: '/crm/contacts', description: 'Contactos, empresas, leads' },
              { label: 'Ventas', href: '/sales/quotations', description: 'Cotizaciones, órdenes, facturas' },
              { label: 'Inventario', href: '/inventory/products', description: 'Productos, almacenes, stock' },
              { label: 'Finanzas', href: '/finance/accounts', description: 'Cuentas, transacciones, reportes' },
              { label: 'Recursos Humanos', href: '/hr/employees', description: 'Empleados, ausencias, evaluaciones' },
              { label: 'Configuración', href: '/settings/organization', description: 'Organización, usuarios, sucursales' },
            ].map((module) => (
              <Link key={module.label} href={module.href}>
                <div className="rounded-lg border p-4 hover:bg-accent transition-colors cursor-pointer">
                  <h3 className="font-medium">{module.label}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
