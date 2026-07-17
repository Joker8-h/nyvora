'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@nyvora/ui/components/ui/button';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import { AuthLayout } from '@nyvora/ui/components/layout/auth-layout';
import { Loader2, CheckCircle } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotInput = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotInput) => {
    setIsLoading(true);
    setError(null);

    try {
      await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Recuperar Contraseña</h1>
          <p className="text-muted-foreground">
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <p className="text-muted-foreground">
              Si existe una cuenta con ese email, recibirás un enlace de recuperación.
            </p>
            <Link href="/login" className="text-primary hover:underline">
              Volver al login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar enlace
            </Button>
          </form>
        )}

        <div className="text-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            Volver al login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
