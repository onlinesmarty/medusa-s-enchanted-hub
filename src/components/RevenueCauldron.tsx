import { motion } from "framer-motion";

const revenueData = [
  { label: "Hoy", value: "$2.847", trend: "+12%" },
  { label: "Esta Semana", value: "$18.392", trend: "+8%" },
  { label: "Este Mes", value: "$67.241", trend: "+23%" },
];

const RevenueCauldron = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute w-40 h-40 rounded-full -bottom-10 -right-10"
          style={{ background: "radial-gradient(circle, hsl(var(--glow-gold) / 0.15), transparent)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-5">
          <motion.span className="text-xl" animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>🏆</motion.span>
          <h2 className="font-display text-sm font-semibold text-foreground tracking-wider uppercase">Caldero de Ingresos</h2>
        </div>

        <div className="space-y-4">
          {revenueData.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }} className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-semibold text-foreground">{item.value}</span>
                <span className="text-xs font-mono text-glow-emerald">{item.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 flex items-end gap-1 h-12">
          {[35, 45, 30, 60, 50, 70, 55, 80, 65, 90, 75, 95].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm"
              style={{ background: "linear-gradient(to top, hsl(var(--glow-gold) / 0.6), hsl(var(--glow-gold) / 0.15))" }}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.8 + i * 0.05, duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RevenueCauldron;
