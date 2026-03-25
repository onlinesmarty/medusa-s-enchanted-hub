import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface AgentCharacter {
  id: string;
  name: string;
  emoji: string;
  color: string;
  desk: { x: number; y: number };
  status: "working" | "walking" | "talking" | "idle";
}

const agents: AgentCharacter[] = [
  { id: "medusa", name: "Medusa", emoji: "🐍", color: "hsl(155 60% 45%)", desk: { x: 50, y: 35 }, status: "working" },
  { id: "basilisk", name: "Basilisk", emoji: "🐉", color: "hsl(270 45% 55%)", desk: { x: 15, y: 55 }, status: "working" },
  { id: "ouroboros", name: "Ouroboros", emoji: "🔄", color: "hsl(200 60% 50%)", desk: { x: 82, y: 55 }, status: "working" },
  { id: "naga", name: "Naga", emoji: "🌊", color: "hsl(185 70% 50%)", desk: { x: 30, y: 72 }, status: "working" },
  { id: "hydra", name: "Hydra", emoji: "🔥", color: "hsl(15 80% 55%)", desk: { x: 68, y: 72 }, status: "working" },
  { id: "quetzal", name: "Quetzalcoatl", emoji: "🌈", color: "hsl(45 80% 55%)", desk: { x: 50, y: 85 }, status: "working" },
];

const chatMessages = [
  { from: "Medusa", to: "Basilisk", msg: "Necesito los datos del scraping 🐍" },
  { from: "Basilisk", to: "Medusa", msg: "¡Enviando 847 registros! 📊" },
  { from: "Naga", to: "Hydra", msg: "¿Puedes verificar el endpoint /api/v2?" },
  { from: "Hydra", to: "Naga", msg: "¡Todo verde! 4 workers activos 🔥" },
  { from: "Ouroboros", to: "Medusa", msg: "Pipeline rebuild al 65% ⚙️" },
  { from: "Quetzalcoatl", to: "Medusa", msg: "¡+$340 en conversiones! 💰" },
  { from: "Medusa", to: "Quetzal", msg: "Excelente, optimiza el funnel B ✨" },
  { from: "Basilisk", to: "Ouroboros", msg: "Los feeds están listos para el pipeline" },
];

