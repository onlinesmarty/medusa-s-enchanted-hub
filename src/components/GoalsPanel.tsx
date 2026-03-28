import { motion } from "framer-motion";

const goals = [
  { name: "Ventas Q2 Orniture", progress: 28, target: "€150K", emoji: "🛋️" },
  { name: "Artículos Blog SEO/GEO", progress: 20, target: "50 posts", emoji: "✍️" },
  { name: "Productos con GEO", progress: 10, target: "2.000 fichas", emoji: "🔍" },
  { name: "Seguidores TikTok", progress: 45, target: "10K seguidores", emoji: "🎬" },
];

const GoalsPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <motion.span className="text-xl" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>🎯</motion.span>
        <h2 className="font-display text-sm font-semibold text-foreground tracking-wider uppercase">Metas de Misión</h2>
      </div>

      <div className="space-y-4">
        {goals.map((goal, i) => (
          <motion.div key={goal.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{goal.emoji}</span>
                <span className="text-xs font-mono text-foreground/80">{goal.name}</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{goal.target}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full snake-gradient" initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }} transition={{ delay: 0.9 + i * 0.1, duration: 1, ease: "easeOut" }} />
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-[10px] font-mono text-muted-foreground">{goal.progress}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GoalsPanel;
