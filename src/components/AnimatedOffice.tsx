import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

/* ── Agent Data ── */
interface AgentTask {
  label: string;
  progress: number;
}

interface AgentCharacter {
  id: string;
  name: string;
  emoji: string;
  color: string;
  hairColor: string;
  accessory: "glasses" | "headphones" | "hat" | "crown" | "horns" | "antenna";
  bodyShape: "round" | "tall" | "small";
  desk: { x: number; y: number };
  task: AgentTask;
}

const agents: AgentCharacter[] = [
  {
    id: "medusa", name: "Medusa", emoji: "🐍",
    color: "hsl(155 60% 45%)", hairColor: "hsl(155 50% 30%)",
    accessory: "crown", bodyShape: "tall",
    desk: { x: 50, y: 32 },
    task: { label: "Coordinando agentes", progress: 88 },
  },
  {
    id: "basilisk", name: "Basilisk", emoji: "🐉",
    color: "hsl(270 45% 55%)", hairColor: "hsl(270 40% 35%)",
    accessory: "glasses", bodyShape: "round",
    desk: { x: 15, y: 52 },
    task: { label: "Scraping datos", progress: 62 },
  },
  {
    id: "ouroboros", name: "Ouroboros", emoji: "🔄",
    color: "hsl(200 60% 50%)", hairColor: "hsl(200 50% 35%)",
    accessory: "headphones", bodyShape: "tall",
    desk: { x: 82, y: 52 },
    task: { label: "Rebuild pipeline", progress: 45 },
  },
  {
    id: "naga", name: "Naga", emoji: "🌊",
    color: "hsl(185 70% 50%)", hairColor: "hsl(185 60% 30%)",
    accessory: "antenna", bodyShape: "small",
    desk: { x: 30, y: 70 },
    task: { label: "Testing endpoints", progress: 73 },
  },
  {
    id: "hydra", name: "Hydra", emoji: "🔥",
    color: "hsl(15 80% 55%)", hairColor: "hsl(15 70% 35%)",
    accessory: "horns", bodyShape: "round",
    desk: { x: 68, y: 70 },
    task: { label: "Scaling workers", progress: 91 },
  },
  {
    id: "quetzal", name: "Quetzalcoatl", emoji: "🌈",
    color: "hsl(45 80% 55%)", hairColor: "hsl(45 60% 35%)",
    accessory: "hat", bodyShape: "small",
    desk: { x: 50, y: 84 },
    task: { label: "Optimizando funnel", progress: 56 },
  },
];

const chatSequence = [
  { from: "medusa", to: "basilisk", msg: "Necesito los datos del scraping 🐍" },
  { from: "basilisk", to: "medusa", msg: "¡Enviando 847 registros! 📊" },
  { from: "naga", to: "hydra", msg: "¿Puedes verificar /api/v2?" },
  { from: "hydra", to: "naga", msg: "¡Todo verde! 4 workers activos 🔥" },
  { from: "ouroboros", to: "medusa", msg: "Pipeline rebuild al 65% ⚙️" },
  { from: "quetzal", to: "medusa", msg: "¡+$340 en conversiones! 💰" },
  { from: "medusa", to: "quetzal", msg: "Excelente, optimiza el funnel B ✨" },
  { from: "basilisk", to: "ouroboros", msg: "Feeds listos para el pipeline" },
];

/* ── SVG Helpers ── */
const toSvg = (pos: { x: number; y: number }) => ({
  x: pos.x * 4,
  y: pos.y * 1.8 + 15,
});

