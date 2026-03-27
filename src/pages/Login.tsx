import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSound } from '@/hooks/useSound';
import { PigSVG } from '@/components/EvolutionaryPig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Zap } from 'lucide-react';

const LoginParticles = () => (
  <>
    {Array.from({ length: 18 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 6 + Math.random() * 20,
          height: 6 + Math.random() * 20,
          background: `hsla(${300 + Math.random() * 80}, 80%, 60%, ${0.06 + Math.random() * 0.12})`,
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
  </>
);

const Login = () => {
  const { login, isLoading } = useAuth();
  const { playAppOpen } = useSound();
  const navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (method: 'google' | 'apple' | 'email') => {
    await login(method, method === 'email' ? email : undefined);
    playAppOpen();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(145deg, hsl(280 60% 12%), hsl(320 70% 15%), hsl(260 50% 10%))' }}
    >
      <LoginParticles />

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
          <PigSVG size={140} />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-5xl font-black text-white mb-1 relative z-10"
        style={{ textShadow: '0 0 40px hsla(320, 90%, 58%, 0.4)' }}
      >
        Smart Pig
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/70 text-center mb-10 max-w-xs relative z-10 font-semibold"
      >
        Sua poupança inteligente que rende mais. Simples, segura e divertida.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-sm space-y-3 relative z-10"
      >
        <Button
          className="w-full h-14 text-base font-black rounded-2xl bg-white text-background hover:bg-white/90 gap-3 active:scale-95 transition-transform"
          onClick={() => handleLogin('google')}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          )}
          Entrar com Google
        </Button>

        <Button
          className="w-full h-14 text-base font-black rounded-2xl bg-white/10 text-white hover:bg-white/15 gap-3 border border-white/10 active:scale-95 transition-transform backdrop-blur-sm"
          onClick={() => handleLogin('apple')}
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          Entrar com Apple
        </Button>

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
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-14 rounded-2xl bg-white/10 border-white/15 text-white placeholder:text-white/30 font-semibold backdrop-blur-sm"
            />
            <Button
              className="w-full h-14 rounded-2xl gradient-hot text-white font-black glow-pink border-0 active:scale-95 transition-transform"
              onClick={() => handleLogin('email')}
              disabled={!email || isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}
            </Button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center gap-2 mt-8 text-white/50 text-xs relative z-10"
      >
        <Zap size={14} />
        <p className="font-semibold">Protegido pela rede Solana — rápida, segura e sem taxas</p>
      </motion.div>
    </div>
  );
};

export default Login;
