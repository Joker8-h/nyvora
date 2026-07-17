'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'Organización', href: '/settings/organization' },
  { label: 'Usuarios', href: '/settings/users' },
  { label: 'Sucursales', href: '/settings/branches' },
  { label: 'Departamentos', href: '/settings/departments' },
  { label: 'Integraciones', href: '/settings/integrations' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Gestiona la configuración de tu organización</p>
      </div>
      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              pathname === tab.href
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}
