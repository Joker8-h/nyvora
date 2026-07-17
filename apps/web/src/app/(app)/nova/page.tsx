'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { NovaChat } from '@nyvora/ui/components/nova/nova-chat';
import { NovaProvider } from '@nyvora/ui/hooks/use-nova';

function NovaContent() {
  return (
    <NovaProvider>
      <div className="h-[calc(100vh-8rem)]">
        <NovaChat />
      </div>
    </NovaProvider>
  );
}

export default function NovaPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando Nova...</div>}>
      <NovaContent />
    </Suspense>
  );
}
