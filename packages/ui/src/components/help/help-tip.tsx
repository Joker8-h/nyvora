'use client';

import * as React from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface HelpTipProps {
  text: string;
  title?: string;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function HelpTip({ text, title, className, side = 'top' }: HelpTipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={title ? `Ayuda: ${title}` : 'Ayuda'}
          className={cn(
            'inline-flex h-4 w-4 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none',
            className
          )}
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent side={side} className="w-64 text-sm">
        {title ? <p className="mb-1 font-medium">{title}</p> : null}
        <p className="text-muted-foreground">{text}</p>
      </PopoverContent>
    </Popover>
  );
}
