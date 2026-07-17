'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@nyvora/ui/components/ui/card';
import { Button } from '@nyvora/ui/components/ui/button';
import { Badge } from '@nyvora/ui/components/ui/badge';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nyvora/ui/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@nyvora/ui/components/ui/dialog';
import { Plus, Trash2, FolderKanban, Calendar, Clock, CheckSquare } from 'lucide-react';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useProject,
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  type Project,
  type Task,
} from '@/lib/hooks';

const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planificación' },
  { value: 'active', label: 'Activo' },
  { value: 'on_hold', label: 'En pausa' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
];

const TASK_STATUSES = [
  { value: 'todo', label: 'Por hacer' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'review', label: 'En revisión' },
  { value: 'done', label: 'Hecho' },
];

const TASK_PRIORITIES = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
];

const STATUS_META: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  planning: { label: 'Planificación', variant: 'outline' },
  active: { label: 'Activo', variant: 'default' },
  on_hold: { label: 'En pausa', variant: 'secondary' },
  completed: { label: 'Completado', variant: 'secondary' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

const TASK_STATUS_META: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  todo: { label: 'Por hacer', variant: 'outline' },
  in_progress: { label: 'En progreso', variant: 'default' },
  review: { label: 'En revisión', variant: 'secondary' },
  done: { label: 'Hecho', variant: 'secondary' },
};

const PRIORITY_META: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  low: { label: 'Baja', variant: 'outline' },
  medium: { label: 'Media', variant: 'secondary' },
  high: { label: 'Alta', variant: 'default' },
  urgent: { label: 'Urgente', variant: 'destructive' },
};

