'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="flex flex-col items-center justify-center w-full p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Bot className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold">Nyvora</span>
          </div>

          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">
              Business Operating System AI-First
            </h1>
            <p className="text-muted-foreground">
              La plataforma que convierte tu empresa en una organización inteligente.
              Automatiza, analiza y crece con el poder de la IA.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">250+</div>
              <div className="text-sm text-muted-foreground">Pantallas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">30+</div>
              <div className="text-sm text-muted-foreground">Módulos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">IA-First</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Nyvora</span>
          </div>

          {children}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Nyvora. Todos los derechos reservados.
            </p>
            <div className="mt-2 flex items-center justify-center gap-4">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Términos
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="/support" className="hover:text-foreground transition-colors">
                Soporte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}