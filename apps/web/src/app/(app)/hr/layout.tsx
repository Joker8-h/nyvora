'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'Empleados', href: '/hr/employees' },
  { label: 'Cargos', href: '/hr/positions' },
  { label: 'Ausencias', href: '/hr/absences' },
  { label: 'Evaluaciones', href: '/hr/evaluations' },
];

export default function HrLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Recursos Humanos</h1>
        <p className="text-muted-foreground">Gestiona empleados, cargos, ausencias y evaluaciones</p>
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
