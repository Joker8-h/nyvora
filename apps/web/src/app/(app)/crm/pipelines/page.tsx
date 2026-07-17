'use client';

import { useState } from 'react';
import { Card, CardContent } from '@nyvora/ui/components/ui/card';
import { Button } from '@nyvora/ui/components/ui/button';
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
import { Edit, Plus, Trash2 } from 'lucide-react';
import { usePipelines, useCreatePipeline, useDeletePipeline, useUpdatePipeline } from '@/lib/hooks';
import { useToast } from '@nyvora/ui/hooks/use-toast';

export default function PipelinesPage() {
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');

  const { data, isLoading } = usePipelines();
  const createMutation = useCreatePipeline();
  const deleteMutation = useDeletePipeline();
  const updateMutation = useUpdatePipeline();
  const { toast } = useToast();

  const pipelines = data?.data || [];
  const stageLabel = (stage: any) => (typeof stage === 'string' ? stage : stage?.name || '');

  const handleCreate = () => {
    if (!name) return;
    createMutation.mutate(
      { name, stages: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] },
      {
        onSuccess: () => {
          setName('');
          setShowForm(false);
          toast({ title: 'Pipeline creado', description: 'El pipeline se ha creado correctamente.' });
        },
        onError: () => {
          toast({ title: 'Error', description: 'No se pudo crear el pipeline.', variant: 'destructive' });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        toast({ title: 'Pipeline eliminado', description: 'El pipeline se ha eliminado correctamente.' });
      },
      onError: () => {
        toast({ title: 'Error', description: 'No se pudo eliminar el pipeline.', variant: 'destructive' });
      },
    });
  };

  const handleEdit = () => {
    if (!editId || !editName) return;
    updateMutation.mutate(
      { id: editId, name: editName },
      {
        onSuccess: () => {
          setEditId(null);
          setEditName('');
          toast({ title: 'Pipeline actualizado', description: 'El pipeline se ha actualizado correctamente.' });
        },
        onError: () => {
          toast({ title: 'Error', description: 'No se pudo actualizar el pipeline.', variant: 'destructive' });
        },
      }
    );
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pipelines de ventas</h2>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Pipeline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Pipeline</DialogTitle>
              <DialogDescription>Crea un nuevo pipeline para gestionar tus leads</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input placeholder="Nombre del pipeline" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creando...' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pipelines.map((pipeline: any) => (
          <Card key={pipeline.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{pipeline.name}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => { setEditId(pipeline.id); setEditName(pipeline.name); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(pipeline.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {(pipeline.stages || []).map((stage: any, i: number) => (
                  <span key={i} className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs">
                    {stageLabel(stage)}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{pipeline._count?.leads || 0} leads</p>
            </CardContent>
          </Card>
        ))}
        {pipelines.length === 0 && (
          <div className="col-span-2 p-8 text-center text-muted-foreground">No hay pipelines</div>
        )}
      </div>

      <Dialog open={!!editId} onOpenChange={() => { setEditId(null); setEditName(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pipeline</DialogTitle>
            <DialogDescription>Modifica el nombre del pipeline</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input placeholder="Nombre del pipeline" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditId(null); setEditName(''); }}>Cancelar</Button>
            <Button onClick={handleEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Pipeline</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este pipeline? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
