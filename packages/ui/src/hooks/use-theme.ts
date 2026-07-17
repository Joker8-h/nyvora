'use client';

import * as React from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    return {
      theme: 'dark' as Theme,
      setTheme: () => {},
      resolvedTheme: 'dark' as 'dark' | 'light',
    };
  }

  return context;
}