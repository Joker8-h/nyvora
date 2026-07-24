import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nyvora.com'),
  title: 'Nyvora - Business Operating System AI-First',
  description:
    'La plataforma que convierte tu empresa en una organización inteligente. Automatiza, analiza y crece con el poder de la IA.',
  keywords: ['ERP', 'CRM', 'Business OS', 'AI', 'Automation', 'Nyvora'],
  authors: [{ name: 'Nyvora' }],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://nyvora.com',
    siteName: 'Nyvora',
    title: 'Nyvora - Business Operating System AI-First',
    description:
      'La plataforma que convierte tu empresa en una organización inteligente.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nyvora',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyvora - Business Operating System AI-First',
    description:
      'La plataforma que convierte tu empresa en una organización inteligente.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}