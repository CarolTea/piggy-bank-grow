import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { PigSVG } from '@/components/EvolutionaryPig';
import Confetti from './Confetti';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PigLevelInfo {
  label: string;
  size: number;
  bodyColor: string;
  snoutColor: string;
  cheekColor: string;
  eyeStyle: 'cute' | 'smart' | 'fierce' | 'golden' | 'royal';
  extras: 'none' | 'glasses' | 'bandana' | 'glow' | 'crown';
  glowColor?: string;
}

interface Props {
  show: boolean;
  oldLevel: PigLevelInfo | null;
  newLevel: PigLevelInfo | null;
  onComplete: () => void;
}

const LevelUpAnimation = ({ show, oldLevel, newLevel, onComplete }: Props) => {
  const { playLevelUp } = useSound();
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!show || !oldLevel || !newLevel) {
      setStep(0);
      setShowConfetti(false);
      return;
    }

    const t1 = setTimeout(() => setStep(1), 300);
    const t2 = setTimeout(() => {
      setStep(2);
      playLevelUp();
      setShowConfetti(true);
    }, 1500);
    const t3 = setTimeout(() => setStep(3), 2500);
    const t4 = setTimeout(() => {
      setShowConfetti(false);
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [show]);

  if (!oldLevel || !newLevel) return null;

  return (
    <>
      <Confetti active={showConfetti} />
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'linear-gradient(145deg, hsl(280 60% 12% / 0.97), hsl(320 70% 15% / 0.97), hsl(260 50% 10% / 0.97))' }}
          >
            {/* Radial glow */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 300,
                height: 300,
                background: `radial-gradient(circle, ${newLevel.glowColor || newLevel.bodyColor}30 0%, transparent 70%)`,
              }}
              animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="flex flex-col items-center gap-6 px-8 relative z-10">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <Sparkles className="text-accent" size={22} />
                <p className="text-white font-black text-xl">Evolução!</p>
                <Sparkles className="text-accent" size={22} />
              </motion.div>

              {/* Pig transition */}
              <div className="flex items-center gap-4">
                {/* Old pig */}
                {step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={step >= 2 ? { opacity: 0.4, x: 0, scale: 0.7 } : { opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="flex flex-col items-center"
                  >
                    <PigSVG level={oldLevel as any} size={100} />
                    <p className="text-white/50 text-xs font-bold mt-1">{oldLevel.label}</p>
                  </motion.div>
                )}

                {/* Arrow */}
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <ArrowRight className="text-accent" size={28} />
                  </motion.div>
                )}

                {/* New pig */}
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <PigSVG level={newLevel as any} size={140} />
                    </motion.div>
                    <motion.p
                      className="text-white font-black text-base mt-1"
                      style={{ textShadow: `0 0 20px ${newLevel.glowColor || newLevel.bodyColor}80` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {newLevel.label}
                    </motion.p>
                  </motion.div>
                )}
              </div>

              {/* Message */}
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl text-center"
                >
                  <p className="text-white/80 text-sm font-bold">
                    🎉 Seu porquinho evoluiu! Continue poupando!
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LevelUpAnimation;
