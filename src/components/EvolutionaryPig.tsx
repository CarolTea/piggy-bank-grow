import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBalance } from '@/contexts/BalanceContext';
import { useSound } from '@/hooks/useSound';

interface PigLevel {
  label: string;
  minBalance: number;
  maxBalance: number;
  size: number;
  bodyColor: string;
  snoutColor: string;
  cheekColor: string;
  eyeStyle: 'cute' | 'smart' | 'fierce' | 'golden' | 'royal';
  extras: 'none' | 'glasses' | 'bandana' | 'glow' | 'crown';
  glowColor?: string;
}

export const PIG_LEVELS: PigLevel[] = [
  { label: 'Porquinho Bebê', minBalance: 0, maxBalance: 100, size: 140, bodyColor: '#FFB6C8', snoutColor: '#FF8FAB', cheekColor: '#FF6B8A', eyeStyle: 'cute', extras: 'none' },
  { label: 'Porquinho Esperto', minBalance: 100, maxBalance: 500, size: 150, bodyColor: '#FFA0BB', snoutColor: '#FF7BAA', cheekColor: '#FF5C8A', eyeStyle: 'smart', extras: 'glasses' },
  { label: 'Porquinho Forte', minBalance: 500, maxBalance: 1000, size: 155, bodyColor: '#E84393', snoutColor: '#D63384', cheekColor: '#C2185B', eyeStyle: 'fierce', extras: 'bandana' },
  { label: 'Porquinho Dourado', minBalance: 1000, maxBalance: 5000, size: 160, bodyColor: '#FFD700', snoutColor: '#F0C000', cheekColor: '#FFB300', eyeStyle: 'golden', extras: 'glow', glowColor: '#FFD700' },
  { label: 'Porquinho Rei', minBalance: 5000, maxBalance: Infinity, size: 165, bodyColor: '#FFD700', snoutColor: '#F0C000', cheekColor: '#FFB300', eyeStyle: 'royal', extras: 'crown', glowColor: '#FF6B35' },
];

export const getPigLevel = (balance: number): PigLevel => {
  return [...PIG_LEVELS].reverse().find(l => balance >= l.minBalance) || PIG_LEVELS[0];
};

const getProgress = (balance: number, level: PigLevel): number => {
  if (level.maxBalance === Infinity) return 100;
  return Math.min(100, ((balance - level.minBalance) / (level.maxBalance - level.minBalance)) * 100);
};