/* Isometric desk SVG */
const Desk = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Desk surface */}
    <path d="M-22,0 L0,-11 L22,0 L0,11 Z" fill="hsl(25 40% 35%)" stroke="hsl(25 30% 25%)" strokeWidth="0.5" />
    {/* Desk front */}
    <path d="M-22,0 L-22,6 L0,17 L0,11 Z" fill="hsl(25 35% 28%)" />
    <path d="M22,0 L22,6 L0,17 L0,11 Z" fill="hsl(25 30% 22%)" />
    {/* Monitor */}
    <rect x="-6" y="-18" width="12" height="9" rx="1" fill="hsl(220 40% 15%)" stroke="hsl(220 20% 25%)" strokeWidth="0.5" />
    <rect x="-5" y="-17" width="10" height="7" rx="0.5" fill="hsl(155 60% 45% / 0.3)" />
    {/* Monitor stand */}
    <rect x="-1" y="-9" width="2" height="3" fill="hsl(220 10% 30%)" />
    {/* Blinking screen light */}
    <motion.rect
      x="-4" y="-16" width="3" height="1" rx="0.3"
      fill="hsl(155 60% 60%)"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: Math.random() * 2 }}
    />
    <motion.rect
      x="0" y="-14" width="4" height="0.5" rx="0.2"
      fill="hsl(45 80% 55% / 0.5)"
      animate={{ width: [2, 4, 3, 4] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </g>
);

/* Cute plant */
const Plant = ({ x, y, variant = 0 }: { x: number; y: number; variant?: number }) => (
  <motion.g
    transform={`translate(${x}, ${y})`}
    animate={{ y: [0, -1, 0] }}
    transition={{ duration: 3 + variant, repeat: Infinity, ease: "easeInOut" }}
  >
    {/* Pot */}
    <path d="M-4,0 L-3,-6 L3,-6 L4,0 Z" fill="hsl(15 60% 40%)" />
    <ellipse cx="0" cy="-6" rx="3.5" ry="1.2" fill="hsl(15 50% 35%)" />
    {/* Leaves */}
    {variant % 2 === 0 ? (
      <>
        <ellipse cx="-2" cy="-10" rx="2" ry="3" fill="hsl(140 50% 40%)" transform="rotate(-15, -2, -10)" />
        <ellipse cx="2" cy="-11" rx="2" ry="3.5" fill="hsl(150 55% 35%)" transform="rotate(10, 2, -11)" />
        <ellipse cx="0" cy="-12" rx="1.5" ry="3" fill="hsl(145 50% 45%)" />
      </>
    ) : (
      <>
        <line x1="0" y1="-6" x2="0" y2="-14" stroke="hsl(140 40% 35%)" strokeWidth="1" />
        <circle cx="-2" cy="-12" r="2" fill="hsl(140 50% 40%)" />
        <circle cx="2" cy="-13" r="1.8" fill="hsl(150 55% 38%)" />
        <circle cx="0" cy="-15" r="2.2" fill="hsl(145 45% 42%)" />
      </>
    )}
  </motion.g>
);

/* Agent character with bobbing animation */
const AgentSprite = ({
  agent,
  position,
  isTalking,
}: {
  agent: AgentCharacter;
  position: { x: number; y: number };
  isTalking: boolean;
}) => (
  <motion.g
    animate={{ x: position.x, y: position.y }}
    transition={{ type: "spring", stiffness: 30, damping: 15, mass: 1 }}
  >
    {/* Shadow */}
    <ellipse cx="0" cy="4" rx="6" ry="2" fill="hsl(0 0% 0% / 0.2)" />

    {/* Body */}
    <motion.g
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Body shape */}
      <ellipse cx="0" cy="-4" rx="5" ry="6" fill={agent.color} opacity="0.9" />
      {/* Face circle */}
      <circle cx="0" cy="-8" r="5" fill={agent.color} />
      {/* Eyes */}
      <motion.g
        animate={isTalking ? { scaleY: [1, 0.2, 1] } : {}}
        transition={{ duration: 0.3, repeat: isTalking ? Infinity : 0, repeatDelay: 1.5 }}
      >
        <circle cx="-2" cy="-9" r="1" fill="hsl(0 0% 100%)" />
        <circle cx="2" cy="-9" r="1" fill="hsl(0 0% 100%)" />
        <circle cx="-1.7" cy="-9" r="0.5" fill="hsl(0 0% 10%)" />
        <circle cx="2.3" cy="-9" r="0.5" fill="hsl(0 0% 10%)" />
      </motion.g>
      {/* Mouth */}
      {isTalking ? (
        <motion.ellipse
          cx="0" cy="-6" rx="1.5" ry="1"
          fill="hsl(0 0% 10%)"
          animate={{ ry: [0.5, 1.2, 0.5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      ) : (
        <path d="M-1.5,-6.5 Q0,-5 1.5,-6.5" stroke="hsl(0 0% 10%)" strokeWidth="0.5" fill="none" />
      )}
      {/* Emoji badge */}
      <text x="0" y="-14" textAnchor="middle" fontSize="6">{agent.emoji}</text>
    </motion.g>

    {/* Name tag */}
    <g transform="translate(0, 10)">
      <rect x="-14" y="-4" width="28" height="9" rx="3" fill="hsl(220 20% 10% / 0.85)" stroke={agent.color} strokeWidth="0.5" />
      <text x="0" y="2.5" textAnchor="middle" fontSize="4" fill="hsl(0 0% 90%)" fontFamily="monospace">
        {agent.name}
      </text>
    </g>
  </motion.g>
);

/* Chat bubble floating between agents */
const ChatBubble = ({
  message,
  fromPos,
  onComplete,
}: {
  message: string;
  fromPos: { x: number; y: number };
  onComplete: () => void;
}) => (
  <motion.g
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: [0, 1, 1, 0], y: [0, -25, -25, -35] }}
    transition={{ duration: 3.5, ease: "easeOut" }}
    onAnimationComplete={onComplete}
  >
    <motion.g transform={`translate(${fromPos.x}, ${fromPos.y - 25})`}>
      {/* Bubble */}
      <rect x="-40" y="-12" width="80" height="16" rx="5" fill="hsl(220 20% 12% / 0.92)" stroke="hsl(155 60% 45% / 0.4)" strokeWidth="0.5" />
      {/* Tail */}
      <path d="M-3,4 L0,8 L3,4" fill="hsl(220 20% 12% / 0.92)" />
      {/* Text */}
      <text x="0" y="0" textAnchor="middle" fontSize="3.2" fill="hsl(0 0% 85%)" fontFamily="monospace">
        {message.length > 30 ? message.slice(0, 30) + "…" : message}
      </text>
    </motion.g>
  </motion.g>
);

/* Floor tiles (isometric grid) */
const IsometricFloor = () => {
  const tiles: JSX.Element[] = [];
  const cols = 10;
  const rows = 6;
  const tileW = 36;
  const tileH = 18;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - r) * (tileW / 2) + 200;
      const y = (c + r) * (tileH / 2) + 20;
      const isAlt = (r + c) % 2 === 0;
      tiles.push(
        <path
          key={`${r}-${c}`}
          d={`M${x},${y} L${x + tileW / 2},${y - tileH / 2} L${x + tileW},${y} L${x + tileW / 2},${y + tileH / 2} Z`}
          fill={isAlt ? "hsl(220 20% 12%)" : "hsl(220 18% 14%)"}
          stroke="hsl(220 15% 18% / 0.5)"
          strokeWidth="0.3"
        />
      );
    }
  }
  return <g>{tiles}</g>;
};

