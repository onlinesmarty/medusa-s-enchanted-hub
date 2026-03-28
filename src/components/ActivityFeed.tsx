import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function timeAgo(dateStr: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

const AGENT_META: Record<string, { emoji: string; name: string }> = {
  medusa:            { emoji: "🐍", name: "Medusa" },
  "content-creator": { emoji: "✨", name: "Content Creator" },
  "dev-guardian":    { emoji: "🛡️", name: "Dev Guardian" },
  "pm-estrategico":  { emoji: "📋", name: "PM Estratégico" },
  "search-master":   { emoji: "🔍", name: "Search Master" },
  siren:             { emoji: "🧜‍♀️", name: "Siren" },
};

const STATUS_EMOJI: Record<string, string> = {
  done: "✅", in_progress: "⚡", todo: "📌", backlog: "📥", review: "👁️",
};

const TOOL_LABELS: Record<string, string> = {
  create_task:       "Creó tarea",
  read_file:         "Leyó archivo",
  write_file:        "Escribió archivo",
  bash:              "Ejecutó comando",
  web_search:        "Buscó en web",
  transcribe:        "Transcribió audio",
  analyze_image:     "Analizó imagen",
  computer:          "Usó ordenador",
};

const ActivityFeed = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () =>
      fetch("/api/activity")
        .then(r => r.json())
        .then(data => { setItems(data); setLoading(false); })
        .catch(() => setLoading(false));
    load();
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <motion.span className="text-xl" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>⚡</motion.span>
        <h2 className="font-display text-sm font-semibold text-foreground tracking-wider uppercase">Actividad en Vivo</h2>
        {items.length > 0 && (
          <span className="ml-auto text-[10px] font-mono text-muted-foreground">{items.length} eventos</span>
        )}
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {loading ? (
          <p className="text-xs font-mono text-muted-foreground text-center py-4">Cargando...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs font-mono text-muted-foreground">Sin actividad aún</p>
            <p className="text-[10px] font-mono text-muted-foreground/60 mt-1">Habla con Medusa en Discord para verla actuar aquí</p>
          </div>
        ) : (
          items.map((item, i) => {
            if (item.type === "task") {
              const a = AGENT_META[item.assignee] ?? { emoji: "🤖", name: item.assignee };
              return (
                <motion.div
                  key={`task-${item.id}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2.5 py-2 border-b border-border/20 last:border-0"
                >
                  <span className="text-sm mt-0.5">{STATUS_EMOJI[item.status] ?? "📌"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono">{a.emoji} {a.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{timeAgo(item.ts)}</span>
                      <span className={`text-[9px] font-mono px-1 rounded ${
                        item.status === "done" ? "text-emerald-400 bg-emerald-400/10" :
                        item.status === "in_progress" ? "text-blue-400 bg-blue-400/10" :
                        "text-muted-foreground bg-muted/30"
                      }`}>{item.status}</span>
                    </div>
                    <p className="text-xs font-mono text-foreground/80 mt-0.5 truncate">{item.title}</p>
                  </div>
                </motion.div>
              );
            }

            if (item.type === "tool_call") {
              const label = TOOL_LABELS[item.tool] ?? item.tool;
              return (
                <motion.div
                  key={`tool-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2.5 py-2 border-b border-border/20 last:border-0"
                >
                  <span className="text-sm mt-0.5">🐍</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono">Medusa</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{timeAgo(item.ts)}</span>
                      {item.tokens_out > 0 && (
                        <span className="text-[9px] font-mono text-muted-foreground">{(item.tokens_in + item.tokens_out).toLocaleString()} tok</span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-foreground/80 mt-0.5">{label}</p>
                  </div>
                </motion.div>
              );
            }
            return null;
          })
        )}
      </div>
    </motion.div>
  );
};

export default ActivityFeed;