export const PigSVG = ({ level, size }: { level?: PigLevel; size: number }) => {
  const lvl = level || PIG_LEVELS[0];
  const s = size;
  const cx = s / 2;
  const cy = s / 2 + s * 0.02;
  const r = s * 0.38; // fatter body

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <defs>
        <radialGradient id={`bodyGrad-${lvl.label}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={lvl.bodyColor} stopOpacity="1" />
          <stop offset="80%" stopColor={lvl.snoutColor} stopOpacity="1" />
        </radialGradient>
        {lvl.glowColor && (
          <filter id={`glow-${lvl.label}`}>
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {lvl.glowColor && (
        <circle cx={cx} cy={cy} r={r + 14} fill={lvl.glowColor} opacity="0.12" />
      )}

      {/* Ears — short and round */}
      <ellipse cx={cx - r * 0.55} cy={cy - r * 0.7} rx={r * 0.32} ry={r * 0.25} fill={lvl.bodyColor} stroke="white" strokeWidth="1.5" strokeOpacity="0.3" transform={`rotate(-15 ${cx - r * 0.55} ${cy - r * 0.7})`} />
      <ellipse cx={cx + r * 0.55} cy={cy - r * 0.7} rx={r * 0.32} ry={r * 0.25} fill={lvl.bodyColor} stroke="white" strokeWidth="1.5" strokeOpacity="0.3" transform={`rotate(15 ${cx + r * 0.55} ${cy - r * 0.7})`} />
      {/* Inner ear */}
      <ellipse cx={cx - r * 0.55} cy={cy - r * 0.68} rx={r * 0.18} ry={r * 0.14} fill={lvl.cheekColor} opacity="0.6" transform={`rotate(-15 ${cx - r * 0.55} ${cy - r * 0.68})`} />
      <ellipse cx={cx + r * 0.55} cy={cy - r * 0.68} rx={r * 0.18} ry={r * 0.14} fill={lvl.cheekColor} opacity="0.6" transform={`rotate(15 ${cx + r * 0.55} ${cy - r * 0.68})`} />

      {/* Body — fat circle */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#bodyGrad-${lvl.label})`} stroke="white" strokeWidth="2.5" strokeOpacity="0.35" filter={lvl.glowColor ? `url(#glow-${lvl.label})` : undefined} />

      {/* Cheeks — prominent */}
      <circle cx={cx - r * 0.52} cy={cy + r * 0.12} r={r * 0.2} fill={lvl.cheekColor} opacity="0.45" />
      <circle cx={cx + r * 0.52} cy={cy + r * 0.12} r={r * 0.2} fill={lvl.cheekColor} opacity="0.45" />

      {/* Highlight/shine on body */}
      <ellipse cx={cx - r * 0.25} cy={cy - r * 0.3} rx={r * 0.22} ry={r * 0.12} fill="white" opacity="0.18" transform={`rotate(-20 ${cx - r * 0.25} ${cy - r * 0.3})`} />

      {/* Snout — bigger oval */}
      <ellipse cx={cx} cy={cy + r * 0.18} rx={r * 0.4} ry={r * 0.3} fill={lvl.snoutColor} stroke="white" strokeWidth="1" strokeOpacity="0.2" />
      {/* Nostrils — bigger */}
      <ellipse cx={cx - r * 0.12} cy={cy + r * 0.2} rx={r * 0.09} ry={r * 0.11} fill={lvl.cheekColor} />
      <ellipse cx={cx + r * 0.12} cy={cy + r * 0.2} rx={r * 0.09} ry={r * 0.11} fill={lvl.cheekColor} />

      {/* Eyes */}
      {lvl.eyeStyle === 'cute' && (
        <>
          <circle cx={cx - r * 0.28} cy={cy - r * 0.22} r={r * 0.15} fill="#2D1B30" />
          <circle cx={cx + r * 0.28} cy={cy - r * 0.22} r={r * 0.15} fill="#2D1B30" />
          <circle cx={cx - r * 0.24} cy={cy - r * 0.28} r={r * 0.07} fill="white" />
          <circle cx={cx + r * 0.32} cy={cy - r * 0.28} r={r * 0.07} fill="white" />
          <circle cx={cx - r * 0.3} cy={cy - r * 0.2} r={r * 0.03} fill="white" opacity="0.6" />
          <circle cx={cx + r * 0.26} cy={cy - r * 0.2} r={r * 0.03} fill="white" opacity="0.6" />
        </>
      )}
      {lvl.eyeStyle === 'smart' && (
        <>
          <circle cx={cx - r * 0.28} cy={cy - r * 0.22} r={r * 0.13} fill="#2D1B30" />
          <circle cx={cx + r * 0.28} cy={cy - r * 0.22} r={r * 0.13} fill="#2D1B30" />
          <circle cx={cx - r * 0.24} cy={cy - r * 0.27} r={r * 0.06} fill="white" />
          <circle cx={cx + r * 0.32} cy={cy - r * 0.27} r={r * 0.06} fill="white" />
        </>
      )}
      {lvl.eyeStyle === 'fierce' && (
        <>
          <circle cx={cx - r * 0.28} cy={cy - r * 0.2} r={r * 0.12} fill="#2D1B30" />
          <circle cx={cx + r * 0.28} cy={cy - r * 0.2} r={r * 0.12} fill="#2D1B30" />
          <circle cx={cx - r * 0.24} cy={cy - r * 0.24} r={r * 0.05} fill="white" />
          <circle cx={cx + r * 0.32} cy={cy - r * 0.24} r={r * 0.05} fill="white" />
          <line x1={cx - r * 0.42} y1={cy - r * 0.38} x2={cx - r * 0.14} y2={cy - r * 0.34} stroke="#2D1B30" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx + r * 0.42} y1={cy - r * 0.38} x2={cx + r * 0.14} y2={cy - r * 0.34} stroke="#2D1B30" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {(lvl.eyeStyle === 'golden' || lvl.eyeStyle === 'royal') && (
        <>
          <circle cx={cx - r * 0.28} cy={cy - r * 0.22} r={r * 0.14} fill="#5D3A00" />
          <circle cx={cx + r * 0.28} cy={cy - r * 0.22} r={r * 0.14} fill="#5D3A00" />
          <circle cx={cx - r * 0.24} cy={cy - r * 0.27} r={r * 0.06} fill="#FFF8DC" />
          <circle cx={cx + r * 0.32} cy={cy - r * 0.27} r={r * 0.06} fill="#FFF8DC" />
        </>
      )}

      {/* Glasses */}
      {lvl.extras === 'glasses' && (
        <>
          <circle cx={cx - r * 0.28} cy={cy - r * 0.22} r={r * 0.22} fill="none" stroke="#4A2C82" strokeWidth="2.5" />
          <circle cx={cx + r * 0.28} cy={cy - r * 0.22} r={r * 0.22} fill="none" stroke="#4A2C82" strokeWidth="2.5" />
          <line x1={cx - r * 0.06} y1={cy - r * 0.22} x2={cx + r * 0.06} y2={cy - r * 0.22} stroke="#4A2C82" strokeWidth="2.5" />
          <line x1={cx - r * 0.5} y1={cy - r * 0.22} x2={cx - r * 0.62} y2={cy - r * 0.35} stroke="#4A2C82" strokeWidth="2.5" />
          <line x1={cx + r * 0.5} y1={cy - r * 0.22} x2={cx + r * 0.62} y2={cy - r * 0.35} stroke="#4A2C82" strokeWidth="2.5" />
        </>
      )}

      {/* Bandana */}
      {lvl.extras === 'bandana' && (
        <>
          <path d={`M${cx - r * 0.85} ${cy - r * 0.45} Q${cx} ${cy - r * 0.7} ${cx + r * 0.85} ${cy - r * 0.45}`} fill="none" stroke="#E84393" strokeWidth="5" strokeLinecap="round" />
          <circle cx={cx + r * 0.8} cy={cy - r * 0.45} r={r * 0.08} fill="#E84393" />
          <line x1={cx + r * 0.8} y1={cy - r * 0.45} x2={cx + r * 0.95} y2={cy - r * 0.25} stroke="#E84393" strokeWidth="3" strokeLinecap="round" />
          <line x1={cx + r * 0.8} y1={cy - r * 0.45} x2={cx + r * 1.0} y2={cy - r * 0.35} stroke="#C2185B" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Crown */}
      {lvl.extras === 'crown' && (
        <>
          <path d={`M${cx - r * 0.45} ${cy - r * 0.55} L${cx - r * 0.35} ${cy - r * 0.9} L${cx - r * 0.12} ${cy - r * 0.65} L${cx} ${cy - r * 1.0} L${cx + r * 0.12} ${cy - r * 0.65} L${cx + r * 0.35} ${cy - r * 0.9} L${cx + r * 0.45} ${cy - r * 0.55} Z`}
            fill="url(#crownGrad)" stroke="#B8860B" strokeWidth="1.5" />
          <defs>
            <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
          </defs>
          <circle cx={cx} cy={cy - r * 0.82} r={r * 0.06} fill="#FF1744" />
          <circle cx={cx - r * 0.25} cy={cy - r * 0.72} r={r * 0.04} fill="#2979FF" />
          <circle cx={cx + r * 0.25} cy={cy - r * 0.72} r={r * 0.04} fill="#00E676" />
        </>
      )}

      {/* Smile */}
      <path d={`M${cx - r * 0.18} ${cy + r * 0.4} Q${cx} ${cy + r * 0.55} ${cx + r * 0.18} ${cy + r * 0.4}`} fill="none" stroke="#2D1B30" strokeWidth="2.5" strokeLinecap="round" />

      {/* Feet */}
      <ellipse cx={cx - r * 0.35} cy={cy + r * 0.92} rx={r * 0.2} ry={r * 0.1} fill={lvl.snoutColor} stroke="white" strokeWidth="1" strokeOpacity="0.2" />
      <ellipse cx={cx + r * 0.35} cy={cy + r * 0.92} rx={r * 0.2} ry={r * 0.1} fill={lvl.snoutColor} stroke="white" strokeWidth="1" strokeOpacity="0.2" />
    </svg>
  );
};

const FloatingParticles = ({ count, color }: { count: number; color: string }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: 4 + Math.random() * 4,
          height: 4 + Math.random() * 4,
          background: color,
          top: `${10 + Math.random() * 80}%`,
          left: `${10 + Math.random() * 80}%`,
        }}
        animate={{
          y: [0, -20 - Math.random() * 15, 0],
          opacity: [0.3, 0.9, 0.3],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: 'easeInOut',
        }}
      />
    ))}
  </>
);

