import { motion } from "framer-motion";
import { AGENTS } from "@/types/tasks";

const statusLabels: Record<string, string> = {
  active: "Activa",
  idle: "Inactiva",
  processing: "Procesando",
};

const agentStatuses: Record<string, { status: "active" | "idle" | "processing"; taskCompletion: number; currentTask: string }> = {
  "medusa": { status: "active", taskCompletion: 88, currentTask: "Coordinando deploy nocturno" },
  "content-creator": { status: "processing", taskCompletion: 45, currentTask: "Creando landing page Q2" },
  "dev-guardian": { status: "active", taskCompletion: 65, currentTask: "Migrando API a v3" },
  "pm-estrategico": { status: "active", taskCompletion: 100, currentTask: "Sprint planning completado" },
  "search-master": { status: "processing", taskCompletion: 80, currentTask: "Research competencia" },
  "siren": { status: "active", taskCompletion: 40, currentTask: "Configurando alertas Slack" },
};

const statusColors: Record<string, string> = {
  active: "bg-primary",
  idle: "bg-muted-foreground",
  processing: "bg-secondary",
};

const AgentCard = ({ agent, index }: { agent: typeof AGENTS[0]; index: number }) => {
  const info = agentStatuses[agent.id] || { status: "idle", taskCompletion: 0, currentTask: "Sin tareas" };

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
        style={{
          background: `radial-gradient(circle at 50% 50%, ${agent.color.replace(")", " / 0.08)")}, transparent 70%)`,
        }}
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
              className={`w-2 h-2 rounded-full ${statusColors[info.status]}`}
              animate={
                info.status === "processing"
                  ? { opacity: [1, 0.3, 1] }
                  : info.status === "active"
                  ? { scale: [1, 1.2, 1] }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono text-muted-foreground uppercase">{statusLabels[info.status]}</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Progreso</span>
            <span className="text-xs font-mono text-foreground font-semibold">{info.taskCompletion}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full snake-gradient"
              initial={{ width: 0 }}
              animate={{ width: `${info.taskCompletion}%` }}
              transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-mono truncate flex-1">⚡ {info.currentTask}</p>
          <span className="text-[9px] font-mono text-accent ml-2">{agent.model}</span>
        </div>

        <div className="mt-2 text-[10px] font-mono text-muted-foreground">
          💰 ${agent.apiCostPerDay.toFixed(2)}/día
        </div>
      </div>
    </motion.div>
  );
};

const AgentGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {AGENTS.map((agent, i) => (
        <AgentCard key={agent.id} agent={agent} index={i} />
      ))}
    </div>
  );
};

export default AgentGrid;
