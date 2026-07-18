import { Injectable } from '@nestjs/common';

export const ALL_PERMISSIONS = [
  'crm:contacts:read', 'crm:contacts:create', 'crm:contacts:update', 'crm:contacts:delete',
  'crm:companies:read', 'crm:companies:create', 'crm:companies:update', 'crm:companies:delete',
  'crm:pipelines:read', 'crm:pipelines:create', 'crm:pipelines:update', 'crm:pipelines:delete',
  'crm:leads:read', 'crm:leads:create', 'crm:leads:update', 'crm:leads:delete',
  'sales:quotes:read', 'sales:quotes:create', 'sales:quotes:update', 'sales:quotes:delete',
  'sales:orders:read', 'sales:orders:create', 'sales:orders:update', 'sales:orders:delete',
  'sales:invoices:read', 'sales:invoices:create', 'sales:invoices:update', 'sales:invoices:delete',
  'sales:payments:read', 'sales:payments:create', 'sales:payments:delete',
  'inventory:warehouses:read', 'inventory:warehouses:create', 'inventory:warehouses:update', 'inventory:warehouses:delete',
  'inventory:products:read', 'inventory:products:create', 'inventory:products:update', 'inventory:products:delete',
  'inventory:stock:read', 'inventory:stock:create',
  'finance:accounts:read', 'finance:accounts:create', 'finance:accounts:update', 'finance:accounts:delete',
  'finance:categories:read', 'finance:categories:create', 'finance:categories:update', 'finance:categories:delete',
  'finance:transactions:read', 'finance:transactions:create', 'finance:transactions:update', 'finance:transactions:delete',
  'reports:finance:read',
  'reports:sales:read',
  'hr:positions:read', 'hr:positions:create', 'hr:positions:update', 'hr:positions:delete',
  'hr:employees:read', 'hr:employees:create', 'hr:employees:update', 'hr:employees:delete',
  'hr:absences:read', 'hr:absences:create', 'hr:absences:update', 'hr:absences:delete',
  'hr:evaluations:read', 'hr:evaluations:create', 'hr:evaluations:update', 'hr:evaluations:delete',
  'automations:read', 'automations:create', 'automations:update', 'automations:delete', 'automations:execute',
  'calendar:meetings:read', 'calendar:meetings:create', 'calendar:meetings:update', 'calendar:meetings:delete',
  'marketplace:read', 'marketplace:install', 'marketplace:uninstall', 'marketplace:update',
  'integrations:read', 'integrations:create', 'integrations:update', 'integrations:delete', 'integrations:test',
  'campaigns:read', 'campaigns:create', 'campaigns:update', 'campaigns:delete', 'campaigns:send',
  'users:read', 'users:create', 'users:update', 'users:delete',
  'organizations:read', 'organizations:create', 'organizations:update', 'organizations:delete',
  'branches:read', 'branches:create', 'branches:update', 'branches:delete',
  'departments:read', 'departments:create', 'departments:update', 'departments:delete',
  'sessions:read', 'sessions:delete',
  'ai:read', 'ai:create',
  'projects:read', 'projects:create', 'projects:update', 'projects:delete',
  'tasks:read', 'tasks:create', 'tasks:update', 'tasks:delete',
];

@Injectable()
export class PermissionsService {
  getRolePermissions(role: string): string[] {
    switch (role) {
      case 'owner':
      case 'admin':
        return ALL_PERMISSIONS;
      case 'manager':
        return ALL_PERMISSIONS;
      case 'employee':
        return ALL_PERMISSIONS.filter((p) => !p.includes('delete'));
      case 'viewer':
        return ALL_PERMISSIONS.filter((p) => p.endsWith(':read'));
      default:
        return [];
    }
  }
}
