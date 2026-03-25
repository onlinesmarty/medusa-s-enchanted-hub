import { motion } from "framer-motion";

interface Agent {
  name: string;
  emoji: string;
  role: string;
  status: "active" | "idle" | "processing";
  taskCompletion: number;
  currentTask: string;
  glowColor: string;
}

const agents: Agent[] = [
  {
    name: "Basilisk",
    emoji: "🐉",
    role: "Data Harvester",
    status: "active",
    taskCompletion: 78,
    currentTask: "Scraping market feeds",
    glowColor: "var(--glow-emerald)",
  },
  {
    name: "Ouroboros",
    emoji: "🔄",
    role: "Pipeline Orchestrator",
    status: "processing",
    taskCompletion: 45,
    currentTask: "Rebuilding data pipeline",
    glowColor: "var(--glow-amethyst)",
  },
  {
    name: "Naga",
    emoji: "🌊",
    role: "API Guardian",
    status: "active",
    taskCompletion: 92,
    currentTask: "Monitoring endpoint health",
    glowColor: "var(--glow-cyan)",
  },
  {
    name: "Jörmungandr",
    emoji: "🌍",
    role: "Deployment Serpent",
    status: "active",
    taskCompletion: 100,
    currentTask: "All containers deployed",
    glowColor: "var(--glow-gold)",
  },
  {
    name: "Hydra",
    emoji: "🔥",
    role: "Multi-Task Handler",
    status: "processing",
    taskCompletion: 63,
    currentTask: "Processing 4 parallel jobs",
    glowColor: "var(--glow-emerald)",
  },
  {
    name: "Quetzalcoatl",
    emoji: "🌈",
    role: "Revenue Alchemist",
    status: "active",
    taskCompletion: 87,
    currentTask: "Optimizing conversion funnels",
    glowColor: "var(--glow-gold)",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-glow-emerald",
  idle: "bg-muted-foreground",
  processing: "bg-glow-amethyst",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  idle: "Idle",
  processing: "Processing",
};

const AgentCard = ({ agent, index }: { agent: Agent; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-5 relative overflow-hidden group cursor-pointer"
    >
      {/* Glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsl(${agent.glowColor} / 0.08), transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
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
              <h3 className="font-display font-semibold text-foreground text-sm tracking-wide">
                {agent.name}
              </h3>
              <p className="text-xs font-mono text-muted-foreground">{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div
              className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`}
              animate={
                agent.status === "processing"
                  ? { opacity: [1, 0.3, 1] }
                  : agent.status === "active"
                  ? { scale: [1, 1.2, 1] }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              {statusLabels[agent.status]}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Task Progress
            </span>
            <span className="text-xs font-mono text-foreground font-semibold">
              {agent.taskCompletion}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, hsl(${agent.glowColor}), hsl(${agent.glowColor} / 0.6))`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${agent.taskCompletion}%` }}
              transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Current task */}
        <p className="text-xs text-muted-foreground font-mono truncate">
          ⚡ {agent.currentTask}
        </p>
      </div>
    </motion.div>
  );
};

const AgentGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent, i) => (
        <AgentCard key={agent.name} agent={agent} index={i} />
      ))}
    </div>
  );
};

export default AgentGrid;
