import { motion } from "framer-motion";
import { AGENTS } from "@/types/tasks";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

const dailyCosts = [
  { day: "Lun", total: 14.20 },
  { day: "Mar", total: 18.50 },
  { day: "Mié", total: 12.80 },
  { day: "Jue", total: 22.10 },
  { day: "Vie", total: 16.90 },
  { day: "Sáb", total: 8.40 },
  { day: "Dom", total: 5.20 },
];

const ApiCosts = () => {
  const totalDaily = AGENTS.reduce((sum, a) => sum + a.apiCostPerDay, 0);
  const totalMonthly = totalDaily * 30;

  const pieData = useMemo(() =>
    AGENTS.map(a => ({
      name: a.name,
      value: a.apiCostPerDay,
      color: a.color,
      model: a.model,
      emoji: a.emoji,
    })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-5">
        <motion.span className="text-lg" animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>💸</motion.span>
        <h2 className="font-display text-sm font-semibold text-foreground tracking-wider uppercase">
          Costos de APIs
        </h2>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase">Hoy</p>
          <p className="text-lg font-mono font-bold text-foreground">${totalDaily.toFixed(2)}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase">Esta Semana</p>
          <p className="text-lg font-mono font-bold text-accent">${(totalDaily * 7).toFixed(2)}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase">Est. Mensual</p>
          <p className="text-lg font-mono font-bold snake-gradient-text">${totalMonthly.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar chart - weekly */}
        <div>
          <h3 className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wide">Gasto Semanal</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dailyCosts}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(220 10% 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(220 10% 55%)" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={35} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 20% 10%)",
                  border: "1px solid hsl(220 15% 18%)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, "Costo"]}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {dailyCosts.map((_, i) => (
                  <Cell key={i} fill={`hsl(155 60% ${40 + i * 5}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart - by agent */}
        <div>
          <h3 className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wide">Por Agente (diario)</h3>
          <div className="flex items-center gap-2">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220 20% 10%)",
                    border: "1px solid hsl(220 15% 18%)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                  formatter={(v: number) => [`$${v.toFixed(2)}/día`, "Costo"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {pieData.map(a => (
                <div key={a.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                  <span className="text-[10px] font-mono text-foreground/80 flex-1 truncate">{a.emoji} {a.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">${a.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agent detail table */}
      <div className="mt-5">
        <h3 className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wide">Detalle por Agente</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-1.5 text-muted-foreground font-normal">Agente</th>
                <th className="text-left py-1.5 text-muted-foreground font-normal">Modelo</th>
                <th className="text-right py-1.5 text-muted-foreground font-normal">$/día</th>
                <th className="text-right py-1.5 text-muted-foreground font-normal">$/mes (est.)</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map(a => (
                <tr key={a.id} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                  <td className="py-1.5 text-foreground">{a.emoji} {a.name}</td>
                  <td className="py-1.5 text-muted-foreground">{a.model}</td>
                  <td className="py-1.5 text-right text-accent">${a.apiCostPerDay.toFixed(2)}</td>
                  <td className="py-1.5 text-right text-foreground">${(a.apiCostPerDay * 30).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="py-1.5 text-foreground" colSpan={2}>Total</td>
                <td className="py-1.5 text-right text-primary">${totalDaily.toFixed(2)}</td>
                <td className="py-1.5 text-right snake-gradient-text">${totalMonthly.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 p-2 bg-muted/30 rounded-lg">
        <p className="text-[10px] font-mono text-muted-foreground text-center">
          ⚡ Datos mock — Conecta tus APIs (OpenAI, Anthropic, Perplexity) para costos en tiempo real
        </p>
      </div>
    </motion.div>
  );
};

export default ApiCosts;
