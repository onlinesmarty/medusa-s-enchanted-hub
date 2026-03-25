import { motion } from "framer-motion";

const activities = [
  { time: "hace 2m", agent: "Basilisk", action: "Completó ciclo de recolección #847", emoji: "🐉" },
  { time: "hace 5m", agent: "Naga", action: "Chequeo de salud OK — todos los endpoints verdes", emoji: "🌊" },
  { time: "hace 12m", agent: "Quetzalcoatl", action: "Pico de ingresos detectado: +$340 conversión", emoji: "🌈" },
  { time: "hace 18m", agent: "Hydra", action: "Generó 2 nuevos workers paralelos", emoji: "🔥" },
  { time: "hace 25m", agent: "Jörmungandr", action: "Desplegó v2.4.1 en producción", emoji: "🌍" },
  { time: "hace 31m", agent: "Ouroboros", action: "Rebuild del pipeline en checkpoint 3/7", emoji: "🔄" },
  { time: "hace 45m", agent: "Medusa", action: "Coordinó sincronización completa de la flota", emoji: "🐍" },
];

const ActivityFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <motion.span className="text-xl" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>📜</motion.span>
        <h2 className="font-display text-sm font-semibold text-foreground tracking-wider uppercase">Registro de Hechizos</h2>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
        {activities.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.07 }}
            className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0"
          >
            <span className="text-sm mt-0.5">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-foreground/90">{item.agent}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{item.action}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ActivityFeed;
