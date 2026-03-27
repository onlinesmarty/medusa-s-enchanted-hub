import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { AGENTS, Agent } from "@/types/tasks";

/* ── Chat Sequences ── */
const chatSequence = [
  { from: "medusa", to: "content-creator", msg: "¿Cómo va el contenido Q2? 🐍" },
  { from: "content-creator", to: "medusa", msg: "¡Casi listo! Falta la landing ✨" },
  { from: "dev-guardian", to: "medusa", msg: "API v3 al 65%, sin bugs 🛡️" },
  { from: "pm-estrategico", to: "dev-guardian", msg: "¿Llegas al deadline del viernes?" },
  { from: "search-master", to: "content-creator", msg: "Te envío el research 🔍" },
  { from: "siren", to: "medusa", msg: "Alertas Slack configuradas 🧜‍♀️" },
  { from: "medusa", to: "siren", msg: "Perfecto, activa monitoreo 24/7 ✨" },
  { from: "pm-estrategico", to: "medusa", msg: "Sprint review en 30 min 📋" },
];

const agentDesks: Record<string, { x: number; y: number }> = {
  "medusa": { x: 50, y: 30 },
  "content-creator": { x: 18, y: 50 },
  "dev-guardian": { x: 82, y: 50 },
  "pm-estrategico": { x: 18, y: 72 },
  "search-master": { x: 82, y: 72 },
  "siren": { x: 50, y: 82 },
};

const toSvg = (pos: { x: number; y: number }) => ({
  x: pos.x * 4,
  y: pos.y * 1.8 + 15,
});

