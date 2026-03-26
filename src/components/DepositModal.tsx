import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useBalance } from '@/contexts/BalanceContext';
import { useSound } from '@/hooks/useSound';
import { mockDeposit } from '@/services/mockWeb3Services';
import Confetti from './Confetti';
import { ArrowDown, Zap, Check, Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_VALUES = [10, 50, 100, 500];

const DepositModal = ({ open, onOpenChange }: Props) => {
  const [amount, setAmount] = useState('');
  const [autoPix, setAutoPix] = useState(false);
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [showConfetti, setShowConfetti] = useState(false);
  const { addBalance } = useBalance();
  const { playCoin, playSuccess } = useSound();

  const handleDeposit = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    setStep('processing');
    await mockDeposit(value);
    addBalance(value);
    setStep('success');
    setShowConfetti(true);
    playSuccess();
    setTimeout(() => playCoin(), 300);
    setTimeout(() => {
      setShowConfetti(false);
      setStep('input');
      setAmount('');
      onOpenChange(false);
    }, 3000);
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
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
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
                      onClick={() => setAmount(String(v))}
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
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-accent text-center font-bold"
                  >
                    🔥 R${amount || '0'} será depositado automaticamente todo dia 5
                  </motion.p>
                )}

                <Button
                  className="w-full h-13 text-lg font-black gradient-hot text-white rounded-xl glow-pink border-0 active:scale-95 transition-transform"
                  onClick={handleDeposit}
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  Confirmar Depósito
                </Button>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="text-primary" size={48} />
                </motion.div>
                <p className="font-black text-lg">Processando...</p>
                <p className="text-sm text-muted-foreground">Confirmando na rede em menos de 1s</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 rounded-full bg-success flex items-center justify-center glow-green"
                >
                  <Check className="text-white" size={32} />
                </motion.div>
                <p className="font-black text-xl">Depósito Confirmado! 🎉</p>
                <p className="text-sm text-muted-foreground">R${amount} adicionados ao seu porquinho</p>
                <motion.div
                  className="text-5xl"
                  animate={{ y: [0, -20, 0], scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.8, repeat: 2 }}
                >
                  🐷
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
