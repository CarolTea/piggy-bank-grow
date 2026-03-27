import { useState, useEffect, useRef } from 'react';
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
import { getPigLevel } from '@/components/EvolutionaryPig';
import { ArrowDown, ArrowUp, GraduationCap, TrendingUp, LogOut, Flame, Zap, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const Dashboard = () => {
  const { balance, dailyYield } = useBalance();
  const { user, logout } = useAuth();
  const { playClick, muted, toggleMute } = useSound();
  const navigate = useNavigate();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [streak] = useState(7);
  const [showEarningsEntry, setShowEarningsEntry] = useState(true);
  const flashcardShownRef = useRef(false);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: any; newLevel: any } | null>(null);
  const prevLevelRef = useRef(getPigLevel(balance));

  // Show a flashcard popup after 20s idle — only once
  useEffect(() => {
    if (flashcardShownRef.current) return;
    const timer = setTimeout(() => {
      if (!flashcardShownRef.current) {
        setFlashcardOpen(true);
        flashcardShownRef.current = true;
      }
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

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
            <p className="text-white/70 text-[10px] mt-0.5 font-semibold">Rendendo via Solana ⚡</p>
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
              { label: 'Protocolo', value: 'Solana • Kamino Vaults', color: 'text-primary' },
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
              Rede Solana — transações em &lt;1s, sem taxas
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

      <EarningsEntryAnimation show={showEarningsEntry} onComplete={() => setShowEarningsEntry(false)} />
      {levelUpData && (
        <LevelUpAnimation
          show={!!levelUpData}
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          onComplete={() => setLevelUpData(null)}
        />
      )}
      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} onSuccess={() => {
        // Check for level up
        const newLevel = getPigLevel(balance);
        if (prevLevelRef.current.label !== newLevel.label) {
          setLevelUpData({ oldLevel: prevLevelRef.current, newLevel });
          prevLevelRef.current = newLevel;
        } else if (!flashcardShownRef.current) {
          setFlashcardOpen(true);
          flashcardShownRef.current = true;
        }
      }} />
      <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      <FlashcardPopup open={flashcardOpen} onOpenChange={setFlashcardOpen} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
