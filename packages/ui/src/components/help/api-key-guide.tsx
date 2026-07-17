'use client';

import * as React from 'react';
import { ExternalLink, KeyRound, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { providerGuides, type ProviderGuide } from '../../lib/help-content';

interface ApiKeyGuideProps {
  provider?: string;
  guide?: ProviderGuide;
  defaultOpen?: boolean;
  className?: string;
}

export function ApiKeyGuide({ provider, guide, defaultOpen = false, className }: ApiKeyGuideProps) {
  const data = guide ?? (provider ? providerGuides[provider] : undefined);
  if (!data) return null;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? 'guide' : undefined}
      className={cn('rounded-md border bg-muted/30 px-3', className)}
    >
      <AccordionItem value="guide" className="border-b-0">
        <AccordionTrigger className="text-sm">
          <span className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            Como obtener las claves de {data.name}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-3 text-sm text-muted-foreground">{data.summary}</p>
          <ol className="space-y-2.5">
            {data.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {i + 1}
                </span>
                <span className="space-y-1">
                  <span className="block">{step.text}</span>
                  {step.url ? (
                    <a
                      href={step.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      {step.urlLabel ?? 'Abrir'}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
          {data.docsUrl ? (
            <a
              href={data.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Documentacion oficial
            </a>
          ) : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
