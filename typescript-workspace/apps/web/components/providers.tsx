'use client';

import * as React from 'react';

import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { Toaster } from '@workspace/ui/components/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
        <Toaster />
      </NextThemesProvider>
    </JotaiProvider>
  );
}
