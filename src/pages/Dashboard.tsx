import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '@/contexts/BalanceContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSound } from '@/hooks/useSound';
import EvolutionaryPig from '@/components/EvolutionaryPig';
import BottomNav from '@/components/BottomNav';
import DepositModal from '@/components/DepositModal';
import WithdrawModal from '@/components/WithdrawModal';
import FlashcardPopup from '@/components/FlashcardPopup';
import EarningsEntryAnimation from '@/components/EarningsEntryAnimation';
import LevelUpAnimation from '@/components/LevelUpAnimation';
import { getPigLevel, PIG_LEVELS } from '@/components/EvolutionaryPig';
import { ArrowDown, ArrowUp, GraduationCap, TrendingUp, LogOut, Flame, Zap, Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const HeaderParticles = () => (
  <>
    {Array.from({ length: 10 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 3 + Math.random() * 5,
          height: 3 + Math.random() * 5,
          background: `hsla(${320 + Math.random() * 60}, 90%, 70%, ${0.1 + Math.random() * 0.15})`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -25 - Math.random() * 15, 0],
          opacity: [0.1, 0.35, 0.1],
        }}
        transition={{
          duration: 3 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: 'easeInOut',
        }}
      />
    ))}
  </>
);

type OverlayType = 'earnings' | 'levelup' | 'leveldown' | 'flashcard';

const COOLDOWN_MS = 800; // pause between overlays

