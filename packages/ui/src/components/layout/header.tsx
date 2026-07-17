'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  Building2,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useTheme } from '../../hooks/use-theme';
import { useAuth } from '../../hooks/use-auth';
import { HelpPanel } from '../help/help-panel';
import { getModuleHelpKey } from '../../lib/help-content';

export const TOUR_EVENT = 'nyvora:start-tour';

const routeLabels: Record<string, string> = {
  crm: 'CRM',
  contacts: 'Contactos',
  companies: 'Compañías',
  pipelines: 'Pipelines',
  leads: 'Leads',
  sales: 'Ventas',
  quotations: 'Cotizaciones',
  orders: 'Órdenes',
  invoices: 'Facturas',
  payments: 'Pagos',
  inventory: 'Inventario',
  products: 'Productos',
  categories: 'Categorías',
  warehouses: 'Almacenes',
  stock: 'Stock',
  finance: 'Finanzas',
  accounts: 'Cuentas',
  'finance-categories': 'Categorías',
  transactions: 'Transacciones',
  reports: 'Reportes',
  hr: 'Recursos Humanos',
  employees: 'Empleados',
  positions: 'Cargos',
  absences: 'Ausencias',
  evaluations: 'Evaluaciones',
  automations: 'Automatizaciones',
  marketplace: 'Marketplace',
  sessions: 'Sesiones',
  settings: 'Configuración',
  profile: 'Perfil',
  organizations: 'Organizaciones',
  branches: 'Sucursales',
  departments: 'Departamentos',
  ai: 'IA',
  nova: 'Nova',
  docs: 'Documentación',
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let href = '';

  for (const segment of segments) {
    href += `/${segment}`;
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    crumbs.push({ label, href });
  }

  return crumbs;
}

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const moduleKey = getModuleHelpKey(pathname);

  const startTour = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(TOUR_EVENT));
    }
  }, []);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* Breadcrumb */}
        <nav className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            <Building2 className="h-4 w-4" />
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="h-4 w-4" />
              {i === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-4" data-tour="search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar en Nexora..."
            className="pl-9 bg-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Help */}
        <Button
          variant="ghost"
          size="icon"
          data-tour="help-button"
          aria-label="Ayuda"
          title="Ayuda de esta seccion"
          onClick={() => setHelpOpen(true)}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        <HelpPanel
          moduleKey={moduleKey}
          open={helpOpen}
          onOpenChange={setHelpOpen}
          onStartTour={startTour}
        />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.firstName} />
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">Mi Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/workspace">Workspace</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Configuración</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/onboarding">Onboarding</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/docs">Documentación</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/support">Soporte</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}