/* ── Accessory Renderers ── */
const AccessoryRenderer = ({ type, color }: { type: AgentCharacter["accessory"]; color: string }) => {
  switch (type) {
    case "crown":
      return (
        <g transform="translate(0, -16)">
          <polygon points="-5,0 -4,-5 -2,-2 0,-6 2,-2 4,-5 5,0" fill="hsl(45 90% 55%)" stroke="hsl(45 80% 40%)" strokeWidth="0.3" />
          <circle cx="0" cy="-5" r="0.8" fill="hsl(0 70% 50%)" />
          <circle cx="-3" cy="-3.5" r="0.5" fill="hsl(200 70% 55%)" />
          <circle cx="3" cy="-3.5" r="0.5" fill="hsl(155 60% 50%)" />
        </g>
      );
    case "glasses":
      return (
        <g transform="translate(0, -9)">
          <circle cx="-2.5" cy="0" r="2" fill="none" stroke="hsl(220 20% 70%)" strokeWidth="0.6" />
          <circle cx="2.5" cy="0" r="2" fill="none" stroke="hsl(220 20% 70%)" strokeWidth="0.6" />
          <line x1="-0.5" y1="0" x2="0.5" y2="0" stroke="hsl(220 20% 70%)" strokeWidth="0.5" />
          <line x1="-4.5" y1="0" x2="-5.5" y2="-0.5" stroke="hsl(220 20% 70%)" strokeWidth="0.4" />
          <line x1="4.5" y1="0" x2="5.5" y2="-0.5" stroke="hsl(220 20% 70%)" strokeWidth="0.4" />
          {/* Lens glint */}
          <motion.circle cx="-1.5" cy="-0.8" r="0.4" fill="hsl(200 80% 80% / 0.5)"
            animate={{ opacity: [0, 0.8, 0] }} transition={{ duration: 3, repeat: Infinity }} />
        </g>
      );
    case "headphones":
      return (
        <g transform="translate(0, -11)">
          <path d="M-6,2 Q-7,-4 -3,-6" fill="none" stroke="hsl(0 0% 30%)" strokeWidth="1.2" />
          <path d="M6,2 Q7,-4 3,-6" fill="none" stroke="hsl(0 0% 30%)" strokeWidth="1.2" />
          <rect x="-7.5" y="0" width="3" height="4" rx="1" fill="hsl(0 0% 25%)" />
          <rect x="4.5" y="0" width="3" height="4" rx="1" fill="hsl(0 0% 25%)" />
          <motion.circle cx="-6" cy="2" r="0.5" fill="hsl(155 60% 50%)"
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </g>
      );
    case "hat":
      return (
        <g transform="translate(0, -14)">
          <ellipse cx="0" cy="2" rx="7" ry="1.5" fill={color} opacity="0.8" />
          <path d="M-4,2 Q-4,-4 0,-5 Q4,-4 4,2" fill={color} opacity="0.9" />
          <rect x="-3" y="-2" width="6" height="1" rx="0.3" fill="hsl(45 80% 55%)" />
        </g>
      );
    case "horns":
      return (
        <g transform="translate(0, -14)">
          <path d="M-4,0 Q-6,-6 -3,-8" fill="none" stroke="hsl(15 60% 40%)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4,0 Q6,-6 3,-8" fill="none" stroke="hsl(15 60% 40%)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="-3" cy="-8" r="0.8" fill="hsl(15 80% 55%)" />
          <circle cx="3" cy="-8" r="0.8" fill="hsl(15 80% 55%)" />
        </g>
      );
    case "antenna":
      return (
        <g transform="translate(0, -15)">
          <line x1="0" y1="0" x2="0" y2="-6" stroke="hsl(185 50% 40%)" strokeWidth="0.6" />
          <motion.circle cx="0" cy="-6" r="1.5" fill="hsl(185 70% 50%)"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity }} />
          <motion.circle cx="0" cy="-6" r="3" fill="none" stroke="hsl(185 70% 50% / 0.3)" strokeWidth="0.3"
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
        </g>
      );
  }
};

