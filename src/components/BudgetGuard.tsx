import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Budget {
  limit_eur: number;
  spent_eur: number;
  remaining_eur: number;
  percent_used: number;
  blocked: boolean;
  warning: boolean;
  month: string;
}

const BudgetGuard = () => {
  const [budget, setBudget] = useState<Budget | null>(null);

  useEffect(() => {
    const load = () =>
      fetch("/budget").then(r => r.json()).then(setBudget).catch(() => {});
    load();
    const iv = setInterval(load, 60000);
    return () => clearInterval(iv);
  }, []);

  if (!budget) return null;

  const pct = budget.percent_used;
  const color = budget.blocked
    ? "hsl(0 70% 55%)"
    : budget.warning
    ? "hsl(38 90% 55%)"
    : "hsl(155 60% 45%)";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        {/* Barra */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground">IA</span>
          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(pct, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] font-mono" style={{ color }}>
            €{budget.spent_eur.toFixed(2)}/€{budget.limit_eur}
          </span>
        </div>

        {/* Alerta si bloqueado o en warning */}
        {budget.blocked && (
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-[10px] font-mono text-red-400 font-semibold"
          >
            ⛔ LÍMITE ALCANZADO
          </motion.span>
        )}
        {!budget.blocked && budget.warning && (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] font-mono text-amber-400"
          >
            ⚠ {pct.toFixed(0)}% usado
          </motion.span>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BudgetGuard;
