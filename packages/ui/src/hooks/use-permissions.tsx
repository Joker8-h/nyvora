'use client';

import * as React from 'react';

interface PermissionContextType {
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canAccess: (resource: string, action: string, scope?: string) => boolean;
}

const PermissionContext = React.createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({
  children,
  permissions = [],
}: {
  children: React.ReactNode;
  permissions?: string[];
}) {
  const hasPermission = React.useCallback(
    (permission: string) => {
      return permissions.includes(permission);
    },
    [permissions]
  );

  const hasAnyPermission = React.useCallback(
    (perms: string[]) => {
      return perms.some((p) => permissions.includes(p));
    },
    [permissions]
  );

  const hasAllPermissions = React.useCallback(
    (perms: string[]) => {
      return perms.every((p) => permissions.includes(p));
    },
    [permissions]
  );

  const canAccess = React.useCallback(
    (resource: string, action: string, scope?: string) => {
      const permission = scope ? `${resource}:${action}:${scope}` : `${resource}:${action}`;
      return permissions.includes(permission) || permissions.includes(`${resource}:manage`);
    },
    [permissions]
  );

  const value = React.useMemo(
    () => ({
      permissions,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canAccess,
    }),
    [permissions, hasPermission, hasAnyPermission, hasAllPermissions, canAccess]
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermissions() {
  const context = React.useContext(PermissionContext);

  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }

  return context;
}