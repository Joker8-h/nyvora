'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, error, hint, required, htmlFor, children, ...props }, ref) => {
    const id = htmlFor || React.useId();

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <Label htmlFor={id} className={cn(error && 'text-destructive')}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              id,
              'aria-invalid': !!error,
              'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
            })
          : children}
        {error && (
          <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${id}-hint`} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = 'FormField';

export { FormField };