/* ── Kawaii Girl Sprite ── */
const KawaiiGirl = ({
  agent,
  position,
  isTalking,
  isTyping,
}: {
  agent: Agent;
  position: { x: number; y: number };
  isTalking: boolean;
  isTyping: boolean;
}) => {
  const isMedusa = agent.id === "medusa";

  return (
    <motion.g
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 25, damping: 12 }}
    >
      {/* Shadow */}
      <ellipse cx="0" cy="14" rx="10" ry="3" fill="hsl(0 0% 0% / 0.15)" />

      <motion.g
        animate={{ y: isTyping ? [0, -1.5, 0, -2, 0] : [0, -2, 0] }}
        transition={{ duration: isTyping ? 0.5 : 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* ── Body / Dress ── */}
        <path
          d="M-8,12 Q-9,4 -6,0 Q0,-3 6,0 Q9,4 8,12 Z"
          fill={agent.outfitColor}
          stroke={agent.color}
          strokeWidth="0.4"
        />
        {/* Dress detail - collar */}
        <path d="M-3,-0.5 Q0,2 3,-0.5" fill="none" stroke={agent.color} strokeWidth="0.5" opacity="0.6" />
        {/* Skirt ruffles */}
        <path d="M-8,12 Q-6,10 -4,12 Q-2,10 0,12 Q2,10 4,12 Q6,10 8,12"
          fill="none" stroke={agent.color} strokeWidth="0.4" opacity="0.5" />

        {/* ── Arms ── */}
        <motion.g
          animate={isTyping ? { rotate: [0, -10, 0, 10, 0] } : isTalking ? { rotate: [0, -5, 5, 0] } : {}}
          transition={{ duration: isTyping ? 0.3 : 0.8, repeat: Infinity }}
        >
          <path d="M-6,2 Q-10,5 -9,8" fill="none" stroke={agent.skinTone} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="-9" cy="8" r="1.5" fill={agent.skinTone} />
        </motion.g>
        <motion.g
          animate={isTyping ? { rotate: [0, 8, 0, -8, 0] } : {}}
          transition={{ duration: 0.35, repeat: Infinity }}
        >
          <path d="M6,2 Q10,5 9,8" fill="none" stroke={agent.skinTone} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="9" cy="8" r="1.5" fill={agent.skinTone} />
        </motion.g>

        {/* ── Head ── */}
        <circle cx="0" cy="-8" r="7" fill={agent.skinTone} />

        {/* ── Hair ── */}
        {isMedusa ? (
          <g>
            {/* Base hair */}
            <path d="M-7.5,-5 Q-8,-12 -3,-14 Q0,-15 3,-14 Q8,-12 7.5,-5" fill={agent.hairColor} />
            {/* Bangs */}
            <path d="M-5,-8 Q-3,-13 0,-12 Q3,-13 5,-8" fill={agent.hairColor} />
            {/* Snake strands - many, animated */}
            {[
              { d1: "M-6,-12 Q-10,-16 -8,-20", d2: "M-6,-12 Q-11,-17 -7,-21", headX: -8, headY: -20 },
              { d1: "M-3,-14 Q-5,-19 -3,-22", d2: "M-3,-14 Q-6,-20 -2,-23", headX: -3, headY: -22 },
              { d1: "M0,-14.5 Q0,-20 2,-23", d2: "M0,-14.5 Q1,-21 -1,-24", headX: 2, headY: -23 },
              { d1: "M3,-14 Q5,-19 3,-22", d2: "M3,-14 Q6,-20 2,-23", headX: 3, headY: -22 },
              { d1: "M6,-12 Q10,-16 8,-20", d2: "M6,-12 Q11,-17 7,-21", headX: 8, headY: -20 },
              { d1: "M-7,-9 Q-12,-12 -11,-17", d2: "M-7,-9 Q-13,-13 -10,-18", headX: -11, headY: -17 },
              { d1: "M7,-9 Q12,-12 11,-17", d2: "M7,-9 Q13,-13 10,-18", headX: 11, headY: -17 },
            ].map((snake, i) => (
              <g key={i}>
                <motion.path
                  d={snake.d1}
                  fill="none"
                  stroke={agent.hairColor}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  animate={{ d: [snake.d1, snake.d2, snake.d1] }}
                  transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Snake head */}
                <motion.g
                  animate={{
                    x: [0, (i % 2 === 0 ? 1 : -1) * 1.5, 0],
                    y: [0, -1, 0],
                  }}
                  transition={{ duration: 1.5 + i * 0.3, repeat: Infinity }}
                >
                  <circle cx={snake.headX} cy={snake.headY} r="1.8" fill="hsl(155 55% 40%)" />
                  {/* Snake eyes */}
                  <circle cx={snake.headX - 0.6} cy={snake.headY - 0.4} r="0.4" fill="hsl(45 90% 55%)" />
                  <circle cx={snake.headX + 0.6} cy={snake.headY - 0.4} r="0.4" fill="hsl(45 90% 55%)" />
                  {/* Forked tongue */}
                  <motion.path
                    d={`M${snake.headX},${snake.headY + 1} L${snake.headX},${snake.headY + 2.5} M${snake.headX},${snake.headY + 2.5} L${snake.headX - 0.5},${snake.headY + 3} M${snake.headX},${snake.headY + 2.5} L${snake.headX + 0.5},${snake.headY + 3}`}
                    fill="none"
                    stroke="hsl(0 70% 55%)"
                    strokeWidth="0.3"
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  />
                </motion.g>
              </g>
            ))}
          </g>
        ) : agent.id === "content-creator" ? (
          <g>
            <path d="M-7.5,-5 Q-8,-13 0,-14.5 Q8,-13 7.5,-5" fill={agent.hairColor} />
            {/* Twin tails */}
            <path d="M-6,-10 Q-10,-8 -9,-2" fill="none" stroke={agent.hairColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M6,-10 Q10,-8 9,-2" fill="none" stroke={agent.hairColor} strokeWidth="3" strokeLinecap="round" />
            {/* Hair bows */}
            <g transform="translate(-7, -9)">
              <path d="M-2,-1 Q0,-3 2,-1 Q0,1 -2,-1" fill="hsl(330 70% 65%)" />
              <circle cx="0" cy="-1" r="0.6" fill="hsl(330 60% 50%)" />
            </g>
            <g transform="translate(7, -9)">
              <path d="M-2,-1 Q0,-3 2,-1 Q0,1 -2,-1" fill="hsl(330 70% 65%)" />
              <circle cx="0" cy="-1" r="0.6" fill="hsl(330 60% 50%)" />
            </g>
            {/* Bangs */}
            <path d="M-4,-8 Q-2,-13 0,-12 Q2,-13 4,-8" fill={agent.hairColor} />
            {/* Sparkle clips */}
            <motion.text x="-5" y="-12" fontSize="3" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>⭐</motion.text>
          </g>
        ) : agent.id === "dev-guardian" ? (
          <g>
            {/* Short bob cut */}
            <path d="M-7.5,-4 Q-8,-13 0,-15 Q8,-13 7.5,-4" fill={agent.hairColor} />
            <path d="M-7.5,-4 L-8,0" fill="none" stroke={agent.hairColor} strokeWidth="2" />
            <path d="M7.5,-4 L8,0" fill="none" stroke={agent.hairColor} strokeWidth="2" />
            {/* Side bangs */}
            <path d="M-6,-7 Q-3,-14 1,-12" fill={agent.hairColor} opacity="0.9" />
            {/* Glasses */}
            <g>
              <circle cx="-2.5" cy="-8.5" r="2.3" fill="none" stroke="hsl(200 30% 70%)" strokeWidth="0.6" />
              <circle cx="2.5" cy="-8.5" r="2.3" fill="none" stroke="hsl(200 30% 70%)" strokeWidth="0.6" />
              <line x1="-0.2" y1="-8.5" x2="0.2" y2="-8.5" stroke="hsl(200 30% 70%)" strokeWidth="0.5" />
              <motion.circle cx="-1.5" cy="-9.3" r="0.5" fill="hsl(200 80% 85% / 0.4)"
                animate={{ opacity: [0, 0.7, 0] }} transition={{ duration: 3, repeat: Infinity }} />
            </g>
          </g>
        ) : agent.id === "pm-estrategico" ? (
          <g>
            {/* Bun hairstyle */}
            <path d="M-7,-5 Q-7.5,-12 0,-14 Q7.5,-12 7,-5" fill={agent.hairColor} />
            <circle cx="0" cy="-16" r="3.5" fill={agent.hairColor} />
            {/* Chopstick in bun */}
            <line x1="-2" y1="-18" x2="3" y2="-14" stroke="hsl(45 70% 60%)" strokeWidth="0.6" />
            {/* Bangs */}
            <path d="M-5,-8 Q0,-13 5,-8" fill={agent.hairColor} opacity="0.8" />
            {/* Small earrings */}
            <circle cx="-7" cy="-5" r="0.8" fill="hsl(45 80% 55%)" />
            <circle cx="7" cy="-5" r="0.8" fill="hsl(45 80% 55%)" />
          </g>
        ) : agent.id === "search-master" ? (
          <g>
            {/* Long wavy hair */}
            <path d="M-7.5,-4 Q-8.5,-13 0,-15 Q8.5,-13 7.5,-4" fill={agent.hairColor} />
            <path d="M-7.5,-4 Q-9,2 -7,8" fill="none" stroke={agent.hairColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M7.5,-4 Q9,2 7,8" fill="none" stroke={agent.hairColor} strokeWidth="3" strokeLinecap="round" />
            {/* Wizard hat tip */}
            <g transform="translate(0, -14)">
              <path d="M-5,0 Q0,-10 5,0" fill={agent.color} opacity="0.8" />
              <circle cx="0" cy="-8" r="1.2" fill="hsl(45 80% 55%)" />
              <motion.circle cx="0" cy="-8" r="2" fill="none" stroke="hsl(45 80% 55% / 0.3)" strokeWidth="0.3"
                animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </g>
          </g>
        ) : (
          <g>
            {/* Siren - flowing aqua hair */}
            <path d="M-7.5,-4 Q-8.5,-13 0,-15 Q8.5,-13 7.5,-4" fill={agent.hairColor} />
            {/* Long flowing strands */}
            <motion.path d="M-7,-3 Q-10,4 -8,12" fill="none" stroke={agent.hairColor} strokeWidth="2.5" strokeLinecap="round"
              animate={{ d: ["M-7,-3 Q-10,4 -8,12", "M-7,-3 Q-11,5 -9,13", "M-7,-3 Q-10,4 -8,12"] }}
              transition={{ duration: 3, repeat: Infinity }} />
            <motion.path d="M7,-3 Q10,4 8,12" fill="none" stroke={agent.hairColor} strokeWidth="2.5" strokeLinecap="round"
              animate={{ d: ["M7,-3 Q10,4 8,12", "M7,-3 Q11,5 9,13", "M7,-3 Q10,4 8,12"] }}
              transition={{ duration: 3.5, repeat: Infinity }} />
            {/* Shell hair clip */}
            <g transform="translate(-6, -10)">
              <path d="M-1.5,0 Q0,-2 1.5,0 Q0,0.5 -1.5,0" fill="hsl(185 60% 65%)" />
            </g>
            {/* Seashell earring */}
            <motion.text x="7.5" y="-3" fontSize="2.5" animate={{ rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🐚</motion.text>
          </g>
        )}

        {/* ── Face ── */}
        {/* Big kawaii eyes */}
        <motion.g
          animate={isTalking ? { scaleY: [1, 0.1, 1] } : {}}
          transition={{ duration: 0.3, repeat: isTalking ? Infinity : 0, repeatDelay: 2.5 }}
        >
          {/* Eye shape */}
          <ellipse cx="-2.5" cy="-8.5" rx="2" ry="2.2" fill="hsl(0 0% 98%)" />
          <ellipse cx="2.5" cy="-8.5" rx="2" ry="2.2" fill="hsl(0 0% 98%)" />
          {/* Iris */}
          <circle cx="-2.5" cy="-8.3" r="1.4" fill={agent.color} />
          <circle cx="2.5" cy="-8.3" r="1.4" fill={agent.color} />
          {/* Pupil */}
          <motion.circle cx="-2.5" cy="-8.3" r="0.7" fill="hsl(0 0% 5%)"
            animate={isTalking ? { cx: [-2.8, -2.2, -2.5] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.circle cx="2.5" cy="-8.3" r="0.7" fill="hsl(0 0% 5%)"
            animate={isTalking ? { cx: [2.2, 2.8, 2.5] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
          {/* Eye sparkle - big */}
          <circle cx="-3.1" cy="-9" r="0.5" fill="hsl(0 0% 100%)" />
          <circle cx="1.9" cy="-9" r="0.5" fill="hsl(0 0% 100%)" />
          {/* Eye sparkle - small */}
          <circle cx="-2" cy="-7.8" r="0.25" fill="hsl(0 0% 100%)" />
          <circle cx="3" cy="-7.8" r="0.25" fill="hsl(0 0% 100%)" />
          {/* Upper eyelashes */}
          <path d="M-4.3,-9.5 Q-3.5,-10.5 -2.5,-10.5 Q-1.5,-10.5 -0.7,-9.5"
            fill="none" stroke="hsl(0 0% 15%)" strokeWidth="0.5" strokeLinecap="round" />
          <path d="M0.7,-9.5 Q1.5,-10.5 2.5,-10.5 Q3.5,-10.5 4.3,-9.5"
            fill="none" stroke="hsl(0 0% 15%)" strokeWidth="0.5" strokeLinecap="round" />
        </motion.g>

        {/* Blush */}
        <circle cx="-4" cy="-6.5" r="1.5" fill="hsl(350 70% 75% / 0.35)" />
        <circle cx="4" cy="-6.5" r="1.5" fill="hsl(350 70% 75% / 0.35)" />

        {/* Mouth */}
        {isTalking ? (
          <motion.ellipse cx="0" cy="-5.5" rx="1.2" ry="0.8"
            fill="hsl(350 50% 45%)"
            animate={{ ry: [0.3, 1, 0.3], rx: [1, 1.5, 1] }}
            transition={{ duration: 0.4, repeat: Infinity }} />
        ) : (
          <path d="M-1.2,-5.8 Q0,-4.5 1.2,-5.8" stroke="hsl(350 50% 45%)" strokeWidth="0.5" fill="none" />
        )}

        {/* Tiny nose */}
        <circle cx="0" cy="-7" r="0.3" fill={`${agent.skinTone.replace(")", " / 0.5)")}`} />
      </motion.g>

      {/* ── Name Tag ── */}
      <g transform="translate(0, 18)">
        <rect x="-22" y="-3" width="44" height="10" rx="4"
          fill="hsl(220 20% 10% / 0.9)" stroke={agent.color} strokeWidth="0.4" />
        <text x="0" y="2" textAnchor="middle" fontSize="3.2" fill="hsl(0 0% 92%)" fontFamily="monospace" fontWeight="bold">
          {agent.emoji} {agent.name}
        </text>
        <text x="0" y="5.5" textAnchor="middle" fontSize="2" fill="hsl(0 0% 55%)" fontFamily="monospace">
          {agent.role}
        </text>
      </g>

      {/* Typing dots */}
      {isTyping && !isTalking && (
        <g transform="translate(10, -20)">
          <rect x="-5" y="-3" width="10" height="6" rx="3" fill="hsl(220 20% 15% / 0.9)" stroke={agent.color} strokeWidth="0.3" />
          {[0, 1, 2].map(i => (
            <motion.circle key={i} cx={-2 + i * 2.5} cy="0" r="0.8" fill="hsl(0 0% 60%)"
              animate={{ y: [0, -1.2, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
          ))}
        </g>
      )}
    </motion.g>
  );
};

/* ── Chat Bubble ── */
const ChatBubble = ({
  message, fromPos, toPos, color, onComplete,
}: {
  message: string; fromPos: { x: number; y: number }; toPos: { x: number; y: number }; color: string; onComplete: () => void;
}) => {
  const midX = (fromPos.x + toPos.x) / 2;
  const midY = Math.min(fromPos.y, toPos.y) - 30;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        x: [fromPos.x, midX, midX, toPos.x],
        y: [fromPos.y - 25, midY, midY, toPos.y - 25],
      }}
      transition={{ duration: 4, ease: "easeInOut", times: [0, 0.2, 0.7, 1] }}
      onAnimationComplete={onComplete}
    >
      <rect x="-38" y="-9" width="76" height="13" rx="5"
        fill="hsl(220 20% 12% / 0.95)" stroke={color} strokeWidth="0.5" />
      <path d="M-3,4 L0,7 L3,4" fill="hsl(220 20% 12% / 0.95)" />
      <text x="0" y="1.5" textAnchor="middle" fontSize="2.8" fill="hsl(0 0% 90%)" fontFamily="monospace">
        {message.length > 34 ? message.slice(0, 34) + "…" : message}
      </text>
    </motion.g>
  );
};

/* ── Data Flow Lines ── */
const DataLine = ({ x1, y1, x2, y2, color, delay }: { x1: number; y1: number; x2: number; y2: number; color: string; delay: number }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.3" strokeDasharray="3 3" opacity="0.08" />
    <motion.circle r="1.2" fill={color} opacity="0.5"
      animate={{ cx: [x1, x2, x1], cy: [y1, y2, y1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }} />
  </g>
);

/* ── Desk ── */
const Desk = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d="M-20,0 L0,-10 L20,0 L0,10 Z" fill="hsl(25 35% 32%)" stroke="hsl(25 25% 22%)" strokeWidth="0.4" />
    <path d="M-20,0 L-20,5 L0,15 L0,10 Z" fill="hsl(25 30% 26%)" />
    <path d="M20,0 L20,5 L0,15 L0,10 Z" fill="hsl(25 25% 20%)" />
    {/* Laptop */}
    <rect x="-5" y="-16" width="10" height="7" rx="1" fill="hsl(220 30% 18%)" stroke="hsl(220 15% 28%)" strokeWidth="0.4" />
    <rect x="-4" y="-15" width="8" height="5" rx="0.5" fill={`${color.replace(")", " / 0.2)")}`} />
    <rect x="-1" y="-9" width="2" height="2" fill="hsl(220 10% 25%)" />
    {/* Code on screen */}
    <motion.rect x="-3" y="-14" width="2.5" height="0.6" rx="0.2" fill={color} opacity="0.6"
      animate={{ width: [1, 2.5, 1.5] }} transition={{ duration: 2, repeat: Infinity }} />
    <rect x="-3" y="-12.8" width="4" height="0.4" rx="0.2" fill={color} opacity="0.3" />
    <rect x="-3" y="-11.8" width="3" height="0.4" rx="0.2" fill={color} opacity="0.2" />
    {/* Coffee cup */}
    <g transform="translate(8, -6)">
      <rect x="-1.2" y="-2" width="2.4" height="3" rx="0.5" fill="hsl(0 0% 90%)" />
      <motion.path d="M-0.5,-2.5 Q0,-4 0.5,-2.5" fill="none" stroke="hsl(0 0% 70%)" strokeWidth="0.3"
        animate={{ y: [-0.5, -1.5, -0.5], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
    </g>
  </g>
);

/* ── Plant ── */
const Plant = ({ x, y }: { x: number; y: number }) => (
  <motion.g transform={`translate(${x}, ${y})`}
    animate={{ y: [0, -1, 0] }} transition={{ duration: 3, repeat: Infinity }}>
    <path d="M-3,0 L-2,-5 L2,-5 L3,0 Z" fill="hsl(330 30% 40%)" />
    <motion.path d="M0,-5 Q-3,-10 -1,-12" fill="none" stroke="hsl(155 50% 45%)" strokeWidth="1" strokeLinecap="round"
      animate={{ d: ["M0,-5 Q-3,-10 -1,-12", "M0,-5 Q-4,-10 -2,-13", "M0,-5 Q-3,-10 -1,-12"] }}
      transition={{ duration: 2, repeat: Infinity }} />
    <motion.path d="M0,-5 Q2,-9 1,-12" fill="none" stroke="hsl(155 55% 50%)" strokeWidth="0.8" strokeLinecap="round"
      animate={{ d: ["M0,-5 Q2,-9 1,-12", "M0,-5 Q3,-9 2,-13", "M0,-5 Q2,-9 1,-12"] }}
      transition={{ duration: 2.5, repeat: Infinity }} />
    <circle cx="-1" cy="-12" r="1" fill="hsl(330 60% 60%)" />
  </motion.g>
);

/* ── Main Component ── */
const AnimatedOffice = () => {
  const [chatIdx, setChatIdx] = useState(0);
  const [activeBubble, setActiveBubble] = useState<typeof chatSequence[0] | null>(null);

  const advanceChat = useCallback(() => {
    setChatIdx(prev => {
      const next = (prev + 1) % chatSequence.length;
      setActiveBubble(chatSequence[next]);
      return next;
    });
  }, []);

  useEffect(() => {
    setActiveBubble(chatSequence[0]);
    const interval = setInterval(advanceChat, 6000);
    return () => clearInterval(interval);
  }, [advanceChat]);

  const currentChat = chatSequence[chatIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-4 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.span className="text-lg" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>🏢</motion.span>
        <h2 className="font-display text-sm font-semibold text-foreground tracking-wider uppercase">
          Oficina Mágica de OpenClaw
        </h2>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <span className="text-[10px] font-mono text-muted-foreground">EN VIVO</span>
        </div>
      </div>

      <svg viewBox="0 40 400 180" className="w-full h-auto" style={{ minHeight: "280px" }}>
        <defs>
          <radialGradient id="officeGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="hsl(155 60% 45% / 0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect x="0" y="40" width="400" height="180" fill="url(#officeGlow)" />

        {/* Data flow lines */}
        {AGENTS.filter(a => a.id !== "medusa").map((agent, i) => {
          const from = toSvg(agentDesks["medusa"]);
          const to = toSvg(agentDesks[agent.id]);
          return <DataLine key={agent.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} color={agent.color} delay={i * 0.8} />;
        })}

        {/* Desks */}
        {AGENTS.map(agent => {
          const pos = toSvg(agentDesks[agent.id]);
          return <Desk key={`desk-${agent.id}`} x={pos.x} y={pos.y + 20} color={agent.color} />;
        })}

        {/* Plants */}
        <Plant x={10} y={90} />
        <Plant x={390} y={95} />
        <Plant x={200} y={185} />

        {/* Agent Sprites */}
        {AGENTS.map(agent => {
          const pos = toSvg(agentDesks[agent.id]);
          const isTalking = currentChat?.from === agent.id || currentChat?.to === agent.id;
          const isTyping = !isTalking && Math.random() > 0.3;
          return (
            <KawaiiGirl
              key={agent.id}
              agent={agent}
              position={pos}
              isTalking={!!isTalking}
              isTyping={isTyping}
            />
          );
        })}

        {/* Chat Bubble */}
        <AnimatePresence>
          {activeBubble && (
            <ChatBubble
              key={`chat-${chatIdx}`}
              message={activeBubble.msg}
              fromPos={toSvg(agentDesks[activeBubble.from])}
              toPos={toSvg(agentDesks[activeBubble.to])}
              color={AGENTS.find(a => a.id === activeBubble.from)?.color || "hsl(155 60% 45%)"}
              onComplete={() => {}}
            />
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
};

export default AnimatedOffice;