/* ── Hair Renderer ── */
const HairRenderer = ({ bodyShape, hairColor }: { bodyShape: string; hairColor: string }) => {
  if (bodyShape === "round") {
    return (
      <g transform="translate(0, -11)">
        <path d="M-5.5,-2 Q-6,-5 -3,-6 Q0,-7 3,-6 Q6,-5 5.5,-2" fill={hairColor} />
        <path d="M-4,-5 Q-2,-7 0,-6.5" fill={hairColor} opacity="0.7" />
      </g>
    );
  }
  if (bodyShape === "small") {
    return (
      <g transform="translate(0, -11)">
        <path d="M-4.5,-1 Q-5,-5 0,-6 Q5,-5 4.5,-1" fill={hairColor} />
        <circle cx="-3" cy="-5" r="1.2" fill={hairColor} opacity="0.8" />
        <circle cx="3" cy="-5" r="1" fill={hairColor} opacity="0.8" />
      </g>
    );
  }
  // tall
  return (
    <g transform="translate(0, -11)">
      <path d="M-5.5,-1.5 Q-6,-6 -2,-7 Q1,-8 4,-7 Q7,-5 5.5,-1.5" fill={hairColor} />
      {/* Snake-like hair strands for Medusa */}
      <motion.path d="M-4,-6 Q-6,-8 -5,-10" fill="none" stroke={hairColor} strokeWidth="0.8" strokeLinecap="round"
        animate={{ d: ["M-4,-6 Q-6,-8 -5,-10", "M-4,-6 Q-7,-9 -4,-11", "M-4,-6 Q-6,-8 -5,-10"] }}
        transition={{ duration: 2, repeat: Infinity }} />
      <motion.path d="M0,-7 Q0,-10 1,-11" fill="none" stroke={hairColor} strokeWidth="0.7" strokeLinecap="round"
        animate={{ d: ["M0,-7 Q0,-10 1,-11", "M0,-7 Q1,-10 -1,-12", "M0,-7 Q0,-10 1,-11"] }}
        transition={{ duration: 2.5, repeat: Infinity }} />
      <motion.path d="M4,-6 Q6,-8 5,-10" fill="none" stroke={hairColor} strokeWidth="0.8" strokeLinecap="round"
        animate={{ d: ["M4,-6 Q6,-8 5,-10", "M4,-6 Q7,-9 4,-11", "M4,-6 Q6,-8 5,-10"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
    </g>
  );
};

/* ── Agent Sprite ── */
const AgentSprite = ({
  agent,
  position,
  isTalking,
  isTyping,
}: {
  agent: AgentCharacter;
  position: { x: number; y: number };
  isTalking: boolean;
  isTyping: boolean;
}) => {
  const headRadius = agent.bodyShape === "round" ? 6 : agent.bodyShape === "small" ? 5 : 5.5;

  return (
    <motion.g
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 25, damping: 12, mass: 1.2 }}
    >
      {/* Shadow */}
      <motion.ellipse cx="0" cy="6" rx="8" ry="2.5" fill="hsl(0 0% 0% / 0.15)"
        animate={isTalking ? { rx: [8, 9, 8] } : {}}
        transition={{ duration: 0.8, repeat: Infinity }} />

      <motion.g
        animate={{ y: isTyping ? [0, -1, 0, -1.5, 0] : [0, -1.5, 0] }}
        transition={{ duration: isTyping ? 0.6 : 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Body */}
        {agent.bodyShape === "round" && (
          <ellipse cx="0" cy="0" rx="7" ry="6" fill={agent.color} opacity="0.9" />
        )}
        {agent.bodyShape === "tall" && (
          <path d="M-5,5 Q-6,-2 -4,-4 Q0,-6 4,-4 Q6,-2 5,5 Z" fill={agent.color} opacity="0.9" />
        )}
        {agent.bodyShape === "small" && (
          <ellipse cx="0" cy="1" rx="6" ry="5" fill={agent.color} opacity="0.9" />
        )}

        {/* Arms */}
        <motion.g animate={isTyping ? { rotate: [0, -8, 0, 8, 0] } : isTalking ? { rotate: [0, -5, 5, 0] } : {}}
          transition={{ duration: isTyping ? 0.3 : 0.8, repeat: Infinity }}>
          {/* Left arm */}
          <path d={`M-${agent.bodyShape === "round" ? 6 : 5},0 Q-${agent.bodyShape === "round" ? 9 : 8},3 -${agent.bodyShape === "round" ? 8 : 7},5`}
            fill="none" stroke={agent.color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          {/* Left hand */}
          <circle cx={agent.bodyShape === "round" ? -8 : -7} cy="5" r="1.2" fill={agent.color} opacity="0.85" />
        </motion.g>
        <motion.g animate={isTyping ? { rotate: [0, 5, 0, -5, 0] } : {}}
          transition={{ duration: 0.35, repeat: Infinity }}>
          {/* Right arm */}
          <path d={`M${agent.bodyShape === "round" ? 6 : 5},0 Q${agent.bodyShape === "round" ? 9 : 8},3 ${agent.bodyShape === "round" ? 8 : 7},5`}
            fill="none" stroke={agent.color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <circle cx={agent.bodyShape === "round" ? 8 : 7} cy="5" r="1.2" fill={agent.color} opacity="0.85" />
        </motion.g>

        {/* Head */}
        <circle cx="0" cy="-8" r={headRadius} fill={agent.color} />
        {/* Cheeks / blush */}
        <circle cx="-3.5" cy="-6" r="1.5" fill="hsl(350 60% 70% / 0.3)" />
        <circle cx="3.5" cy="-6" r="1.5" fill="hsl(350 60% 70% / 0.3)" />

        {/* Hair */}
        <HairRenderer bodyShape={agent.bodyShape} hairColor={agent.hairColor} />

        {/* Eyes */}
        <motion.g
          animate={isTalking ? { scaleY: [1, 0.1, 1] } : {}}
          transition={{ duration: 0.3, repeat: isTalking ? Infinity : 0, repeatDelay: 2 }}
        >
          {/* Eye whites */}
          <ellipse cx="-2.2" cy="-9" rx="1.6" ry="1.8" fill="hsl(0 0% 95%)" />
          <ellipse cx="2.2" cy="-9" rx="1.6" ry="1.8" fill="hsl(0 0% 95%)" />
          {/* Pupils - look toward conversation partner when talking */}
          <motion.circle cx="-2.2" cy="-9" r="0.8" fill="hsl(0 0% 10%)"
            animate={isTalking ? { cx: [-2.5, -1.8, -2.2] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.circle cx="2.2" cy="-9" r="0.8" fill="hsl(0 0% 10%)"
            animate={isTalking ? { cx: [1.8, 2.5, 2.2] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }} />
          {/* Eye shine */}
          <circle cx="-2.8" cy="-9.5" r="0.4" fill="hsl(0 0% 100% / 0.8)" />
          <circle cx="1.6" cy="-9.5" r="0.4" fill="hsl(0 0% 100% / 0.8)" />
        </motion.g>

        {/* Mouth */}
        {isTalking ? (
          <motion.ellipse cx="0" cy="-6" rx="1.5" ry="1"
            fill="hsl(0 0% 10%)"
            animate={{ ry: [0.4, 1.3, 0.4], rx: [1.2, 1.8, 1.2] }}
            transition={{ duration: 0.5, repeat: Infinity }} />
        ) : (
          <path d="M-1.8,-6.2 Q0,-4.8 1.8,-6.2" stroke="hsl(0 0% 10%)" strokeWidth="0.5" fill="none" />
        )}

        {/* Accessory */}
        <AccessoryRenderer type={agent.accessory} color={agent.color} />
      </motion.g>

      {/* Task label + progress bar */}
      <g transform="translate(0, 12)">
        <rect x="-22" y="-4" width="44" height="14" rx="4" fill="hsl(220 20% 10% / 0.9)" stroke={agent.color} strokeWidth="0.4" />
        <text x="0" y="1" textAnchor="middle" fontSize="3.3" fill="hsl(0 0% 90%)" fontFamily="monospace" fontWeight="bold">
          {agent.name}
        </text>
        {/* Task */}
        <text x="0" y="5.5" textAnchor="middle" fontSize="2.4" fill="hsl(0 0% 60%)" fontFamily="monospace">
          {agent.task.label}
        </text>
        {/* Progress bar */}
        <rect x="-16" y="7" width="32" height="2" rx="1" fill="hsl(220 15% 20%)" />
        <motion.rect x="-16" y="7" height="2" rx="1" fill={agent.color}
          animate={{ width: [0, agent.task.progress * 0.32] }}
          transition={{ duration: 1.5, ease: "easeOut" }} />
      </g>

      {/* Typing indicator when working */}
      {isTyping && !isTalking && (
        <g transform="translate(8, -18)">
          <rect x="-5" y="-3" width="10" height="6" rx="2.5" fill="hsl(220 20% 15% / 0.9)" stroke={agent.color} strokeWidth="0.3" />
          <motion.circle cx="-2" cy="0" r="0.8" fill="hsl(0 0% 60%)"
            animate={{ y: [0, -1, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} />
          <motion.circle cx="0.5" cy="0" r="0.8" fill="hsl(0 0% 60%)"
            animate={{ y: [0, -1, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }} />
          <motion.circle cx="3" cy="0" r="0.8" fill="hsl(0 0% 60%)"
            animate={{ y: [0, -1, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }} />
        </g>
      )}
    </motion.g>
  );
};

/* ── Chat Bubble ── */
const ChatBubble = ({
  message,
  fromPos,
  toPos,
  color,
  onComplete,
}: {
  message: string;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
  color: string;
  onComplete: () => void;
}) => {
  const midX = (fromPos.x + toPos.x) / 2;
  const midY = Math.min(fromPos.y, toPos.y) - 30;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        x: [fromPos.x, midX, midX, toPos.x],
        y: [fromPos.y - 22, midY, midY, toPos.y - 22],
      }}
      transition={{ duration: 4, ease: "easeInOut", times: [0, 0.2, 0.7, 1] }}
      onAnimationComplete={onComplete}
    >
      <rect x="-38" y="-10" width="76" height="14" rx="5" fill="hsl(220 20% 12% / 0.95)" stroke={`${color.replace(")", " / 0.5)")}`} strokeWidth="0.6" />
      <path d="M-3,4 L0,7 L3,4" fill="hsl(220 20% 12% / 0.95)" />
      <text x="0" y="1" textAnchor="middle" fontSize="3" fill="hsl(0 0% 88%)" fontFamily="monospace">
        {message.length > 32 ? message.slice(0, 32) + "…" : message}
      </text>
    </motion.g>
  );
};

/* ── Connection Line with data flow ── */
const DataLine = ({ x1, y1, x2, y2, color, delay }: { x1: number; y1: number; x2: number; y2: number; color: string; delay: number }) => (
  <g>
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={`${color.replace(")", " / 0.1)")}`}
      strokeWidth="0.5"
      strokeDasharray="3 3"
      animate={{ strokeOpacity: [0.05, 0.2, 0.05] }}
      transition={{ duration: 3, repeat: Infinity, delay }}
    />
    <motion.circle r="1.5" fill={color} opacity="0.6"
      animate={{ cx: [x1, x2, x1], cy: [y1, y2, y1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }} />
  </g>
);

/* ── Isometric Floor ── */
const IsometricFloor = () => {
  const tiles: JSX.Element[] = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 10; c++) {
      const x = (c - r) * 18 + 200;
      const y = (c + r) * 9 + 20;
      tiles.push(
        <path key={`${r}-${c}`}
          d={`M${x},${y} L${x + 18},${y - 9} L${x + 36},${y} L${x + 18},${y + 9} Z`}
          fill={(r + c) % 2 === 0 ? "hsl(220 20% 12%)" : "hsl(220 18% 14%)"}
          stroke="hsl(220 15% 18% / 0.5)" strokeWidth="0.3" />
      );
    }
  }
  return <g>{tiles}</g>;
};

/* ── Desk ── */
const Desk = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d="M-22,0 L0,-11 L22,0 L0,11 Z" fill="hsl(25 40% 35%)" stroke="hsl(25 30% 25%)" strokeWidth="0.5" />
    <path d="M-22,0 L-22,6 L0,17 L0,11 Z" fill="hsl(25 35% 28%)" />
    <path d="M22,0 L22,6 L0,17 L0,11 Z" fill="hsl(25 30% 22%)" />
    <rect x="-6" y="-18" width="12" height="9" rx="1" fill="hsl(220 40% 15%)" stroke="hsl(220 20% 25%)" strokeWidth="0.5" />
    <rect x="-5" y="-17" width="10" height="7" rx="0.5" fill="hsl(155 60% 45% / 0.3)" />
    <rect x="-1" y="-9" width="2" height="3" fill="hsl(220 10% 30%)" />
    <motion.rect x="-4" y="-16" width="3" height="1" rx="0.3" fill="hsl(155 60% 60%)"
      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: Math.random() * 2 }} />
  </g>
);

/* ── Decorations ── */
const Plant = ({ x, y, variant = 0 }: { x: number; y: number; variant?: number }) => (
  <motion.g transform={`translate(${x}, ${y})`}
    animate={{ y: [0, -1, 0] }} transition={{ duration: 3 + variant, repeat: Infinity, ease: "easeInOut" }}>
    <path d="M-4,0 L-3,-6 L3,-6 L4,0 Z" fill="hsl(15 60% 40%)" />
    <ellipse cx="0" cy="-6" rx="3.5" ry="1.2" fill="hsl(15 50% 35%)" />
    {variant % 2 === 0 ? (
      <>
        <ellipse cx="-2" cy="-10" rx="2" ry="3" fill="hsl(140 50% 40%)" transform="rotate(-15,-2,-10)" />
        <ellipse cx="2" cy="-11" rx="2" ry="3.5" fill="hsl(150 55% 35%)" transform="rotate(10,2,-11)" />
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

const ServerRack = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-8" y="-24" width="16" height="26" rx="1" fill="hsl(220 15% 15%)" stroke="hsl(220 10% 22%)" strokeWidth="0.5" />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x="-6" y={-22 + i * 5} width="12" height="4" rx="0.5" fill="hsl(220 12% 18%)" />
        <motion.circle cx="-3" cy={-20 + i * 5} r="0.7"
          fill={i % 2 === 0 ? "hsl(155 60% 50%)" : "hsl(45 80% 55%)"}
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.5 + i * 0.3, repeat: Infinity }} />
      </g>
    ))}
  </g>
);

