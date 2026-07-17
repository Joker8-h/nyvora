'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface NovaSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  className?: string;
}

export function NovaSuggestions({ suggestions, onSelect, className }: NovaSuggestionsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2 justify-center', className)}>
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          size="sm"
          onClick={() => onSelect(suggestion)}
          className="text-sm"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}