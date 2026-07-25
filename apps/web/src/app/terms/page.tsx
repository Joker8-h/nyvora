import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, Scale, Lock, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@nyvora/ui/components/ui/button';

export const metadata = {
  title: 'Términos de Servicio | Nyvora AI-First BOS',
  description: 'Términos y condiciones de uso de la plataforma Nyvora Business Operating System.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
            <span className="font-semibold text-lg border-l pl-3 border-border">
              Términos de Servicio
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Última actualización: Julio 2026
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6 bg-gradient-to-b from-primary/10 via-background to-background text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-3">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-muted-foreground text-lg">
            Bienvenido a Nyvora. Por favor, lee atentamente los siguientes términos que rigen el uso de nuestro Sistema Operativo de Negocios impulsado por IA.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Section 1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              1
            </div>
            <h2 className="text-xl font-bold">Aceptación de los Términos</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-11">
            Al registrarte, acceder o utilizar la plataforma Nyvora (incluyendo sus módulos de CRM, Ventas, Inventario, Finanzas, Recursos Humanos y el Asistente Nova AI), aceptas quedar vinculado legalmente por estos Términos de Servicio y por nuestra Política de Privacidad. Si no estás de acuerdo con alguno de estos términos, no debes utilizar la plataforma.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              2
            </div>
            <h2 className="text-xl font-bold">Descripción del Servicio</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-11">
            Nyvora es un Sistema Operativo Empresarial (BOS) AI-First entregado bajo el modelo Software como Servicio (SaaS). Ofrece soluciones integradas de automatización, análisis predictivo y gestión empresarial delegada a través de agentes de inteligencia artificial.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              3
            </div>
            <h2 className="text-xl font-bold">Cuentas y Seguridad de Acceso</h2>
          </div>
          <div className="pl-11 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Para acceder a la plataforma debes registrarte como usuario y crear una organización. Te comprometes a:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Proporcionar información verdadera, exacta y actualizada durante el registro.</li>
              <li>Mantener la confidencialidad de tus credenciales de acceso y contraseña.</li>
              <li>Notificar de inmediato a Nyvora ante cualquier uso no autorizado de tu cuenta o brecha de seguridad.</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              4
            </div>
            <h2 className="text-xl font-bold">Propiedad Intelectual y Datos Empresariales</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-11">
            Tus datos empresariales pertenecen 100% a tu organización. Nyvora no reclama propiedad sobre la información que subas, almacenes o proceses en la plataforma. Nyvora y sus licenciantes conservan la titularidad exclusiva de todos los derechos de propiedad intelectual del software, código fuente, algoritmos de IA e interfaz de usuario.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              5
            </div>
            <h2 className="text-xl font-bold">Uso Aceptable y Restricciones</h2>
          </div>
          <div className="pl-11 space-y-3 text-muted-foreground leading-relaxed">
            <p>Queda estrictamente prohibido:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Utilizar el servicio para actividades ilegales, fraudulentas o de spam masivo.</li>
              <li>Intentar descompilar, realizar ingeniería inversa o vulnerar los mecanismos de seguridad del sistema.</li>
              <li>Interferir con el rendimiento correcto de la infraestructura cloud o saturar los endpoints de IA.</li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              6
            </div>
            <h2 className="text-xl font-bold">Garantía de Disponibilidad (SLA) y Soporte</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-11">
            Nyvora realiza sus mejores esfuerzos para garantizar una disponibilidad del servicio del 99.9% anual. La plataforma cuenta con mantenimiento continuo y soporte técnico disponible a través del canal oficial de ayuda.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-card/30 text-center text-sm text-muted-foreground">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Nyvora. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacidad</Link>
            <Link href="/support" className="hover:text-foreground">Soporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
