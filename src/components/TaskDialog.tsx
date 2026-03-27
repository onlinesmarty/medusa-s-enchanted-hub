import { useState, useEffect } from "react";
import { Task, TaskStatus, TaskPriority, STATUS_LABELS, PRIORITY_LABELS, AGENTS } from "@/types/tasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  allTasks: Task[];
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const emptyTask = (): Task => ({
  id: `t${Date.now()}`,
  title: "",
  description: "",
  status: "todo" as TaskStatus,
  priority: "medium" as TaskPriority,
  assignee: "medusa",
  dueDate: null,
  dependencies: [],
  tags: [],
  progress: 0,
  apiCost: 0,
  createdAt: new Date().toISOString().split("T")[0],
});

const TaskDialog = ({ open, onOpenChange, task, allTasks, onSave, onDelete }: TaskDialogProps) => {
  const [form, setForm] = useState<Task>(emptyTask());
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (task) setForm(task);
    else setForm(emptyTask());
    setTagInput("");
  }, [task, open]);

  const update = <K extends keyof Task>(key: K, val: Task[K]) => setForm(prev => ({ ...prev, [key]: val }));

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      update("tags", [...form.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => update("tags", form.tags.filter(t => t !== tag));

  const toggleDependency = (id: string) => {
    update("dependencies", form.dependencies.includes(id)
      ? form.dependencies.filter(d => d !== id)
      : [...form.dependencies, id]
    );
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  const isEditing = !!task;
  const otherTasks = allTasks.filter(t => t.id !== form.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            {isEditing ? "✏️ Editar Tarea" : "✨ Nueva Tarea"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Título</Label>
            <Input
              value={form.title}
              onChange={e => update("title", e.target.value)}
              placeholder="Nombre de la tarea..."
              className="bg-muted border-border text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Descripción</Label>
            <Textarea
              value={form.description}
              onChange={e => update("description", e.target.value)}
              placeholder="Detalle de la tarea..."
              className="bg-muted border-border text-sm resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Status */}
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Estado</Label>
              <select
                value={form.status}
                onChange={e => update("status", e.target.value as TaskStatus)}
                className="w-full text-xs font-mono bg-muted border border-border rounded-md px-2 py-1.5 text-foreground"
              >
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Prioridad</Label>
              <select
                value={form.priority}
                onChange={e => update("priority", e.target.value as TaskPriority)}
                className="w-full text-xs font-mono bg-muted border border-border rounded-md px-2 py-1.5 text-foreground"
              >
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Agente</Label>
              <select
                value={form.assignee}
                onChange={e => update("assignee", e.target.value)}
                className="w-full text-xs font-mono bg-muted border border-border rounded-md px-2 py-1.5 text-foreground"
              >
                {AGENTS.map(a => (
                  <option key={a.id} value={a.id}>{a.emoji} {a.name}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Fecha Límite</Label>
              <Input
                type="date"
                value={form.dueDate || ""}
                onChange={e => update("dueDate", e.target.value || null)}
                className="bg-muted border-border text-xs font-mono"
              />
            </div>

            {/* Progress */}
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Progreso ({form.progress}%)</Label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.progress}
                onChange={e => update("progress", parseInt(e.target.value))}
                className="w-full accent-primary h-1.5"
              />
            </div>

            {/* API Cost */}
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Costo API ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.apiCost}
                onChange={e => update("apiCost", parseFloat(e.target.value) || 0)}
                className="bg-muted border-border text-xs font-mono"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Etiquetas</Label>
            <div className="flex gap-1.5 flex-wrap mb-1.5">
              {form.tags.map(tag => (
                <span key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Añadir etiqueta..."
                className="bg-muted border-border text-xs flex-1"
              />
              <Button size="sm" variant="outline" onClick={addTag} className="text-xs h-8">+</Button>
            </div>
          </div>

          {/* Dependencies */}
          {otherTasks.length > 0 && (
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Dependencias</Label>
              <div className="max-h-24 overflow-y-auto space-y-1 mt-1">
                {otherTasks.map(t => (
                  <label key={t.id} className="flex items-center gap-2 text-xs font-mono text-foreground/80 cursor-pointer hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={form.dependencies.includes(t.id)}
                      onChange={() => toggleDependency(t.id)}
                      className="accent-primary"
                    />
                    {t.title}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between mt-4">
          {isEditing && (
            <Button variant="destructive" size="sm" onClick={() => onDelete(form.id)} className="gap-1 text-xs">
              <Trash2 className="w-3 h-3" /> Eliminar
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs">Cancelar</Button>
            <Button size="sm" onClick={handleSave} className="text-xs snake-gradient text-primary-foreground border-0">
              {isEditing ? "Guardar" : "Crear Tarea"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
