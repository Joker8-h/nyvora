'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';

export interface GuideDialogStep {
  title: string;
  description: string;
}

interface GuideDialogProps {
  steps: GuideDialogStep[];
  /** Si se pasa, el dialogo se abre automaticamente la primera vez y recuerda que ya se vio. */
  storageKey?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GuideDialog({ steps, storageKey, open, onOpenChange }: GuideDialogProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);

  const actualOpen = isControlled ? open! : internalOpen;

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (isControlled || !storageKey) return;
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(storageKey)) {
      setInternalOpen(true);
    }
  }, [isControlled, storageKey]);

  const close = React.useCallback(() => {
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'true');
    }
    setStep(0);
    setOpen(false);
  }, [storageKey, setOpen]);

  if (steps.length === 0) return null;
  const current = steps[Math.min(step, steps.length - 1)];
  const isLast = step >= steps.length - 1;

  return (
    <Dialog open={actualOpen} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{current.title}</DialogTitle>
          <DialogDescription>{current.description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-1.5 py-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={
                'h-1.5 rounded-full transition-all ' +
                (i === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30')
              }
            />
          ))}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" size="sm" onClick={close}>
            Omitir
          </Button>
          <div className="flex gap-2">
            {step > 0 ? (
              <Button variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Atras
              </Button>
            ) : null}
            <Button size="sm" onClick={() => (isLast ? close() : setStep((s) => s + 1))}>
              {isLast ? (
                <>
                  <Check className="mr-1 h-4 w-4" />
                  Entendido
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
