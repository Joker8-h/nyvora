'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@nyvora/ui/components/ui/button';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import { AuthLayout } from '@nyvora/ui/components/layout/auth-layout';
import { Loader2 } from 'lucide-react';

interface VerifyResult {
  valid: boolean;
  email: string;
  role: string;
  organizationName: string;
  requiresRegistration: boolean;
  expiresAt: string;
}

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = React.useState<'loading' | 'ready' | 'invalid'>('loading');
  const [invitation, setInvitation] = React.useState<VerifyResult | null>(null);
  const [invalidMessage, setInvalidMessage] = React.useState('');

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setInvalidMessage('Falta el token de invitación.');
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/v1/invitations/verify/${token}`);
        const data = await res.json();
        if (!res.ok || !data?.valid) {
          setStatus('invalid');
          setInvalidMessage(
            data?.error?.message || 'Esta invitación no es válida o ha expirado.'
          );
          return;
        }
        setInvitation(data);
        setStatus('ready');
      } catch {
        setStatus('invalid');
        setInvalidMessage('No se pudo verificar la invitación.');
      }
    })();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (invitation?.requiresRegistration) {
      if (!firstName.trim() || !lastName.trim()) {
        setError('Nombre y apellido son requeridos.');
        return;
      }
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ token, firstName, lastName, password }),
      });
      const result = await res.json();

      if (!res.ok) {
        const msg = result?.error?.message || result?.message || 'Error al aceptar la invitación';
        throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
      }

      if (result.tokens?.accessToken) {
        localStorage.setItem('access_token', result.tokens.accessToken);
        localStorage.setItem('refresh_token', result.tokens.refreshToken);
      }
      if (result.organization?.id) {
        localStorage.setItem('organization_id', result.organization.id);
      }

      window.location.href = '/home';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aceptar la invitación');
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Verificando invitación...
        </div>
      </AuthLayout>
    );
  }

  if (status === 'invalid') {
    return (
      <AuthLayout>
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold">Invitación no válida</h1>
          <p className="text-muted-foreground">{invalidMessage}</p>
          <Link href="/login" className="text-primary hover:underline">
            Ir a iniciar sesión
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Únete a {invitation?.organizationName}</h1>
          <p className="text-muted-foreground">
            Has sido invitado como <strong>{invitation?.role}</strong> ({invitation?.email})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {invitation?.requiresRegistration ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    placeholder="Tu nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    placeholder="Tu apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ya tienes una cuenta con este email. Acepta para unirte a la organización.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Aceptar invitación
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">Cargando...</div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
