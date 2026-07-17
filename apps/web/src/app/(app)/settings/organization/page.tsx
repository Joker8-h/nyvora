'use client';

import { useState } from 'react';
import { useOrganization, useUpdateOrganization } from '@/lib/hooks';

export default function OrganizationPage() {
  const { data, isLoading } = useOrganization();
  const updateMutation = useUpdateOrganization();
  const [name, setName] = useState('');

  const org = data;

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Datos de la organización</h2>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre</label>
          <input
            type="text"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            defaultValue={org?.name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <input
            type="text"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            defaultValue={org?.slug}
            disabled
          />
        </div>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            if (name) updateMutation.mutate({ name });
          }}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
