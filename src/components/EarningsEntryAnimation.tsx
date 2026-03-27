import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBalance } from '@/contexts/BalanceContext';
import { useSound } from '@/hooks/useSound';
import { TrendingUp, Sparkles } from 'lucide-react';

interface Props {
  show: boolean;
  onComplete: () => void;
}

const EarningsEntryAnimation = ({ show, onComplete }: Props) => {
  const { balance, dailyYield } = useBalance();
  const { playCoin } = useSound();
  const [step, setStep] = useState(0);
  const [countBalance, setCountBalance] = useState(0);

  useEffect(() => {
    if (!show) {
      setStep(0);
      setCountBalance(0);
      return;
    }

    // Step 1: show balance
    const t1 = setTimeout(() => {
      setStep(1);
      playCoin();
    }, 600);

    // Count up balance
    const t2 = setTimeout(() => {
      const steps = 30;
      const inc = balance / steps;
      let s = 0;
      const interval = setInterval(() => {
        s++;
        if (s >= steps) {
          setCountBalance(balance);
          clearInterval(interval);
        } else {
          setCountBalance(prev => prev + inc);
        }
      }, 40);
    }, 800);

    // Step 2: show daily yield
    const t3 = setTimeout(() => setStep(2), 2200);

    // Step 3: show monthly
    const t4 = setTimeout(() => setStep(3), 3200);

    // Done
    const t5 = setTimeout(() => onComplete(), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: 'linear-gradient(145deg, hsl(280 60% 12% / 0.95), hsl(320 70% 15% / 0.95), hsl(260 50% 10% / 0.95))' }}
        >
          {/* Floating particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 4 + Math.random() * 8,
                height: 4 + Math.random() * 8,
                background: `hsla(${40 + Math.random() * 40}, 90%, 60%, ${0.2 + Math.random() * 0.3})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          <div className="flex flex-col items-center gap-6 px-8">
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="text-accent" size={20} />
              <p className="text-white/70 font-bold text-sm">Bem-vindo de volta!</p>
              <Sparkles className="text-accent" size={20} />
            </motion.div>

            {/* Balance counter */}
            {step >= 1 && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-center"
              >
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Seu saldo</p>
                <motion.p
                  className="text-5xl font-black text-white"
                  style={{ textShadow: '0 0 40px hsla(320, 90%, 58%, 0.4)' }}
                >
                  R$ {countBalance.toFixed(2)}
                </motion.p>
              </motion.div>
            )}

            {/* Daily yield */}
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring' }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl"
              >
                <TrendingUp size={18} className="text-success" />
                <p className="text-success font-black text-sm">
                  +R$ {dailyYield.toFixed(4)}/dia
                </p>
              </motion.div>
            )}

            {/* Monthly */}
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl"
              >
                <p className="text-accent font-black text-sm">
                  📊 +R$ {(dailyYield * 30).toFixed(2)}/mês • 5.87% ao ano
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EarningsEntryAnimation;
