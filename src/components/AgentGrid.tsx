import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AGENTS } from "@/types/tasks";

const statusColors: Record<string, string> = {
  active:     "bg-primary",
  idle:       "bg-muted-foreground",
  processing: "bg-secondary",
};
const statusLabels: Record<string, string> = {
  active:     "Activa",
  idle:       "Sin tareas",
  processing: "En progreso",
};

function agentStatus(tasks: any[]): "active" | "idle" | "processing" {
  if (tasks.some(t => t.status === "in_progress")) return "active";
  if (tasks.some(t => t.status === "todo" || t.status === "review")) return "processing";
  return "idle";
}

function agentProgress(tasks: any[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter(t => t.status === "done").length;
  return Math.round((done / tasks.length) * 100);
}

function currentTaskLabel(tasks: any[]): string {
  const active = tasks.find(t => t.status === "in_progress")
    ?? tasks.find(t => t.status === "review")
    ?? tasks.find(t => t.status === "todo");
  return active ? active.title : "Sin tareas asignadas";
}

const AgentCard = ({
  agent, index, tasks, costUsd
}: {
  agent: typeof AGENTS[0]; index: number; tasks: any[]; costUsd: number;
}) => {
  const status   = agentStatus(tasks);
  const progress = agentProgress(tasks);
  const task     = currentTaskLabel(tasks);
  const totalTasks = tasks.length;
  const doneTasks  = tasks.filter(t => t.status === "done").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-5 relative overflow-hidden group cursor-pointer"
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
        style={{ background: `radial-gradient(circle at 50% 50%, ${agent.color.replace(")", " / 0.08)")}, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
            >
              {agent.emoji}
            </motion.span>
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm tracking-wide">{agent.name}</h3>
              <p className="text-xs font-mono text-muted-foreground">{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div
              className={`w-2 h-2 rounded-full ${statusColors[status]}`}
              animate={
                status === "active"
                  ? { scale: [1, 1.3, 1] }
                  : status === "processing"
                  ? { opacity: [1, 0.3, 1] }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono text-muted-foreground uppercase">{statusLabels[status]}</span>
          </div>
        </div>

        {/* Progreso real */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Tareas {doneTasks}/{totalTasks}
            </span>
            <span className="text-xs font-mono text-foreground font-semibold">
              {totalTasks === 0 ? "—" : `${progress}%`}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full snake-gradient"
              initial={{ width: 0 }}
              animate={{ width: totalTasks === 0 ? "0%" : `${progress}%` }}
              transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-mono truncate flex-1">
            {totalTasks === 0 ? "Sin tareas asignadas" : `⚡ ${task}`}
          </p>
          <span className="text-[9px] font-mono text-accent ml-2">{agent.model}</span>
        </div>

        <div className="mt-2 text-[10px] font-mono text-muted-foreground">
          {costUsd > 0
            ? `💰 $${costUsd.toFixed(4)} este mes`
            : "💰 Sin uso registrado aún"}
        </div>
      </div>
    </motion.div>
  );
};

const AgentGrid = () => {
  const [tasksByAgent, setTasksByAgent] = useState<Record<string, any[]>>({});
  const [costByAgent, setCostByAgent]   = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const [tasks, usage] = await Promise.all([
          fetch("/api/tasks").then(r => r.json()),
          fetch("/usage/summary").then(r => r.json()).catch(() => ({ by_agent: [] })),
        ]);

        const grouped: Record<string, any[]> = {};
        for (const t of tasks) {
          if (!grouped[t.assignee]) grouped[t.assignee] = [];
          grouped[t.assignee].push(t);
        }
        setTasksByAgent(grouped);

        const costs: Record<string, number> = {};
        for (const a of (usage.by_agent ?? [])) {
          costs[a.agent] = a.cost_usd;
        }
        setCostByAgent(costs);
      } catch {}
    };

    load();
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {AGENTS.map((agent, i) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          index={i}
          tasks={tasksByAgent[agent.id] ?? []}
          costUsd={costByAgent[agent.id] ?? 0}
        />
      ))}
    </div>
  );
};

export default AgentGrid;