/* Bookshelf decoration */
const Bookshelf = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Shelf frame */}
    <rect x="-12" y="-20" width="24" height="22" rx="1" fill="hsl(25 35% 25%)" stroke="hsl(25 25% 18%)" strokeWidth="0.5" />
    {/* Shelves */}
    <rect x="-11" y="-10" width="22" height="0.8" fill="hsl(25 30% 20%)" />
    {/* Books */}
    <rect x="-9" y="-19" width="3" height="8" rx="0.3" fill="hsl(0 60% 45%)" />
    <rect x="-5" y="-18" width="2.5" height="7" rx="0.3" fill="hsl(210 50% 45%)" />
    <rect x="-2" y="-19" width="3" height="8" rx="0.3" fill="hsl(45 70% 50%)" />
    <rect x="2" y="-17" width="2" height="6" rx="0.3" fill="hsl(155 50% 40%)" />
    <rect x="5" y="-19" width="3" height="8" rx="0.3" fill="hsl(270 45% 45%)" />
    {/* Lower shelf books */}
    <rect x="-8" y="-9" width="4" height="7" rx="0.3" fill="hsl(30 50% 45%)" />
    <rect x="-3" y="-8" width="3" height="6" rx="0.3" fill="hsl(180 40% 40%)" />
    <rect x="2" y="-9" width="3.5" height="7" rx="0.3" fill="hsl(340 50% 45%)" />
    <rect x="7" y="-8" width="2" height="6" rx="0.3" fill="hsl(60 50% 45%)" />
  </g>
);

