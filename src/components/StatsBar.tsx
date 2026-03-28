import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const StatsBar = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    doneTasks: 0,
    inProgressTasks: 0,
    callsToday: 0,
    costToday: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [tasks, usage] = await Promise.all([
          fetch("/api/tasks").then(r => r.json()),
          fetch("/usage/summary").then(r => r.json()).catch(() => ({ hoy: { calls: 0, cost_usd: 0 } })),
        ]);
        setStats({
          totalTasks:      tasks.length,
          doneTasks:       tasks.filter((t: any) => t.status === "done").length,
          inProgressTasks: tasks.filter((t: any) => t.status === "in_progress").length,
          callsToday:      usage?.hoy?.calls ?? 0,
          costToday:       usage?.hoy?.cost_usd ?? 0,
        });
      } catch {}
    };
    load();
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, []);

  const items = [
    {
      label: "Agentes",
      value: "6",
      sub: "configurados",
      emoji: "🐍",
      color: "var(--glow-emerald)",
    },
    {
      label: "Tareas",
      value: stats.totalTasks.toString(),
      sub: `${stats.doneTasks} completadas`,
      emoji: "✅",
      color: "var(--glow-gold)",
    },
    {
      label: "En Progreso",
      value: stats.inProgressTasks.toString(),
      sub: "tareas activas",
      emoji: "⚡",
      color: "var(--glow-cyan)",
    },
    {
      label: "API Hoy",
      value: stats.callsToday.toString(),
      sub: stats.costToday > 0 ? `$${stats.costToday.toFixed(4)}` : "sin uso hoy",
      emoji: "🔮",
      color: "var(--glow-amethyst)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
          className="glass-card px-4 py-4 flex items-center gap-3"
        >
          <motion.span
            className="text-xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            {stat.emoji}
          </motion.span>
          <div>
            <p className="text-lg font-mono font-bold text-foreground leading-none">{stat.value}</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-0.5 uppercase tracking-wider">{stat.label}</p>
            <p className="text-[9px] font-mono text-muted-foreground/60">{stat.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
