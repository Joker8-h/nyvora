'use client';

import * as React from 'react';
import Link from 'next/link';
import { Lightbulb, Rocket, PlayCircle, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { moduleHelp } from '../../lib/help-content';

interface HelpPanelProps {
  moduleKey: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartTour?: () => void;
}

export function HelpPanel({ moduleKey, open, onOpenChange, onStartTour }: HelpPanelProps) {
  const help = moduleHelp[moduleKey] ?? moduleHelp.home;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="border-b p-6 text-left">
          <SheetTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            {help.title}
          </SheetTitle>
          <SheetDescription>{help.whatIs}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-9rem)]">
          <div className="space-y-6 p-6">
            <section>
              <h3 className="mb-1.5 text-sm font-semibold">Para que sirve</h3>
              <p className="text-sm text-muted-foreground">{help.whatFor}</p>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold">Como empezar</h3>
              <ol className="space-y-2">
                {help.howToStart.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {help.tips && help.tips.length > 0 ? (
              <section className="rounded-lg border bg-muted/30 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Consejos
                </h3>
                <ul className="space-y-1.5">
                  {help.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {help.relatedLinks && help.relatedLinks.length > 0 ? (
              <section>
                <h3 className="mb-2 text-sm font-semibold">Secciones relacionadas</h3>
                <div className="flex flex-col gap-1">
                  {help.relatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {onStartTour ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  onOpenChange(false);
                  onStartTour();
                }}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Iniciar recorrido guiado
              </Button>
            ) : null}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