/* Coffee machine */
const CoffeeMachine = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-5" y="-12" width="10" height="14" rx="1.5" fill="hsl(0 0% 25%)" stroke="hsl(0 0% 20%)" strokeWidth="0.5" />
    <rect x="-3" y="-10" width="6" height="4" rx="0.5" fill="hsl(0 0% 15%)" />
    <motion.circle cx="0" cy="-8" r="1" fill="hsl(155 60% 45%)" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
    {/* Cup */}
    <rect x="-2" y="-1" width="4" height="3" rx="0.5" fill="hsl(0 0% 90%)" />
    {/* Steam */}
    <motion.path
      d="M-1,-2 Q0,-5 1,-2"
      stroke="hsl(0 0% 60% / 0.4)"
      strokeWidth="0.5"
      fill="none"
      animate={{ y: [0, -2, 0], opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </g>
);

/* Server rack */
const ServerRack = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-8" y="-24" width="16" height="26" rx="1" fill="hsl(220 15% 15%)" stroke="hsl(220 10% 22%)" strokeWidth="0.5" />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x="-6" y={-22 + i * 5} width="12" height="4" rx="0.5" fill="hsl(220 12% 18%)" />
        <motion.circle
          cx="-3" cy={-20 + i * 5}
          r="0.7"
          fill={i % 2 === 0 ? "hsl(155 60% 50%)" : "hsl(45 80% 55%)"}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.5 + i * 0.3, repeat: Infinity }}
        />
        <motion.circle
          cx="-1" cy={-20 + i * 5}
          r="0.7"
          fill="hsl(155 60% 50%)"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8 + i * 0.2, repeat: Infinity }}
        />
      </g>
    ))}
  </g>
);

