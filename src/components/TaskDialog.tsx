import { useState, useEffect } from "react";
import { Task, TaskStatus, TaskPriority, TaskLink, STATUS_LABELS, PRIORITY_LABELS, AGENTS } from "@/types/tasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, X, Link, Image } from "lucide-react";
import { createTask, updateTask } from "@/lib/api";

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
  startDate: null,
  dependencies: [],
  tags: [],
  links: [],
  images: [],
  progress: 0,
  apiCost: 0,
  createdAt: new Date().toISOString().split("T")[0],
});

const TaskDialog = ({ open, onOpenChange, task, allTasks, onSave, onDelete }: TaskDialogProps) => {
  const [form, setForm] = useState<Task>(emptyTask());
  const [tagInput, setTagInput] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) setForm(task);
    else setForm(emptyTask());
    setTagInput("");
    setLinkUrl("");
    setLinkTitle("");
    setImageUrl("");
  }, [task, open]);

  const update = <K extends keyof Task>(key: K, val: Task[K]) => setForm(prev => ({ ...prev, [key]: val }));

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      update("tags", [...form.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => update("tags", form.tags.filter(t => t !== tag));

  const addLink = () => {
    if (linkUrl.trim()) {
      update("links", [...form.links, { url: linkUrl.trim(), title: linkTitle.trim() || linkUrl.trim() }]);
      setLinkUrl("");
      setLinkTitle("");
    }
  };

  const removeLink = (idx: number) => update("links", form.links.filter((_, i) => i !== idx));

  const addImage = () => {
    if (imageUrl.trim()) {
      update("images", [...form.images, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const removeImage = (idx: number) => update("images", form.images.filter((_, i) => i !== idx));

  const toggleDependency = (id: string) => {
    update("dependencies", form.dependencies.includes(id)
      ? form.dependencies.filter(d => d !== id)
      : [...form.dependencies, id]
    );
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        assignee: form.assignee,
        due_date: form.dueDate || null,
        start_date: form.startDate || null,
        tags: form.tags,
        links: form.links,
        images: form.images,
        dependencies: form.dependencies,
        progress: form.progress,
      };
      let saved: Task;
      if (task) {
        saved = await updateTask(form.id, payload);
      } else {
        saved = await createTask(payload);
      }
      onSave(saved);
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!task;
  const otherTasks = allTasks.filter(t => t.id !== form.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
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

            {/* Progress */}
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Progreso ({form.progress}%)</Label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.progress}
                onChange={e => update("progress", parseInt(e.target.value))}
                className="w-full accent-primary h-1.5 mt-2"
              />
            </div>

            {/* Start Date */}
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Fecha Inicio</Label>
              <Input
                type="date"
                value={form.startDate || ""}
                onChange={e => update("startDate", e.target.value || null)}
                className="bg-muted border-border text-xs font-mono"
              />
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
          </div>

          {/* Tags */}
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Etiquetas</Label>
            <div className="flex gap-1.5 flex-wrap mb-1.5 min-h-[20px]">
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
              <Button size="sm" variant="outline" onClick={addTag} className="text-xs h-8 px-2"><Plus className="w-3 h-3" /></Button>
            </div>
          </div>

          {/* Links */}
          <div>
            <Label className="text-xs font-mono text-muted-foreground flex items-center gap-1"><Link className="w-3 h-3" /> Links</Label>
            <div className="space-y-1 mb-2">
              {form.links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs font-mono bg-muted/50 rounded px-2 py-1">
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-primary hover:underline flex-1 truncate">
                    {link.title || link.url}
                  </a>
                  <button onClick={() => removeLink(idx)} className="text-muted-foreground hover:text-destructive shrink-0">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <Input
                value={linkTitle}
                onChange={e => setLinkTitle(e.target.value)}
                placeholder="Título (opcional)"
                className="bg-muted border-border text-xs w-28 shrink-0"
              />
              <Input
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addLink())}
                placeholder="https://..."
                className="bg-muted border-border text-xs flex-1"
              />
              <Button size="sm" variant="outline" onClick={addLink} className="text-xs h-8 px-2"><Plus className="w-3 h-3" /></Button>
            </div>
          </div>

          {/* Images */}
          <div>
            <Label className="text-xs font-mono text-muted-foreground flex items-center gap-1"><Image className="w-3 h-3" /> Imágenes</Label>
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt=""
                      className="w-16 h-16 object-cover rounded border border-border"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-1.5">
              <Input
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImage())}
                placeholder="URL de imagen..."
                className="bg-muted border-border text-xs flex-1"
              />
              <Button size="sm" variant="outline" onClick={addImage} className="text-xs h-8 px-2"><Plus className="w-3 h-3" /></Button>
            </div>
          </div>

          {/* Dependencies */}
          {otherTasks.length > 0 && (
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Dependencias</Label>
              <div className="max-h-24 overflow-y-auto space-y-1 mt-1 bg-muted/30 rounded p-2">
                {otherTasks.map(t => (
                  <label key={t.id} className="flex items-center gap-2 text-xs font-mono text-foreground/80 cursor-pointer hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={form.dependencies.includes(t.id)}
                      onChange={() => toggleDependency(t.id)}
                      className="accent-primary"
                    />
                    <span className="truncate">{t.title}</span>
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
            <Button size="sm" onClick={handleSave} disabled={saving} className="text-xs snake-gradient text-primary-foreground border-0">
              {saving ? "Guardando..." : isEditing ? "Guardar" : "Crear Tarea"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
