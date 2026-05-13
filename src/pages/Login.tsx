import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSound } from '@/hooks/useSound';
import { PigSVG } from '@/components/EvolutionaryPig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Zap, Wallet, QrCode, TrendingUp, GraduationCap, Shield, ArrowRightLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const LoginParticles = () => (
  <>
    {/* Nebula blobs */}
    {Array.from({ length: 14 }).map((_, i) => (
      <motion.div
        key={`neb-${i}`}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 6 + Math.random() * 20,
          height: 6 + Math.random() * 20,
          background: `hsla(${220 + Math.random() * 80}, 80%, 65%, ${0.06 + Math.random() * 0.12})`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          filter: 'blur(1px)',
        }}
        animate={{
          y: [0, -40 - Math.random() * 30, 0],
          x: [0, Math.random() * 30 - 15, 0],
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 4,
          ease: 'easeInOut',
        }}
      />
    ))}
    {/* Twinkling stars */}
    {Array.from({ length: 40 }).map((_, i) => (
      <div
        key={`star-${i}`}
        className="absolute rounded-full bg-white animate-twinkle pointer-events-none"
        style={{
          width: 1 + Math.random() * 2,
          height: 1 + Math.random() * 2,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          boxShadow: '0 0 4px rgba(255,255,255,0.8)',
        }}
      />
    ))}
    {/* Shooting stars */}
    {Array.from({ length: 2 }).map((_, i) => (
      <div
        key={`shoot-${i}`}
        className="absolute pointer-events-none animate-shooting-star"
        style={{
          left: `${10 + i * 40}%`,
          top: `${10 + i * 20}%`,
          animationDelay: `${i * 2.5}s`,
        }}
      >
        <div style={{
          width: 80, height: 1.5,
          background: 'linear-gradient(90deg, transparent, white, transparent)',
          boxShadow: '0 0 6px white',
        }} />
      </div>
    ))}
  </>
);


const Login = () => {
  const { login, signup, isLoading } = useAuth();
  const { playAppOpen } = useSound();
  const [mode, setMode] = useState<'demo' | 'experience'>('experience');
  const [showEmail, setShowEmail] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');

  const handleEmailSubmit = async () => {
    const error = isSignUp
      ? await signup(email, password, name)
      : await login(email, password);

    if (error) {
      toast.error(error);
      return;
    }

    playAppOpen();

    if (isSignUp) {
      toast.success('Conta criada com sucesso!');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6"
      style={{ background: 'radial-gradient(ellipse at top, hsl(250 70% 18%) 0%, hsl(240 60% 8%) 50%, hsl(260 50% 5%) 100%)' }}
    >
      <LoginParticles />

      {/* Toggle Demo / Experiência */}
      {/* REMOVED per user request */}

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="mb-4 relative z-10"
      >
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <PigSVG size={mode === 'demo' ? 100 : 140} />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-5xl font-black text-white mb-1 relative z-10"
        style={{ textShadow: '0 0 30px hsla(210, 100%, 70%, 0.6), 0 0 60px hsla(260, 90%, 65%, 0.4)' }}
      >
        Stellar Pig
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/70 text-center mb-6 max-w-xs relative z-10 font-semibold"
      >
        Pequenos investimentos. Um universo de possibilidades.
      </motion.p>

      <AnimatePresence mode="wait">
        {mode === 'demo' ? (
          <motion.div
            key="demo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm space-y-3 relative z-10"
          >
            <div className="space-y-2.5 mb-5">
              {DEMO_BULLETS.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-3 bg-white/[0.06] backdrop-blur-sm rounded-xl px-4 py-3 border border-white/[0.08]"
                >
                  <b.icon size={18} className="text-pink-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white text-sm font-bold leading-tight">{b.title}</p>
                    <p className="text-white/50 text-xs leading-snug mt-0.5">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              className="w-full h-14 text-base font-black rounded-2xl gradient-hot text-white glow-pink border-0 active:scale-95 transition-transform"
              onClick={() => setMode('experience')}
            >
              Entrar na Experiência →
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="experience"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm space-y-3 relative z-10"
          >
            {!showEmail ? (
              <Button
                className="w-full h-14 text-base font-black rounded-2xl text-white/70 hover:text-white hover:bg-white/5 gap-3 border-0 bg-transparent active:scale-95 transition-transform"
                onClick={() => setShowEmail(true)}
              >
                <Mail size={20} />
                Continuar com E-mail
              </Button>
            ) : (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                {isSignUp && (
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="h-14 rounded-2xl bg-white/10 border-white/15 text-white placeholder:text-white/30 font-semibold backdrop-blur-sm"
                  />
                )}
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-14 rounded-2xl bg-white/10 border-white/15 text-white placeholder:text-white/30 font-semibold backdrop-blur-sm"
                />
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha (mín. 6 caracteres)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-14 rounded-2xl bg-white/10 border-white/15 text-white placeholder:text-white/30 font-semibold backdrop-blur-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <Button
                  className="w-full h-14 rounded-2xl gradient-hot text-white font-black glow-pink border-0 active:scale-95 transition-transform"
                  onClick={handleEmailSubmit}
                  disabled={!email || !password || password.length < 6 || isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Criar Conta' : 'Entrar')}
                </Button>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full text-center text-white/50 text-sm font-semibold hover:text-white/70 transition-colors py-1"
                >
                  {isSignUp ? 'Já tenho conta → Entrar' : 'Não tem conta? Criar agora'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center gap-2 mt-8 text-white/50 text-xs relative z-10"
      >
        <Zap size={14} />
        <p className="font-semibold">Powered by Stellar ⚡</p>
      </motion.div>
    </div>
  );
};

export default Login;
