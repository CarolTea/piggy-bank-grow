import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Props {
  active: boolean;
  duration?: number;
}

const EMOJIS = ['🪙', '💰', '✨', '⭐', '🎉'];

const Confetti = ({ active, duration = 2000 }: Props) => {
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; delay: number }[]>([]);

  useEffect(() => {
    if (active) {
      const p = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
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
          className="fixed z-50 text-2xl pointer-events-none"
          style={{ left: `${p.x}%` }}
          initial={{ top: '-10%', opacity: 1, scale: 0.5 }}
          animate={{ top: '110%', opacity: 0, scale: 1, rotate: Math.random() * 360 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 + Math.random(), delay: p.delay, ease: 'easeIn' }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </AnimatePresence>
  );
};

export default Confetti;
