import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useBalance } from '@/contexts/BalanceContext';
import { useSound } from '@/hooks/useSound';
import { mockDeposit } from '@/services/mockWeb3Services';
import { PigSVG } from '@/components/EvolutionaryPig';
import Confetti from './Confetti';
import { ArrowDown, Zap, Check, Loader2, Copy, QrCode } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const QUICK_VALUES = [10, 50, 100, 500];
const PIX_KEY = 'smartpig@solana.pay';

// Simple QR-like SVG pattern (visual only)
const MockQRCode = () => (
  <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
    <rect width="140" height="140" fill="white" rx="8" />
    {/* Corner squares */}
    {[[10, 10], [100, 10], [10, 100]].map(([x, y], i) => (
      <g key={i}>
        <rect x={x} y={y} width="30" height="30" fill="#1a1a2e" rx="2" />
        <rect x={x + 5} y={y + 5} width="20" height="20" fill="white" rx="1" />
        <rect x={x + 9} y={y + 9} width="12" height="12" fill="#1a1a2e" rx="1" />
      </g>
    ))}
    {/* Random data pattern */}
    {Array.from({ length: 40 }).map((_, i) => {
      const x = 45 + (i % 8) * 10;
      const y = 45 + Math.floor(i / 8) * 10;
      return (i * 7 + 3) % 3 !== 0 ? (
        <rect key={i} x={x} y={y} width="8" height="8" fill="#1a1a2e" rx="1" />
      ) : null;
    })}
  </svg>
);

const DepositModal = ({ open, onOpenChange, onSuccess }: Props) => {
  const [amount, setAmount] = useState('');
  const [autoPix, setAutoPix] = useState(false);
  const [step, setStep] = useState<'input' | 'pix' | 'processing' | 'success'>('input');
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixTimer, setPixTimer] = useState(10);
  const { addBalance } = useBalance();
  const { playDeposit, playClick, playSuccess } = useSound();

  // PIX auto-detect timer
  useEffect(() => {
    if (step !== 'pix') return;
    setPixTimer(10);
    const interval = setInterval(() => {
      setPixTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handlePixDetected();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    // Auto-confirm after 3s
    const autoConfirm = setTimeout(() => {
      clearInterval(interval);
      handlePixDetected();
    }, 3000);
    return () => { clearInterval(interval); clearTimeout(autoConfirm); };
  }, [step]);

  const handlePixDetected = async () => {
    const value = parseFloat(amount);
    if (!value) return;
    setStep('processing');
    await mockDeposit(value);
    addBalance(value);
    setStep('success');
    setShowConfetti(true);
    playDeposit();
    // Let the user enjoy the PIX success animation fully
    setTimeout(() => {
      setShowConfetti(false);
    }, 2500);
    // Close modal and notify dashboard AFTER the full experience
    setTimeout(() => {
      setStep('input');
      setAmount('');
      onOpenChange(false);
      // Notify dashboard that deposit flow is truly complete
      setTimeout(() => onSuccess?.(), 500);
    }, 3500);
  };

  const handleConfirmAmount = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    playClick();
    setStep('pix');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(PIX_KEY).catch(() => {});
    setCopied(true);
    playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = (v: boolean) => {
    if (step !== 'processing') {
      onOpenChange(v);
      setStep('input');
      setAmount('');
    }
  };

  return (
    <>
      <Confetti active={showConfetti} />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black">
              <ArrowDown className="text-primary" size={22} /> Depositar via PIX
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-muted-foreground">Valor em R$</label>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="mt-1 text-2xl font-black h-14 text-center bg-muted border-border"
                  />
                </div>

                <div className="flex gap-2">
                  {QUICK_VALUES.map(v => (
                    <Button
                      key={v}
                      variant="outline"
                      size="sm"
                      className={`flex-1 font-black border-border active:scale-90 transition-transform ${
                        amount === String(v) ? 'gradient-hot text-white border-0' : ''
                      }`}
                      onClick={() => { playClick(); setAmount(String(v)); }}
                    >
                      R${v}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-muted border border-border">
                  <div className="flex items-center gap-2">
                    <Zap className="text-accent" size={18} />
                    <div>
                      <p className="text-sm font-black">Pix Automático</p>
                      <p className="text-xs text-muted-foreground">Poupe todo mês sem esforço</p>
                    </div>
                  </div>
                  <Switch checked={autoPix} onCheckedChange={setAutoPix} />
                </div>

                {autoPix && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-accent text-center font-bold">
                    🔥 R${amount || '0'} será depositado automaticamente todo dia 5
                  </motion.p>
                )}

                <Button
                  className="w-full h-13 text-lg font-black gradient-hot text-white rounded-xl glow-pink border-0 active:scale-95 transition-transform"
                  onClick={handleConfirmAmount}
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  Gerar QR Code PIX
                </Button>
              </motion.div>
            )}

            {step === 'pix' && (
              <motion.div key="pix" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-2">
                <p className="text-sm text-muted-foreground">Escaneie ou copie a chave PIX</p>
                <div className="p-3 rounded-xl bg-white">
                  <MockQRCode />
                </div>
                <div className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-muted border border-border">
                  <QrCode size={16} className="text-primary shrink-0" />
                  <p className="text-xs font-bold text-foreground truncate flex-1">{PIX_KEY}</p>
                  <Button size="sm" variant="ghost" className="shrink-0 h-8 px-2" onClick={handleCopyKey}>
                    {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </Button>
                </div>
                <div className="text-center">
                  <motion.div
                    className="flex items-center gap-2 text-accent"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Loader2 size={14} className="animate-spin" />
                    <p className="text-xs font-black">Aguardando pagamento... ({pixTimer}s)</p>
                  </motion.div>
                  <p className="text-[10px] text-muted-foreground mt-1">R$ {amount} via Solana</p>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-8">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 className="text-primary" size={48} />
                </motion.div>
                <p className="font-black text-lg">Confirmando na Solana...</p>
                <p className="text-sm text-muted-foreground">Transação em menos de 1s ⚡</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 rounded-full bg-success flex items-center justify-center glow-green"
                >
                  <Check className="text-white" size={32} />
                </motion.div>
                <p className="font-black text-xl">Confirmado na Solana ⚡</p>
                <p className="text-sm text-muted-foreground">R${amount} adicionados ao seu porquinho</p>
                <motion.div
                  animate={{ y: [0, -20, 0], scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.8, repeat: 2 }}
                >
                  <PigSVG size={80} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepositModal;