const AnimatedOffice = () => {
  const [activeBubble, setActiveBubble] = useState<{ msg: string; fromPos: { x: number; y: number } } | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [agentPositions, setAgentPositions] = useState<Record<string, { x: number; y: number }>>(
    Object.fromEntries(agents.map((a) => [a.id, a.desk]))
  );
  const [talkingAgent, setTalkingAgent] = useState<string | null>(null);

  // Convert % positions to SVG coords
  const toSvg = (pos: { x: number; y: number }) => ({
    x: pos.x * 4, // 0-100 → 0-400
    y: pos.y * 1.8 + 15, // scale y
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const chatMsg = chatMessages[messageIndex % chatMessages.length];
      const fromAgent = agents.find((a) => a.name === chatMsg.from);

      if (fromAgent) {
        const svgPos = toSvg(fromAgent.desk);
        setActiveBubble({ msg: chatMsg.msg, fromPos: svgPos });
        setTalkingAgent(fromAgent.id);

        // Sometimes make an agent walk to another
        if (Math.random() > 0.5) {
          const toAgent = agents.find((a) => a.name === chatMsg.to);
          if (toAgent && fromAgent.id !== "medusa") {
            const meetPoint = {
              x: (fromAgent.desk.x + toAgent.desk.x) / 2 + (Math.random() * 10 - 5),
              y: (fromAgent.desk.y + toAgent.desk.y) / 2 + (Math.random() * 6 - 3),
            };
            setAgentPositions((prev) => ({ ...prev, [fromAgent.id]: meetPoint }));

            // Return to desk after
            setTimeout(() => {
              setAgentPositions((prev) => ({ ...prev, [fromAgent.id]: fromAgent.desk }));
            }, 3000);
          }
        }

        setTimeout(() => setTalkingAgent(null), 2500);
      }

      setMessageIndex((i) => i + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [messageIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-4 md:p-6 overflow-hidden relative"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🏢
          </motion.span>
          <h2 className="font-display text-sm font-semibold text-foreground tracking-wider uppercase">
            La Oficina Mágica
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-glow-emerald"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono text-muted-foreground">EN VIVO</span>
        </div>
      </div>

      {/* SVG Office Scene */}
      <div className="w-full overflow-hidden rounded-lg" style={{ background: "hsl(220 25% 8%)" }}>
        <svg viewBox="0 0 400 200" className="w-full h-auto" style={{ minHeight: "280px" }}>
          {/* Floor */}
          <IsometricFloor />

          {/* Walls / background elements */}
          <rect x="5" y="5" width="390" height="190" rx="4" fill="none" stroke="hsl(155 60% 45% / 0.1)" strokeWidth="0.5" strokeDasharray="4 2" />

          {/* Room label */}
          <text x="200" y="16" textAnchor="middle" fontSize="5" fill="hsl(155 60% 45% / 0.4)" fontFamily="monospace" letterSpacing="3">
            OPENCLAW HQ — SALA DE CONTROL
          </text>

          {/* Furniture */}
          <Desk x={200} y={65} />
          <Desk x={65} y={100} />
          <Desk x={335} y={100} />
          <Desk x={125} y={132} />
          <Desk x={275} y={132} />
          <Desk x={200} y={155} />

          {/* Decorations */}
          <Plant x={30} y={60} variant={0} />
          <Plant x={370} y={60} variant={1} />
          <Plant x={150} y={45} variant={2} />
          <Plant x={250} y={45} variant={3} />
          <Plant x={30} y={140} variant={0} />
          <Plant x={370} y={140} variant={1} />

          <Bookshelf x={95} y={45} />
          <Bookshelf x={305} y={45} />
          <CoffeeMachine x={360} y={170} />
          <ServerRack x={25} y={95} />
          <ServerRack x={375} y={95} />

          {/* Connection lines (data flow) */}
          <motion.line
            x1="200" y1="65" x2="65" y2="100"
            stroke="hsl(155 60% 45% / 0.08)"
            strokeWidth="0.5"
            strokeDasharray="3 3"
            animate={{ strokeOpacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.line
            x1="200" y1="65" x2="335" y2="100"
            stroke="hsl(270 45% 55% / 0.08)"
            strokeWidth="0.5"
            strokeDasharray="3 3"
            animate={{ strokeOpacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <motion.line
            x1="200" y1="65" x2="125" y2="132"
            stroke="hsl(185 70% 50% / 0.08)"
            strokeWidth="0.5"
            strokeDasharray="3 3"
            animate={{ strokeOpacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
          <motion.line
            x1="200" y1="65" x2="275" y2="132"
            stroke="hsl(15 80% 55% / 0.08)"
            strokeWidth="0.5"
            strokeDasharray="3 3"
            animate={{ strokeOpacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
          <motion.line
            x1="200" y1="65" x2="200" y2="155"
            stroke="hsl(45 80% 55% / 0.08)"
            strokeWidth="0.5"
            strokeDasharray="3 3"
            animate={{ strokeOpacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          />

          {/* Data packets flowing along lines */}
          {[
            { x1: 200, y1: 65, x2: 65, y2: 100, color: "hsl(155 60% 45%)" },
            { x1: 200, y1: 65, x2: 335, y2: 100, color: "hsl(270 45% 55%)" },
            { x1: 200, y1: 65, x2: 125, y2: 132, color: "hsl(185 70% 50%)" },
            { x1: 200, y1: 65, x2: 275, y2: 132, color: "hsl(15 80% 55%)" },
            { x1: 200, y1: 65, x2: 200, y2: 155, color: "hsl(45 80% 55%)" },
          ].map((line, i) => (
            <motion.circle
              key={`packet-${i}`}
              r="1.5"
              fill={line.color}
              opacity="0.6"
              animate={{
                cx: [line.x1, line.x2, line.x1],
                cy: [line.y1, line.y2, line.y1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            />
          ))}

          {/* Agents */}
          {agents.map((agent) => {
            const pos = agentPositions[agent.id];
            const svgPos = toSvg(pos);
            return (
              <AgentSprite
                key={agent.id}
                agent={agent}
                position={svgPos}
                isTalking={talkingAgent === agent.id}
              />
            );
          })}

          {/* Chat bubbles */}
          <AnimatePresence>
            {activeBubble && (
              <ChatBubble
                key={messageIndex}
                message={activeBubble.msg}
                fromPos={activeBubble.fromPos}
                onComplete={() => setActiveBubble(null)}
              />
            )}
          </AnimatePresence>

          {/* Medusa crown indicator */}
          <motion.g
            transform="translate(200, 50)"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <text x="0" y="0" textAnchor="middle" fontSize="7">👑</text>
          </motion.g>
        </svg>
      </div>

      {/* Bottom status strip */}
      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
        <span>6 agentes activos · 4 conversaciones en curso</span>
        <span className="hidden md:inline">Última sincronización: hace 2s</span>
      </div>
    </motion.div>
  );
};

export default AnimatedOffice;
