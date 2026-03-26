import { motion } from 'framer-motion';
import { useBalance } from '@/contexts/BalanceContext';

interface PigLevel {
  emoji: string;
  label: string;
  minBalance: number;
  maxBalance: number;
  size: number;
  accessories: string;
}

const PIG_LEVELS: PigLevel[] = [
  { emoji: '🐷', label: 'Porquinho Bebê', minBalance: 0, maxBalance: 100, size: 80, accessories: '' },
  { emoji: '🐷', label: 'Porquinho Esperto', minBalance: 100, maxBalance: 500, size: 95, accessories: '🤓' },
  { emoji: '🐷', label: 'Porquinho Forte', minBalance: 500, maxBalance: 1000, size: 110, accessories: '💪' },
  { emoji: '🐷', label: 'Porquinho Dourado', minBalance: 1000, maxBalance: 5000, size: 120, accessories: '✨' },
  { emoji: '🐷', label: 'Porquinho Rei', minBalance: 5000, maxBalance: Infinity, size: 130, accessories: '👑' },
];

const getPigLevel = (balance: number): PigLevel => {
  return [...PIG_LEVELS].reverse().find(l => balance >= l.minBalance) || PIG_LEVELS[0];
};

const getProgress = (balance: number, level: PigLevel): number => {
  if (level.maxBalance === Infinity) return 100;
  return Math.min(100, ((balance - level.minBalance) / (level.maxBalance - level.minBalance)) * 100);
};

interface Props {
  animate?: boolean;
}

const EvolutionaryPig = ({ animate = true }: Props) => {
  const { balance } = useBalance();
  const level = getPigLevel(balance);
  const progress = getProgress(balance, level);
  const levelIndex = PIG_LEVELS.indexOf(level);
  const nextLevel = PIG_LEVELS[Math.min(levelIndex + 1, PIG_LEVELS.length - 1)];

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="relative"
        animate={animate ? {
          y: [0, -8, 0],
          scale: [1, 1.03, 1],
        } : {}}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {level.accessories && (
          <motion.span
            className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
            style={{ fontSize: level.size * 0.35 }}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {level.accessories}
          </motion.span>
        )}
        <motion.span
          style={{ fontSize: level.size }}
          className="block select-none drop-shadow-lg"
          key={level.label}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          {level.emoji}
        </motion.span>
      </motion.div>

      <motion.p
        className="text-sm font-bold text-primary"
        key={level.label}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {level.label}
      </motion.p>

      {level.maxBalance !== Infinity && (
        <div className="w-full max-w-[200px]">
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            Próximo: {nextLevel.label} (R${nextLevel.minBalance})
          </p>
        </div>
      )}
    </div>
  );
};

export default EvolutionaryPig;
