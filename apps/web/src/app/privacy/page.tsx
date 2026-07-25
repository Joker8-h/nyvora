import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, Server, UserCheck } from 'lucide-react';
import { Button } from '@nyvora/ui/components/ui/button';

export const metadata = {
  title: 'Política de Privacidad | Nyvora AI-First BOS',
  description: 'Política de Privacidad y Protección de Datos de Nyvora Business Operating System.',
};

export default function PrivacyPage() {
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
              Política de Privacidad
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Protección de Datos Nivel Enterprise
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6 bg-gradient-to-b from-primary/10 via-background to-background text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-3">
            Política de Privacidad y Seguridad
          </h1>
          <p className="text-muted-foreground text-lg">
            En Nyvora, la privacidad y protección de los datos de tu empresa son nuestra máxima prioridad. Conoce cómo tratamos y resguardamos tu información.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Section 1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              <Database className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Información que Recopilamos</h2>
          </div>
          <div className="pl-11 space-y-3 text-muted-foreground leading-relaxed">
            <p>Para brindarte el servicio de gestión empresarial e IA, recopilamos:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Datos de Cuenta</strong>: Nombre, correo electrónico, cargo y contraseña encriptada (Argon2).</li>
              <li><strong>Datos de Organización</strong>: Razón social, moneda, sucursales y configuración del sistema.</li>
              <li><strong>Datos Operativos</strong>: Contactos de CRM, productos de inventario, facturas y transacciones financieras registradas por tu equipo.</li>
              <li><strong>Interacciones con Nova AI</strong>: Prompts e historial de conversación procesado por nuestros modelos de IA para brindarte asistencia.</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Cifrado y Seguridad de la Información</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-11">
            Toda la información transmitida entre tu navegador y nuestros servidores utiliza cifrado SSL/TLS de 256 bits. Los datos sensibles guardados en nuestras bases de datos son protegidos mediante algoritmos de encriptación de grado bancario (AES-256 y Argon2id para credenciales).
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Uso Ético de la Inteligencia Artificial</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-11">
            Los datos e información privada de tu empresa <strong>NUNCA</strong> son utilizados para entrenar modelos públicos de inteligencia artificial de terceros. El contexto procesado por Nova AI es de uso exclusivo y aislado para tu organización.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              <UserCheck className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Derechos del Usuario (ARCO / GDPR)</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-11">
            Tienes derecho en cualquier momento a acceder, rectificar, exportar o solicitar la eliminación total de la base de datos de tu organización a través del panel de configuración o contactando a nuestro equipo de privacidad.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-card/30 text-center text-sm text-muted-foreground">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Nyvora. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground">Términos</Link>
            <Link href="/support" className="hover:text-foreground">Soporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
