import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Task, TaskStatus, STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS, PRIORITY_LABELS, AGENTS } from "@/types/tasks";
import { mockTasks } from "@/data/mockTasks";
import TaskDialog from "@/components/TaskDialog";
import TaskTimeline from "@/components/TaskTimeline";
import { Plus, LayoutGrid, GanttChart, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const statusOrder: TaskStatus[] = ["backlog", "todo", "in_progress", "review", "done"];

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  const agent = AGENTS.find(a => a.id === task.assignee);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className="glass-card p-3 cursor-pointer hover:border-primary/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-xs font-mono font-semibold text-foreground leading-tight flex-1 mr-2">
          {task.title}
        </h4>
        <span
          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
          style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
          title={PRIORITY_LABELS[task.priority]}
        />
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map(tag => (
            <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}

      {task.progress > 0 && task.progress < 100 && (
        <div className="h-1 bg-muted rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full snake-gradient" style={{ width: `${task.progress}%` }} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {agent && (
            <>
              <span className="text-xs">{agent.emoji}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{agent.name}</span>
            </>
          )}
        </div>
        {task.dueDate && (
          <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-0.5">
            <Calendar className="w-2.5 h-2.5" />
            {new Date(task.dueDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
          </span>
        )}
      </div>

      {task.dependencies.length > 0 && (
        <div className="mt-1.5 flex items-center gap-1">
          <span className="text-[9px] text-muted-foreground font-mono">🔗 {task.dependencies.length} dep.</span>
        </div>
      )}

      {task.apiCost > 0 && (
        <div className="mt-1 text-[9px] font-mono text-accent">
          💰 ${task.apiCost.toFixed(2)}
        </div>
      )}
    </motion.div>
  );
};

const KanbanColumn = ({
  status,
  tasks,
  onTaskClick,
  onMoveTask,
}: {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
}) => {
  const columnTasks = tasks.filter(t => t.status === status);

  return (
    <div className="flex-1 min-w-[200px]">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] }} />
        <h3 className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
          {STATUS_LABELS[status]}
        </h3>
        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{columnTasks.length}</Badge>
      </div>
      <div className="space-y-2 min-h-[100px]">
        <AnimatePresence>
          {columnTasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterAgent, setFilterAgent] = useState<string | null>(null);

  const filteredTasks = filterAgent ? tasks.filter(t => t.assignee === filterAgent) : tasks;

  const handleSaveTask = (task: Task) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      if (exists) return prev.map(t => t.id === task.id ? task : t);
      return [...prev, task];
    });
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, status: newStatus, progress: newStatus === "done" ? 100 : t.progress }
        : t
    ));
  };

  const openNewTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.span className="text-lg" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>📋</motion.span>
          <h2 className="font-display text-sm font-semibold text-foreground tracking-wider uppercase">
            Gestión de Tareas
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Agent filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-muted-foreground" />
            <select
              value={filterAgent || ""}
              onChange={e => setFilterAgent(e.target.value || null)}
              className="text-[10px] font-mono bg-muted border border-border rounded px-1.5 py-0.5 text-foreground"
            >
              <option value="">Todas</option>
              {AGENTS.map(a => (
                <option key={a.id} value={a.id}>{a.emoji} {a.name}</option>
              ))}
            </select>
          </div>
          <Button size="sm" onClick={openNewTask} className="h-7 text-xs gap-1 snake-gradient text-primary-foreground border-0">
            <Plus className="w-3 h-3" /> Nueva Tarea
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList className="mb-4 bg-muted/50 h-8">
          <TabsTrigger value="kanban" className="text-xs gap-1 h-6"><LayoutGrid className="w-3 h-3" /> Kanban</TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs gap-1 h-6"><GanttChart className="w-3 h-3" /> Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {statusOrder.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={filteredTasks}
                onTaskClick={openEditTask}
                onMoveTask={handleMoveTask}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <TaskTimeline tasks={filteredTasks} onTaskClick={openEditTask} />
        </TabsContent>
      </Tabs>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        allTasks={tasks}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </motion.div>
  );
};

export default TaskBoard;
