import { motion } from "framer-motion";

const stats = [
  { label: "Agentes Activos", value: "6", sub: "de 8 total", emoji: "🐍", color: "var(--glow-emerald)" },
  { label: "Tareas Completas", value: "1.247", sub: "esta semana", emoji: "✅", color: "var(--glow-gold)" },
  { label: "Disponibilidad", value: "99,7%", sub: "promedio 30d", emoji: "⚡", color: "var(--glow-cyan)" },
  { label: "Hechizos Lanzados", value: "8.421", sub: "llamadas API hoy", emoji: "🔮", color: "var(--glow-amethyst)" },
];

const StatsBar = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
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
            <p className="text-lg font-mono font-bold text-foreground leading-none">
              {stat.value}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground mt-0.5 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
