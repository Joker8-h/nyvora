'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, LifeBuoy, Mail, MessageSquare, BookOpen, CheckCircle, Search, ChevronDown } from 'lucide-react';
import { Button } from '@nyvora/ui/components/ui/button';
import { Input } from '@nyvora/ui/components/ui/input';

const faqs = [
  {
    question: '¿Cómo funciona Nova AI Assistant en Nyvora?',
    answer: 'Nova AI es el asistente inteligente integrado que puede ejecutar tareas directamente por ti en la plataforma (crear leads, proyectos, facturas o consultar finanzas) a través de chat de voz o texto en lenguaje natural.'
  },
  {
    question: '¿Mis datos empresariales están seguros?',
    answer: 'Sí. Todos tus datos están cifrados de extremo a extremo con grado bancario (AES-256) y nunca son compartidos ni utilizados para entrenar modelos públicos de inteligencia artificial.'
  },
  {
    question: '¿Puedo integrar Nyvora con WhatsApp o correo electrónico?',
    answer: 'Sí, a través del módulo de Marketplace e Integraciones puedes conectar canales de atención de WhatsApp Business, pasarelas de pago y proveedores de correos.'
  },
  {
    question: '¿Cómo puedo invitar a los empleados de mi empresa?',
    answer: 'Desde el menú de Configuración de Organización > Usuarios e Invitaciones, puedes enviar invitaciones por correo electrónico asignando roles como Administrador, Gerente o Empleado.'
  }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Centro de Soporte & Ayuda
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle className="h-3.5 w-3.5" />
            Sistemas 100% Operativos
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6 bg-gradient-to-b from-primary/10 via-background to-background text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary mb-2">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            ¿En qué podemos ayudarte hoy?
          </h1>
          <p className="text-muted-foreground text-lg">
            Encuentra respuestas rápidas, guías de uso o contacta directamente con nuestro equipo de asistencia técnica.
          </p>

          <div className="relative max-w-xl mx-auto pt-4">
            <Search className="absolute left-4 top-7 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar en la documentación o preguntas frecuentes..."
              className="pl-12 h-12 rounded-xl text-base bg-card border-border shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border bg-card hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg mb-1">Soporte por Email</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Escríbenos directamente y te responderemos en menos de 2 horas.
            </p>
            <a href="mailto:soporte@nyvora.com" className="text-sm font-semibold text-primary hover:underline">
              soporte@nyvora.com →
            </a>
          </div>

          <div className="p-6 rounded-2xl border bg-card hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg mb-1">Chat de Asistencia IA</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Consulta cualquier duda operativa directamente con Nova AI dentro de tu panel.
            </p>
            <Link href="/nova" className="text-sm font-semibold text-primary hover:underline">
              Abrir Nova Chat →
            </Link>
          </div>

          <div className="p-6 rounded-2xl border bg-card hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg mb-1">Documentación Oficial</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explora tutoriales paso a paso de cada uno de los 30+ módulos del BOS.
            </p>
            <a href="https://docs.nyvora.com" target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline">
              Ver Guías →
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes (FAQ)</h2>

        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="border rounded-xl bg-card overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left font-semibold flex justify-between items-center gap-4 hover:bg-muted/50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-card/30 text-center text-sm text-muted-foreground">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Nyvora. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground">Términos</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
