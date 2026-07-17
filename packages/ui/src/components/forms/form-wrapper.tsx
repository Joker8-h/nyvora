'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface FormWrapperProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
  showActions?: boolean;
}

export function FormWrapper({
  children,
  onSubmit,
  isLoading = false,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  onCancel,
  className,
  showActions = true,
}: FormWrapperProps) {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
      {children}

      {showActions && (
        <div className="flex items-center justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}