interface Props {
  animate?: boolean;
}

const EvolutionaryPig = ({ animate = true }: Props) => {
  const { balance } = useBalance();
  const { playLevelUp } = useSound();
  const level = getPigLevel(balance);
  const progress = getProgress(balance, level);
  const levelIndex = PIG_LEVELS.indexOf(level);
  const nextLevel = PIG_LEVELS[Math.min(levelIndex + 1, PIG_LEVELS.length - 1)];
  const prevLevelRef = useRef(level.label);

  useEffect(() => {
    if (prevLevelRef.current !== level.label) {
      playLevelUp();
      prevLevelRef.current = level.label;
    }
  }, [level.label, playLevelUp]);

  const bounceAnimation = level.eyeStyle === 'cute'
    ? { y: [0, -6, 0], rotate: [0, 2, -2, 0] }
    : level.eyeStyle === 'fierce'
      ? { y: [0, -4, 0], scale: [1, 1.04, 1] }
      : level.eyeStyle === 'royal'
        ? { y: [0, -10, 0], scale: [1, 1.02, 1] }
        : { y: [0, -8, 0] };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className="relative"
        animate={animate ? bounceAnimation : {}}
        transition={{
          duration: level.eyeStyle === 'royal' ? 3 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Circular backdrop for contrast — no blur */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-full"
            style={{
              width: level.size * 0.9,
              height: level.size * 0.9,
              background: 'rgba(255,255,255,0.22)',
            }}
          />
        </div>

        {/* Glow behind pig — separate layer, won't blur the SVG */}
        {level.glowColor && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <motion.div
              className="rounded-full"
              style={{
                width: level.size * 1.2,
                height: level.size * 1.2,
                background: `radial-gradient(circle, ${level.glowColor}40 0%, transparent 70%)`,
              }}
              animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        )}

        {(level.extras === 'glow' || level.extras === 'crown') && (
          <FloatingParticles count={8} color={level.glowColor || '#FFD700'} />
        )}

        <motion.div
          key={level.label}
          initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="relative z-10"
        >
          <PigSVG level={level} size={level.size} />
        </motion.div>
      </motion.div>

      <motion.p
        className="text-sm font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        key={level.label + '-label'}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {level.label}
      </motion.p>

      {level.maxBalance !== Infinity && (
        <div className="w-full max-w-[180px]">
          <div className="h-2.5 rounded-full bg-muted overflow-hidden relative">
            <motion.div
              className="h-full rounded-full gradient-hot"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-white/90 mt-1 text-center font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
            Próximo: <span className="text-accent font-black">{nextLevel.label}</span> (R${nextLevel.minBalance})
          </p>
        </div>
      )}
    </div>
  );
};

export default EvolutionaryPig;