const Dashboard = () => {
  const { balance, dailyYield } = useBalance();
  const { user, logout } = useAuth();
  const { playClick, muted, toggleMute, startBgMusic, stopBgMusic, setBgVolume, getBgVolume } = useSound();
  const [bgVol, setBgVol] = useState(0.08);
  const [showVolSlider, setShowVolSlider] = useState(false);

  // Start background music on mount
  useEffect(() => {
    startBgMusic();
    return () => stopBgMusic();
  }, [startBgMusic, stopBgMusic]);
  const navigate = useNavigate();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [streak] = useState(7);

  // Overlay orchestration
  const [activeOverlay, setActiveOverlay] = useState<OverlayType | null>('earnings');
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: any; newLevel: any; direction?: 'up' | 'down' } | null>(null);
  const [levelDirection, setLevelDirection] = useState<'up' | 'down'>('up');
  const prevLevelRef = useRef(getPigLevel(balance));
  const isFirstRender = useRef(true);
  const pendingQueue = useRef<OverlayType[]>([]);
  const flowBusy = useRef(true); // starts busy because earnings is active
  const pendingLevelUp = useRef<{ oldLevel: any; newLevel: any; direction?: 'up' | 'down' } | null>(null);

  // Enqueue an overlay, preventing duplicates
  const enqueueOverlay = useCallback((type: OverlayType) => {
    if (activeOverlay === type) return;
    if (pendingQueue.current.includes(type)) return;
    pendingQueue.current.push(type);
  }, [activeOverlay]);

  // Show next overlay from queue with cooldown
  const showNextOverlay = useCallback((skipCooldown = false) => {
    flowBusy.current = true;
    const delay = skipCooldown ? 50 : COOLDOWN_MS;
    setTimeout(() => {
      if (pendingQueue.current.length > 0) {
        const next = pendingQueue.current.shift()!;
        // If it's levelup/leveldown, apply the stored data
        if ((next === 'levelup' || next === 'leveldown') && pendingLevelUp.current) {
          setLevelUpData(pendingLevelUp.current);
          setLevelDirection(pendingLevelUp.current.direction);
          pendingLevelUp.current = null;
        }
        setActiveOverlay(next);
      } else {
        setActiveOverlay(null);
        flowBusy.current = false;
      }
    }, delay);
  }, []);

  // Detect level changes — store pending, don't show immediately
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const newLevel = getPigLevel(balance);
    if (prevLevelRef.current.label !== newLevel.label) {
      const oldIdx = PIG_LEVELS.indexOf(prevLevelRef.current);
      const newIdx = PIG_LEVELS.indexOf(newLevel);
      const dir: 'up' | 'down' = newIdx >= oldIdx ? 'up' : 'down';
      pendingLevelUp.current = { oldLevel: prevLevelRef.current, newLevel, direction: dir };
      prevLevelRef.current = newLevel;
      enqueueOverlay(dir === 'up' ? 'levelup' : 'leveldown');
    }
  }, [balance, enqueueOverlay]);

  // Flashcard idle timer — only when no flow is active
  useEffect(() => {
    // Don't start timer if flow is busy
    if (flowBusy.current || activeOverlay) return;

    const timer = setTimeout(() => {
      if (!flowBusy.current && !activeOverlay) {
        enqueueOverlay('flashcard');
        // Trigger it since nothing is active
        if (!activeOverlay) {
          setActiveOverlay('flashcard');
          flowBusy.current = true;
        }
      }
    }, 20000);
    return () => clearTimeout(timer);
  }, [activeOverlay, enqueueOverlay]);

  // Handle deposit completion: queue levelup (if pending) then flashcard
  const handleDepositComplete = useCallback(() => {
    // levelup was already enqueued by the balance effect
    // just add flashcard after it
    enqueueOverlay('flashcard');

    // If nothing is currently showing, kick off the queue
    if (!activeOverlay) {
      showNextOverlay();
    }
  }, [activeOverlay, enqueueOverlay, showNextOverlay]);

  // Balance counter animation
  useEffect(() => {
    const diff = balance - displayBalance;
    if (Math.abs(diff) < 0.001) return;
    const steps = 20;
    const increment = diff / steps;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps) {
        setDisplayBalance(balance);
        clearInterval(interval);
      } else {
        setDisplayBalance(prev => prev + increment);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [balance]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative overflow-hidden gradient-primary animate-gradient px-5 pt-5 pb-5 rounded-b-[2rem]">
        <HeaderParticles />
        
        <div className="max-w-md mx-auto relative z-10">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-white/80 text-sm">Olá,</p>
              <p className="text-white font-black text-lg">{user?.name || 'Usuário'} 👋</p>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="flex items-center gap-1 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame size={14} className="text-accent" />
                <span className="text-white font-black text-xs">{streak}</span>
              </motion.div>
              <div className="relative flex items-center gap-1">
                <button
                  onClick={() => setShowVolSlider(v => !v)}
                  className="text-white/60 hover:text-white transition-colors p-1"
                >
                  <Music size={16} />
                </button>
                <AnimatePresence>
                  {showVolSlider && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="absolute right-full mr-1 flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-3 py-1.5"
                    >
                      <Slider
                        value={[bgVol * 100]}
                        onValueChange={([v]) => { const vol = v / 100; setBgVol(vol); setBgVolume(vol); }}
                        onValueCommit={() => setTimeout(() => setShowVolSlider(false), 600)}
                        max={30}
                        step={1}
                        className="w-20"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors p-1">
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button onClick={handleLogout} className="text-white/60 hover:text-white transition-colors p-1">
                <LogOut size={16} />
              </button>
            </div>
          </div>

          <EvolutionaryPig />

          <motion.div
            className="text-center mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Saldo Total</p>
            <AnimatePresence mode="wait">
              <motion.p
                className="text-3xl font-black text-white mt-0.5"
                key={Math.floor(displayBalance)}
                initial={{ scale: 1.08, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ textShadow: '0 0 30px hsla(320, 90%, 58%, 0.3)' }}
              >
                R$ {displayBalance.toFixed(2)}
              </motion.p>
            </AnimatePresence>
            <motion.div
              className="flex items-center justify-center gap-1.5 mt-1"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp size={13} className="text-success" />
              <p className="text-success text-xs font-black">
                +5.87% ao ano • +R${dailyYield.toFixed(4)}/dia
              </p>
            </motion.div>
            <p className="text-white/70 text-[10px] mt-0.5 font-semibold"><p className="text-white/70 text-[10px] mt-0.5 font-semibold">Rendendo via Stellar ⚡</p></p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 mt-4 relative z-10">
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            className="flex-1 h-14 rounded-2xl font-black text-base gap-2 gradient-hot text-white glow-pink border-0 active:scale-95 transition-transform"
            onClick={() => { playClick(); setDepositOpen(true); }}
          >
            <ArrowDown size={20} /> Depositar
          </Button>
          <Button
            className="flex-1 h-14 rounded-2xl font-black text-base gap-2 bg-muted text-foreground border border-border hover:bg-muted/80 active:scale-95 transition-transform"
            onClick={() => { playClick(); setWithdrawOpen(true); }}
          >
            <ArrowUp size={20} /> Sacar
          </Button>
          <Button
            className="h-14 rounded-2xl font-black px-4 gradient-gold text-gold-foreground glow-gold active:scale-95 transition-transform border-0"
            onClick={() => { playClick(); navigate('/education'); }}
          >
            <GraduationCap size={22} />
          </Button>
        </motion.div>

        {/* Info Card */}
        <motion.div
          className="mt-5 p-4 rounded-2xl bg-card border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-black text-sm mb-3 flex items-center gap-2">
            <span className="text-lg">📊</span> Como seu dinheiro rende
          </h3>
          <div className="space-y-2">
            {[
              { label: 'Rendimento hoje', value: `+R$ ${dailyYield.toFixed(4)}`, color: 'text-success' },
              { label: 'Rendimento/mês', value: `+R$ ${(dailyYield * 30).toFixed(2)}`, color: 'text-success' },
              { label: 'APY atual', value: '5.87%', color: 'text-primary' },
              { label: 'Protocolo', value: 'Stellar • Blend', color: 'text-primary' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-sm font-black ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            <Zap size={14} className="text-accent" />
            <p className="text-xs text-muted-foreground font-semibold">
              Rede Stellar — transações em &lt;1s, sem taxas
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-3 p-3 rounded-2xl bg-primary/10 border border-primary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-sm font-bold">
            🔥 <span className="text-gradient font-black">Dica:</span> Ative o Pix Automático e poupe sem esforço!
          </p>
        </motion.div>
      </div>

      <EarningsEntryAnimation show={activeOverlay === 'earnings'} onComplete={showNextOverlay} />
      <LevelUpAnimation
        show={activeOverlay === 'levelup' || activeOverlay === 'leveldown'}
        oldLevel={levelUpData?.oldLevel || null}
        newLevel={levelUpData?.newLevel || null}
        direction={levelDirection}
        onComplete={() => { setLevelUpData(null); showNextOverlay(); }}
      />
      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} onSuccess={handleDepositComplete} />
      <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      <FlashcardPopup open={activeOverlay === 'flashcard'} onOpenChange={(open) => { if (!open) showNextOverlay(true); }} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