const CoffeeMachine = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-5" y="-12" width="10" height="14" rx="1.5" fill="hsl(0 0% 25%)" stroke="hsl(0 0% 20%)" strokeWidth="0.5" />
    <rect x="-3" y="-10" width="6" height="4" rx="0.5" fill="hsl(0 0% 15%)" />
    <motion.circle cx="0" cy="-8" r="1" fill="hsl(155 60% 45%)" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
    <rect x="-2" y="-1" width="4" height="3" rx="0.5" fill="hsl(0 0% 90%)" />
    <motion.path d="M-1,-2 Q0,-5 1,-2" stroke="hsl(0 0% 60% / 0.4)" strokeWidth="0.5" fill="none"
      animate={{ y: [0, -2, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
  </g>
);

/* ── Main Component ── */
const AnimatedOffice = () => {
  const [activeBubble, setActiveBubble] = useState<{
    msg: string;
    fromPos: { x: number; y: number };
    toPos: { x: number; y: number };
    color: string;
  } | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [agentPositions, setAgentPositions] = useState<Record<string, { x: number; y: number }>>(
    Object.fromEntries(agents.map((a) => [a.id, a.desk]))
  );
  const [talkingAgents, setTalkingAgents] = useState<Set<string>>(new Set());
  const [typingAgents, setTypingAgents] = useState<Set<string>>(new Set(["medusa", "basilisk", "ouroboros"]));

  // Cycle typing agents randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingAgents(prev => {
        const next = new Set(prev);
        agents.forEach(a => {
          if (Math.random() > 0.6) next.add(a.id);
          else if (Math.random() > 0.5) next.delete(a.id);
        });
        if (next.size < 2) next.add("medusa");
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerChat = useCallback(() => {
    const chat = chatSequence[messageIndex % chatSequence.length];
    const fromAgent = agents.find((a) => a.id === chat.from);
    const toAgent = agents.find((a) => a.id === chat.to);

    if (fromAgent && toAgent) {
      const fromSvg = toSvg(fromAgent.desk);
      const toSvg_ = toSvg(toAgent.desk);

      setActiveBubble({ msg: chat.msg, fromPos: fromSvg, toPos: toSvg_, color: fromAgent.color });
      setTalkingAgents(new Set([fromAgent.id, toAgent.id]));
      setTypingAgents(prev => { const n = new Set(prev); n.delete(fromAgent.id); return n; });

      // Walk toward each other
      if (Math.random() > 0.4 && fromAgent.id !== "medusa") {
        const meetPoint = {
          x: (fromAgent.desk.x + toAgent.desk.x) / 2 + (Math.random() * 8 - 4),
          y: (fromAgent.desk.y + toAgent.desk.y) / 2 + (Math.random() * 4 - 2),
        };
        setAgentPositions((prev) => ({ ...prev, [fromAgent.id]: meetPoint }));
        setTimeout(() => {
          setAgentPositions((prev) => ({ ...prev, [fromAgent.id]: fromAgent.desk }));
        }, 3500);
      }

      setTimeout(() => setTalkingAgents(new Set()), 3000);
    }

    setMessageIndex((i) => i + 1);
  }, [messageIndex]);

  useEffect(() => {
    const interval = setInterval(triggerChat, 4500);
    return () => clearInterval(interval);
  }, [triggerChat]);

  const deskPositions = agents.map(a => toSvg(a.desk));
  const medusaPos = deskPositions[0];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      className="glass-card p-4 md:p-6 overflow-hidden relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.span className="text-lg" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            🏢
          </motion.span>
          <h2 className="font-display text-sm font-semibold text-foreground tracking-wider uppercase">
            La Oficina Mágica
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <motion.div className="w-2 h-2 rounded-full bg-glow-emerald"
            animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <span className="text-[10px] font-mono text-muted-foreground">EN VIVO</span>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-lg" style={{ background: "hsl(220 25% 8%)" }}>
        <svg viewBox="0 0 400 210" className="w-full h-auto" style={{ minHeight: "300px" }}>
          <IsometricFloor />
          <rect x="5" y="5" width="390" height="200" rx="4" fill="none" stroke="hsl(155 60% 45% / 0.1)" strokeWidth="0.5" strokeDasharray="4 2" />
          <text x="200" y="16" textAnchor="middle" fontSize="5" fill="hsl(155 60% 45% / 0.4)" fontFamily="monospace" letterSpacing="3">
            OPENCLAW HQ — SALA DE CONTROL
          </text>

          {/* Desks */}
          {agents.map((a) => { const p = toSvg(a.desk); return <Desk key={`desk-${a.id}`} x={p.x} y={p.y} />; })}

          {/* Decorations */}
          <Plant x={30} y={60} variant={0} />
          <Plant x={370} y={60} variant={1} />
          <Plant x={150} y={45} variant={2} />
          <Plant x={250} y={45} variant={3} />
          <ServerRack x={25} y={95} />
          <ServerRack x={375} y={95} />
          <CoffeeMachine x={360} y={170} />

          {/* Data lines from Medusa to all agents */}
          {agents.slice(1).map((a, i) => {
            const p = toSvg(a.desk);
            return <DataLine key={`line-${a.id}`} x1={medusaPos.x} y1={medusaPos.y} x2={p.x} y2={p.y} color={a.color} delay={i * 0.8} />;
          })}

          {/* Agents */}
          {agents.map((agent) => {
            const pos = agentPositions[agent.id];
            const svgPos = toSvg(pos);
            return (
              <AgentSprite
                key={agent.id}
                agent={agent}
                position={svgPos}
                isTalking={talkingAgents.has(agent.id)}
                isTyping={typingAgents.has(agent.id)}
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
                toPos={activeBubble.toPos}
                color={activeBubble.color}
                onComplete={() => setActiveBubble(null)}
              />
            )}
          </AnimatePresence>
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
        <span>6 agentes activos · {typingAgents.size} escribiendo · {talkingAgents.size > 0 ? "1 conversación" : "idle"}</span>
        <span className="hidden md:inline">Última sincronización: hace 2s</span>
      </div>
    </motion.div>
  );
};

export default AnimatedOffice;
