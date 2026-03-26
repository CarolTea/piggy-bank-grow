import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Props {
  active: boolean;
  duration?: number;
}

const COINS = ['🪙', '💰', '✨', '⭐', '💎', '🔥'];

const Confetti = ({ active, duration = 2500 }: Props) => {
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; delay: number; size: number; spin: number }[]>([]);

  useEffect(() => {
    if (active) {
      const p = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        emoji: COINS[Math.floor(Math.random() * COINS.length)],
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        size: 16 + Math.random() * 20,
        spin: Math.random() * 720 - 360,
      }));
      setParticles(p);
      const timer = setTimeout(() => setParticles([]), duration);
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [active, duration]);

  return (
    <AnimatePresence>
      {particles.map(p => (
        <motion.span
          key={p.id}
          className="fixed z-50 pointer-events-none"
          style={{ left: `${p.x}%`, fontSize: p.size }}
          initial={{ top: '-5%', opacity: 1, scale: 0.3, rotate: 0 }}
          animate={{
            top: '105%',
            opacity: [1, 1, 0],
            scale: [0.3, 1.2, 0.8],
            rotate: p.spin,
            x: [0, Math.random() * 60 - 30, Math.random() * 40 - 20],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.8 + Math.random() * 0.8,
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </AnimatePresence>
  );
};

export default Confetti;
