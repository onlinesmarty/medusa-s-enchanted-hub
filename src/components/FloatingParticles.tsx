import { motion } from "framer-motion";

const snakeEmojis = ["🐍", "✨", "🔮", "💎", "⚡"];

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-sm opacity-20"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {snakeEmojis[i % snakeEmojis.length]}
        </motion.div>
      ))}
      {/* Glowing orbs */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              i % 3 === 0
                ? "hsl(155 60% 45% / 0.08)"
                : i % 3 === 1
                ? "hsl(270 45% 55% / 0.06)"
                : "hsl(45 80% 55% / 0.05)"
            }, transparent)`,
          }}
          initial={{
            x: `${20 + Math.random() * 60}%`,
            y: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            x: [
              `${20 + Math.random() * 60}%`,
              `${20 + Math.random() * 60}%`,
            ],
            y: [
              `${20 + Math.random() * 60}%`,
              `${20 + Math.random() * 60}%`,
            ],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
