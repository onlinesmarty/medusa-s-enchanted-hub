import { motion } from "framer-motion";

const MedusaHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 px-6 py-5 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        {/* Medusa Logo */}
        <motion.div
          className="relative w-12 h-12 rounded-full flex items-center justify-center glow-emerald"
          style={{
            background: "linear-gradient(135deg, hsl(155 60% 45% / 0.2), hsl(270 45% 55% / 0.2))",
            border: "1px solid hsl(155 60% 45% / 0.3)",
          }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-2xl">🐍</span>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid hsl(155 60% 45% / 0.2)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <div>
          <h1 className="text-xl font-display font-bold snake-gradient-text tracking-wider">
            MEDUSA
          </h1>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
            OpenClaw Mission Control
          </p>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 glass-card px-4 py-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-glow-emerald"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs font-mono text-foreground/70">All Systems Enchanted</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 glass-card px-4 py-2">
          <span className="text-xs font-mono text-muted-foreground">LobeHub</span>
          <span className="text-glow-emerald text-xs">●</span>
          <span className="text-xs font-mono text-muted-foreground">ClaudeCode</span>
          <span className="text-glow-gold text-xs">●</span>
        </div>
      </div>
    </motion.header>
  );
};

export default MedusaHeader;
