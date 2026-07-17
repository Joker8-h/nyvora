'use client';

import * as React from 'react';
import { Card, CardContent } from '@nyvora/ui/components/ui/card';
import { Button } from '@nyvora/ui/components/ui/button';
import { Badge } from '@nyvora/ui/components/ui/badge';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@nyvora/ui/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nyvora/ui/components/ui/select';
import { Plus, Users, Mail, Copy, X } from 'lucide-react';
import {
  useOrganizationUsers,
  useUpdateUser,
  useDeleteUser,
  useInvitations,
  useCreateInvitation,
  useRevokeInvitation,
} from '@/lib/hooks';

const ROLES = [
  { value: 'owner', label: 'Dueño' },
  { value: 'admin', label: 'Administrador' },
  { value: 'manager', label: 'Gerente' },
  { value: 'employee', label: 'Empleado' },
  { value: 'viewer', label: 'Visor' },
];

export default function UsersPage() {
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState('employee');
  const [inviteError, setInviteError] = React.useState('');
  const [lastAcceptUrl, setLastAcceptUrl] = React.useState('');

  const { data, isLoading } = useOrganizationUsers();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const invitationsQuery = useInvitations();
  const createInvitation = useCreateInvitation();
  const revokeInvitation = useRevokeInvitation();

  const users = Array.isArray(data) ? data : data?.users || data?.data || [];
  const invitations = invitationsQuery.data?.data || [];

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviteError('');
    setLastAcceptUrl('');
    try {
      const res: any = await createInvitation.mutateAsync({ email: inviteEmail, role: inviteRole });
      setLastAcceptUrl(res?.acceptUrl || '');
      setInviteEmail('');
      setInviteRole('employee');
      if (res?.emailSent) {
        setIsInviteOpen(false);
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message || error?.message || 'Error al crear la invitacion';
      setInviteError(Array.isArray(msg) ? msg.join(', ') : String(msg));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Usuarios</h2>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invitar usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invitar Usuario</DialogTitle>
              <DialogDescription>
                Envía una invitación por email para unirse a la organización
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="employee">Empleado</SelectItem>
                    <SelectItem value="viewer">Visor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {inviteError && (
                <p className="text-sm text-red-600">{inviteError}</p>
              )}
              {lastAcceptUrl && (
                <div className="space-y-2 rounded-md border border-green-200 bg-green-50 p-3">
                  <p className="text-sm font-medium text-green-800">
                    Invitación creada. Comparte este enlace de aceptación:
                  </p>
                  <div className="flex items-center gap-2">
                    <Input readOnly value={lastAcceptUrl} className="text-xs" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => navigator.clipboard?.writeText(lastAcceptUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                Cerrar
              </Button>
              <Button onClick={handleInvite} disabled={createInvitation.isPending}>
                {createInvitation.isPending ? 'Enviando...' : 'Enviar Invitación'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Rol</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3">{user.firstName} {user.lastName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <Select
                        value={user.memberships?.[0]?.role || user.role || 'employee'}
                        onValueChange={(role: string) =>
                          updateMutation.mutate({
                            id: user.id,
                            membership: { organizationId: user.memberships?.[0]?.organizationId, role },
                          })
                        }
                        disabled={updateMutation.isPending}
                      >
                        <SelectTrigger className="h-8 w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Badge variant={user.isActive ? 'default' : 'destructive'}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <button
                        className="text-sm text-red-600 hover:text-red-800"
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                            deleteMutation.mutate(user.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No hay usuarios
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {invitations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Invitaciones pendientes
          </h3>
          <Card>
            <CardContent className="p-0">
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="p-3">Email</th>
                      <th className="p-3">Rol</th>
                      <th className="p-3">Expira</th>
                      <th className="p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((inv: any) => (
                      <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="p-3">
                          <span className="inline-flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {inv.email}
                          </span>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{inv.role}</Badge>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="p-3">
                          <button
                            className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                            onClick={() => revokeInvitation.mutate(inv.id)}
                            disabled={revokeInvitation.isPending}
                          >
                            <X className="h-4 w-4" />
                            Revocar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
