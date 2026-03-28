import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const AGENT_META: Record<string, { emoji: string; color: string }> = {
  medusa:           { emoji: "🐍", color: "hsl(155 60% 45%)" },
  "content-creator":{ emoji: "✨", color: "hsl(330 70% 60%)" },
  "dev-guardian":   { emoji: "🛡️", color: "hsl(200 70% 50%)" },
  "pm-estrategico": { emoji: "📋", color: "hsl(45 80% 55%)"  },
  "search-master":  { emoji: "🔍", color: "hsl(270 55% 55%)" },
  siren:            { emoji: "🧜‍♀️", color: "hsl(185 70% 50%)" },
};

const PROVIDER_COLOR: Record<string, string> = {
  deepseek: "hsl(210 80% 55%)",
  alibaba:  "hsl(25 90% 55%)",
};

function fmt(n: number) {
  return n < 0.01 ? "<$0.01" : `$${n.toFixed(4)}`;
}

const ApiCosts = () => {
  const [data, setData] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<any[]>([]);

  const load = async () => {
    try {
      const [summary, rec, budgetsRes] = await Promise.all([
        fetch("/usage/summary").then(r => r.json()),
        fetch("/usage/recent?limit=15").then(r => r.json()),
        fetch("/api/image-budgets").then(r => r.json()).catch(() => ({ budgets: [] })),
      ]);
      setBudgets(budgetsRes.budgets ?? []);
      setData(summary);
      setRecent(rec);
    } catch {
      // proxy aún sin datos
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  const dailyBar = data?.daily?.slice(0, 7).reverse().map((d: any) => ({
    date: d.date?.slice(5),
    cost: d.cost_usd,
    tokens: d.tokens,
    calls: d.calls,
  })) ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Hoy", data: data?.hoy },
          { label: "Esta Semana", data: data?.semana },
          { label: "Este Mes", data: data?.mes },
          { label: "Total", data: data?.total },
        ].map(({ label, data: d }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className="text-lg font-mono font-bold text-foreground">
              {loading ? "—" : d ? fmt(d.cost_usd) : "$0.00"}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">
              {loading ? "" : d ? `${(d.tokens/1000).toFixed(1)}K tokens · ${d.calls} calls` : "0 tokens"}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Por proveedor */}
        <div className="glass-card p-5">
          <h3 className="font-display text-xs font-semibold text-foreground tracking-wider uppercase mb-4">Por Proveedor</h3>
          {!data || data.by_provider.length === 0 ? (
            <p className="text-xs font-mono text-muted-foreground text-center py-6">
              Sin datos aún — los tokens aparecerán tras la próxima conversación con Medusa
            </p>
          ) : (
            <div className="space-y-3">
              {data.by_provider.map((p: any) => {
                const maxCost = Math.max(...data.by_provider.map((x: any) => x.cost_usd), 0.001);
                return (
                  <div key={p.provider}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-mono text-foreground capitalize">{p.provider}</span>
                      <div className="text-right">
                        <span className="text-xs font-mono font-semibold">{fmt(p.cost_usd)}</span>
                        <span className="text-[10px] font-mono text-muted-foreground ml-2">{(p.tokens/1000).toFixed(1)}K tok</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${(p.cost_usd / maxCost) * 100}%`,
                        backgroundColor: PROVIDER_COLOR[p.provider] ?? "hsl(200 70% 50%)"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Por agente */}
        <div className="glass-card p-5">
          <h3 className="font-display text-xs font-semibold text-foreground tracking-wider uppercase mb-4">Por Agente (30 días)</h3>
          {!data || data.by_agent.length === 0 ? (
            <p className="text-xs font-mono text-muted-foreground text-center py-6">Sin datos aún</p>
          ) : (
            <div className="space-y-2">
              {data.by_agent.map((a: any) => {
                const meta = AGENT_META[a.agent] ?? { emoji: "🤖", color: "hsl(220 10% 50%)" };
                const maxCost = Math.max(...data.by_agent.map((x: any) => x.cost_usd), 0.001);
                return (
                  <div key={a.agent}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{meta.emoji}</span>
                      <span className="text-xs font-mono flex-1">{a.agent}</span>
                      <span className="text-xs font-mono font-semibold">{fmt(a.cost_usd)}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{a.calls} calls</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden ml-6">
                      <div className="h-full rounded-full" style={{
                        width: `${(a.cost_usd / maxCost) * 100}%`,
                        backgroundColor: meta.color
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Gráfica diaria */}
      {dailyBar.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-display text-xs font-semibold text-foreground tracking-wider uppercase mb-4">Coste Diario (últimos 7 días)</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={dailyBar} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "monospace" }} />
              <YAxis tick={{ fontSize: 10, fontFamily: "monospace" }} tickFormatter={v => `$${v.toFixed(3)}`} />
              <Tooltip
                formatter={(v: number) => [`$${v.toFixed(4)}`, "Coste"]}
                contentStyle={{ background: "hsl(222 20% 8%)", border: "1px solid hsl(222 15% 20%)", borderRadius: 8, fontSize: 11 }}
              />
              <Bar dataKey="cost" radius={[3,3,0,0]}>
                {dailyBar.map((_: any, i: number) => (
                  <Cell key={i} fill="hsl(155 60% 45%)" fillOpacity={0.7 + (i / dailyBar.length) * 0.3} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Últimas llamadas */}
      <div className="glass-card p-5">
        <h3 className="font-display text-xs font-semibold text-foreground tracking-wider uppercase mb-4">Últimas Llamadas API</h3>
        {recent.length === 0 ? (
          <p className="text-xs font-mono text-muted-foreground text-center py-4">
            Las llamadas aparecerán aquí en tiempo real tras hablar con Medusa en Discord
          </p>
        ) : (
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            <div className="grid grid-cols-5 gap-2 text-[10px] font-mono text-muted-foreground border-b border-border/30 pb-1 mb-1">
              <span>Hora</span><span>Agente</span><span>Modelo</span><span>Tokens</span><span className="text-right">Coste</span>
            </div>
            {recent.map((r: any, i: number) => (
              <div key={i} className="grid grid-cols-5 gap-2 text-[10px] font-mono py-0.5 border-b border-border/10 last:border-0">
                <span className="text-muted-foreground">{r.ts?.slice(11,16)}</span>
                <span>{AGENT_META[r.agent]?.emoji ?? "🤖"} {r.agent}</span>
                <span className="text-muted-foreground truncate">{r.model}</span>
                <span>{r.total_tokens?.toLocaleString()}</span>
                <span className="text-right text-glow-emerald">{fmt(r.cost_usd)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Créditos de imagen */}
      {budgets.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-display text-xs font-semibold text-foreground tracking-wider uppercase mb-4">Créditos de Imagen</h3>
          <div className="space-y-3">
            {budgets.map((b: any) => {
              const balance = b.balance_usd;
              const spent = b.spent_usd ?? 0;
              const total = balance !== null ? balance : 0;
              const pct = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
              const remaining = balance !== null ? balance - spent : null;
              const approxImages = remaining !== null ? Math.floor(remaining / b.price_per_image) : null;
              return (
                <div key={b.provider}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{b.emoji}</span>
                    <span className="text-xs font-mono flex-1 font-semibold">{b.provider}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{b.model}</span>
                    {remaining !== null && (
                      <span className="text-xs font-mono font-bold text-glow-emerald">${remaining.toFixed(2)}</span>
                    )}
                  </div>
                  {balance !== null && (
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden ml-6">
                      <div className="h-full rounded-full bg-emerald-500/70" style={{ width: `${100 - pct}%` }} />
                    </div>
                  )}
                  <p className="text-[10px] font-mono text-muted-foreground ml-6 mt-1">
                    {b.note}{approxImages !== null ? ` · ~${approxImages} imágenes restantes` : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default ApiCosts;
