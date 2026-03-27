import FloatingParticles from "@/components/FloatingParticles";
import MedusaHeader from "@/components/MedusaHeader";
import StatsBar from "@/components/StatsBar";
import AgentGrid from "@/components/AgentGrid";
import RevenueCauldron from "@/components/RevenueCauldron";
import GoalsPanel from "@/components/GoalsPanel";
import ActivityFeed from "@/components/ActivityFeed";
import AnimatedOffice from "@/components/AnimatedOffice";
import TaskBoard from "@/components/TaskBoard";
import ApiCosts from "@/components/ApiCosts";
import { motion } from "framer-motion";
import { useState } from "react";
import { Building2, ClipboardList, DollarSign, LayoutDashboard } from "lucide-react";

type View = "dashboard" | "tareas" | "costos";

const navItems: { id: View; label: string; icon: React.ReactNode; emoji: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-3.5 h-3.5" />, emoji: "🏠" },
  { id: "tareas", label: "Tareas", icon: <ClipboardList className="w-3.5 h-3.5" />, emoji: "📋" },
  { id: "costos", label: "Costos API", icon: <DollarSign className="w-3.5 h-3.5" />, emoji: "💸" },
];

const Index = () => {
  const [view, setView] = useState<View>("dashboard");

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingParticles />

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10">
        <MedusaHeader />

        {/* Navigation Tabs */}
        <div className="px-4 md:px-6 max-w-[1400px] mx-auto mb-4">
          <div className="flex items-center gap-1 p-1 bg-muted/30 backdrop-blur-sm rounded-xl border border-border/30 w-fit">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  view === item.id
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <main className="px-4 md:px-6 pb-10 max-w-[1400px] mx-auto space-y-6">
          {/* Always show the animated office */}
          <AnimatedOffice />

          {view === "dashboard" && (
            <>
              <StatsBar />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 pt-2"
              >
                <div className="h-px flex-1 bg-border/50" />
                <h2 className="font-display text-xs text-muted-foreground tracking-[0.3em] uppercase">
                  Flota de Agentes
                </h2>
                <div className="h-px flex-1 bg-border/50" />
              </motion.div>

              <AgentGrid />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <RevenueCauldron />
                <GoalsPanel />
                <ActivityFeed />
              </div>
            </>
          )}

          {view === "tareas" && <TaskBoard />}

          {view === "costos" && <ApiCosts />}

          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center py-6"
          >
            <p className="text-[10px] font-mono text-muted-foreground/50 tracking-widest uppercase">
              🐍 Medusa v1.0 · OpenClaw Centro de Control · Powered by LobeHub + ClaudeCode
            </p>
          </motion.footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
