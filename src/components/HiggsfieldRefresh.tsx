import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function HiggsfieldRefresh() {
  const [status, setStatus] = useState<any>(null);
  const [curl, setCurl] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/higgsfield/status").then(r => r.json()).then(setStatus);
  }, []);

  const save = async () => {
    if (!curl.trim()) return;
    setSaving(true); setMsg("");
    try {
      const r = await fetch("/api/higgsfield/cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curl }),
      });
      const d = await r.json();
      if (d.ok) {
        setMsg(`✅ ${d.cookies_updated} cookies actualizadas`);
        setCurl("");
        const s = await fetch("/api/higgsfield/status").then(x => x.json());
        setStatus(s);
      } else {
        setMsg(`❌ Error: ${d.detail || JSON.stringify(d)}`);
      }
    } catch (e: any) {
      setMsg(`❌ ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎨</span>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider">Higgsfield Session</h3>
        <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full ${status?.configured ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
          {status?.configured ? "✓ Configurado" : "⚠ Sin configurar"}
        </span>
      </div>

      {status?.configured && (
        <p className="text-xs font-mono text-muted-foreground">
          Cookies: {status.keys?.join(", ")}
        </p>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs font-mono text-muted-foreground">
          Pega aquí el cURL de cualquier request de higgsfield.ai (Network tab → Copy as cURL)
        </Label>
        <Textarea
          value={curl}
          onChange={e => setCurl(e.target.value)}
          placeholder={'curl "https://higgsfield.ai/..." -b "brwsr=...; __client=...; cf_clearance=..."'}
          className="bg-muted border-border text-xs font-mono resize-none"
          rows={4}
        />
      </div>

      {msg && (
        <p className="text-xs font-mono text-center">{msg}</p>
      )}

      <Button
        size="sm"
        onClick={save}
        disabled={saving || !curl.trim()}
        className="w-full text-xs snake-gradient text-primary-foreground border-0"
      >
        {saving ? "Actualizando..." : "🔄 Actualizar cookies de sesión"}
      </Button>

      <p className="text-[10px] font-mono text-muted-foreground text-center">
        Necesario solo cuando DataDome bloquee (cada semanas/meses)
      </p>
    </div>
  );
}
