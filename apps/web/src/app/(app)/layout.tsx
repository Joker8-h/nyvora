'use client';

import { AppLayout } from '@nyvora/ui/components/layout/app-layout';
import { ProductTour } from '@/components/product-tour';

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      {children}
      <ProductTour />
    </AppLayout>
  );
}
