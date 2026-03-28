import { motion } from "framer-motion";
import { useState } from "react";

// ── Actualiza estos valores cuando entren ventas reales ──
const INCOME = [
  { project: "Orniture Studio", hoy: 0, semana: 0, mes: 0, currency: "€" },
];

const AI_COSTS = [
  { name: "DeepSeek API", detail: "Chat + Reasoner", mes: 18.40, currency: "$" },
  { name: "Alibaba DashScope", detail: "Qwen VL + STT", mes: 9.20, currency: "$" },
  { name: "Groq (STT backup)", detail: "Whisper", mes: 0, currency: "$" },
];

const totalCostMes = AI_COSTS.reduce((s, c) => s + c.mes, 0);

type Tab = "ingresos" | "gastos";

const RevenueCauldron = () => {
  const [tab, setTab] = useState<Tab>("ingresos");
  const totalIngresos = INCOME.reduce((s, p) => s + p.mes, 0);

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
        <div className="flex items-center gap-2 mb-4">
          <motion.span className="text-xl" animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>💰</motion.span>
          <h2 className="font-display text-sm font-semibold text-foreground tracking-wider uppercase">Ingresos & Gastos</h2>
        </div>

        <div className="flex gap-1 mb-4 bg-border/20 rounded-lg p-1">
          {(["ingresos", "gastos"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-[11px] font-mono py-1 rounded-md transition-all ${
                tab === t ? "bg-border/60 text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "ingresos" ? "📈 Ingresos" : "🔧 Gastos IA"}
            </button>
          ))}
        </div>

        {tab === "ingresos" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {INCOME.map((proj) => (
              <div key={proj.project}>
                <p className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-wider mb-2">{proj.project}</p>
                {[
                  { label: "Hoy", value: proj.hoy },
                  { label: "Esta Semana", value: proj.semana },
                  { label: "Este Mes", value: proj.mes },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                    <span className="text-xs font-mono text-muted-foreground">{row.label}</span>
                    <span className={`text-sm font-mono font-semibold ${row.value === 0 ? "text-muted-foreground" : "text-foreground"}`}>
                      {row.value === 0 ? "—" : `${proj.currency}${row.value.toLocaleString("es-ES")}`}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-border/30 text-center">
              <p className="text-[10px] font-mono text-muted-foreground/60">Lanzamiento en curso</p>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">Los datos aparecerán cuando entren las primeras ventas</p>
            </div>
          </motion.div>
        )}

        {tab === "gastos" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <p className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-wider mb-3">Suscripciones IA · Estimado mensual</p>
            {AI_COSTS.map((cost, i) => (
              <motion.div
                key={cost.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center justify-between py-2 border-b border-border/20 last:border-0"
              >
                <div>
                  <p className="text-xs font-mono text-foreground/90">{cost.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{cost.detail}</p>
                </div>
                <span className={`text-sm font-mono font-semibold ${cost.mes === 0 ? "text-glow-emerald" : "text-foreground"}`}>
                  {cost.mes === 0 ? "Free" : `${cost.currency}${cost.mes.toFixed(2)}`}
                </span>
              </motion.div>
            ))}

            <div className="mt-3 pt-3 border-t border-border/40 flex justify-between items-center">
              <span className="text-xs font-mono text-muted-foreground">Total estimado / mes</span>
              <span className="text-base font-mono font-bold text-foreground">${totalCostMes.toFixed(2)}</span>
            </div>

            <p className="text-[9px] font-mono text-muted-foreground/40 text-center mt-2">
              El coste real se irá actualizando con el tracker de tokens
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RevenueCauldron;
