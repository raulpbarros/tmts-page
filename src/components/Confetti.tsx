import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "../lib/hooks";

// One-shot celebration burst fired when a mythic ("Carta Mítica") card is pulled.
// Self-contained (no deps beyond framer-motion). Fixed overlay, never blocks
// clicks. Mount it to play; unmount via `onDone` after the run. No-op (instant
// done) for users who prefer reduced motion.
const COLORS = ["#c6f73a", "#ff5a3c", "#fcd34d", "#ffffff", "#22d3ee"];
const PIECES = 90;
const DURATION = 2.4;

type Piece = {
  x: number; // vw offset from center
  y: number; // vh fall distance
  rotate: number;
  delay: number;
  size: number;
  color: string;
  drift: number;
};

export default function Confetti({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: PIECES }, () => ({
        x: (Math.random() - 0.5) * 120,
        y: 110 + Math.random() * 30,
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.25,
        size: 6 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        drift: (Math.random() - 0.5) * 30,
      })),
    [],
  );

  // Reduced motion: skip the animation entirely, signal completion next tick.
  if (reduced) {
    queueMicrotask(onDone);
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-[-5vh]"
          style={{ width: p.size, height: p.size * 0.6, backgroundColor: p.color }}
          initial={{ x: `${p.x}vw`, y: "-5vh", rotate: 0, opacity: 1 }}
          animate={{
            x: [`${p.x}vw`, `${p.x + p.drift}vw`],
            y: `${p.y}vh`,
            rotate: p.rotate,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: DURATION, delay: p.delay, ease: "easeIn" }}
          onAnimationComplete={i === 0 ? onDone : undefined}
        />
      ))}
    </div>
  );
}