export default function ProjectsPage() {
  const { data, isLoading } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const [showCreate, setShowCreate] = React.useState(false);
  const [detailId, setDetailId] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: '',
    description: '',
    status: 'planning',
  });

  const resetForm = () => setForm({ name: '', description: '', status: 'planning' });

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    await createProject.mutateAsync({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
    });
    resetForm();
    setShowCreate(false);
  };

  const projects = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proyectos</h1>
          <p className="text-muted-foreground">Gestiona proyectos y sus tareas asociadas</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-1 h-4 w-4" /> Nuevo proyecto
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse"><CardHeader><div className="h-16 bg-muted rounded" /></CardHeader></Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aún no tienes proyectos</h3>
            <p className="text-sm text-muted-foreground mb-4">Crea tu primer proyecto para organizar tareas.</p>
            <Button onClick={() => setShowCreate(true)}><Plus className="mr-1 h-4 w-4" /> Nuevo proyecto</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const meta = STATUS_META[p.status] ?? { label: p.status, variant: 'outline' as const };
            return (
              <Card key={p.id} className="cursor-pointer transition-colors hover:border-primary/50" onClick={() => setDetailId(p.id)}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{p.name}</CardTitle>
                      {p.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                      )}
                    </div>
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckSquare className="h-3 w-3" /> {p.tasks?.length ?? 0} tareas
                    </span>
                    {p.startDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(p.startDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" onClick={() => setDetailId(p.id)}>
                      Ver tareas
                    </Button>
                    {p.status !== 'completed' && p.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteProject.mutate(p.id)}
                        disabled={deleteProject.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Crear */}
      <Dialog open={showCreate} onOpenChange={(o) => { if (!o) { setShowCreate(false); resetForm(); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo proyecto</DialogTitle>
            <DialogDescription>Define el nombre y estado inicial del proyecto.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="p-name">Nombre</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Implementación CRM"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-desc">Descripción</Label>
              <textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Objetivos del proyecto..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="space-y-1">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createProject.isPending || !form.name.trim()}>
              {createProject.isPending ? 'Creando...' : 'Crear proyecto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detalle + tareas */}
      <DetailDialog id={detailId} onClose={() => setDetailId(null)} />
    </div>
  );
}

function DetailDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { data: project } = useProjectSafe(id);
  const { data: tasksData } = useTasks({ projectId: id || undefined });
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const updateProject = useUpdateProject();

  const [showTask, setShowTask] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);
  const [taskForm, setTaskForm] = React.useState({ title: '', priority: 'medium', status: 'todo' });
  const [projForm, setProjForm] = React.useState({ name: '', description: '', status: 'planning' });

  React.useEffect(() => {
    if (project) {
      setProjForm({ name: project.name, description: project.description ?? '', status: project.status });
    }
  }, [project]);

  const tasks = tasksData?.data ?? [];
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const pct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const handleCreateTask = async () => {
    if (!id || !taskForm.title.trim()) return;
    await createTask.mutateAsync({
      projectId: id,
      title: taskForm.title.trim(),
      priority: taskForm.priority,
      status: taskForm.status,
    });
    setTaskForm({ title: '', priority: 'medium', status: 'todo' });
    setShowTask(false);
  };

  const handleUpdateProject = async () => {
    if (!editing) return;
    await updateProject.mutateAsync({ id: editing.id, ...projForm });
    setEditing(null);
  };

  return (
    <Dialog open={!!id} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" /> {project?.name || 'Proyecto'}
          </DialogTitle>
          <DialogDescription>
            {project?.description || 'Sin descripción'}
          </DialogDescription>
        </DialogHeader>

        {project && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={(STATUS_META[project.status] ?? { variant: 'outline' as const }).variant}>
                {STATUS_META[project.status]?.label ?? project.status}
              </Badge>
              {project.startDate && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" /> Inicio: {new Date(project.startDate).toLocaleDateString()}
                </span>
              )}
              {project.budgetHours != null && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {project.budgetHours}h
                </span>
              )}
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(project)}>Editar</Button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{doneCount}/{tasks.length} tareas completadas</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Tareas</h3>
                <Button size="sm" onClick={() => setShowTask(true)}>
                  <Plus className="mr-1 h-4 w-4" /> Añadir tarea
                </Button>
              </div>

              {tasks.length === 0 ? (
                <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No hay tareas todavía.
                </p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((t) => {
                    const sMeta = TASK_STATUS_META[t.status] ?? { label: t.status, variant: 'outline' as const };
                    const pMeta = PRIORITY_META[t.priority] ?? { label: t.priority, variant: 'outline' as const };
                    return (
                      <div key={t.id} className="flex items-center gap-3 rounded-md border p-3">
                        <input
                          type="checkbox"
                          checked={t.status === 'done'}
                          onChange={(e) =>
                            updateTask.mutate({ id: t.id, status: e.target.checked ? 'done' : 'todo' })
                          }
                          className="h-4 w-4"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${t.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                            {t.title}
                          </p>
                          {t.assignee && (
                            <p className="text-xs text-muted-foreground">
                              {t.assignee.firstName} {t.assignee.lastName}
                            </p>
                          )}
                        </div>
                        <Badge variant={pMeta.variant}>{pMeta.label}</Badge>
                        <Select
                          value={t.status}
                          onValueChange={(v) => updateTask.mutate({ id: t.id, status: v })}
                        >
                          <SelectTrigger className="h-7 w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {TASK_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => deleteTask.mutate(t.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Editar proyecto */}
        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar proyecto</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label htmlFor="e-name">Nombre</Label>
                <Input id="e-name" value={projForm.name} onChange={(e) => setProjForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="e-desc">Descripción</Label>
                <textarea
                  id="e-desc"
                  value={projForm.description}
                  onChange={(e) => setProjForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-1">
                <Label>Estado</Label>
                <Select value={projForm.status} onValueChange={(v) => setProjForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button onClick={handleUpdateProject} disabled={updateProject.isPending}>
                {updateProject.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Crear tarea */}
        <Dialog open={showTask} onOpenChange={(o) => { if (!o) { setShowTask(false); setTaskForm({ title: '', priority: 'medium', status: 'todo' }); } }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva tarea</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label htmlFor="t-title">Título</Label>
                <Input
                  id="t-title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Diseñar landing"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Prioridad</Label>
                  <Select value={taskForm.priority} onValueChange={(v) => setTaskForm((f) => ({ ...f, priority: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TASK_PRIORITIES.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Estado</Label>
                  <Select value={taskForm.status} onValueChange={(v) => setTaskForm((f) => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TASK_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowTask(false); setTaskForm({ title: '', priority: 'medium', status: 'todo' }); }}>Cancelar</Button>
              <Button onClick={handleCreateTask} disabled={createTask.isPending || !taskForm.title.trim()}>
                {createTask.isPending ? 'Creando...' : 'Crear tarea'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

function useProjectSafe(id: string | null) {
  return useProject(id ?? '');
}
