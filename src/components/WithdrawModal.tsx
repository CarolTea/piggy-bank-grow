import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBalance } from '@/contexts/BalanceContext';
import { useSound } from '@/hooks/useSound';
import { mockWithdraw } from '@/services/mockWeb3Services';
import { ArrowUp, Loader2, Check, Zap } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WithdrawModal = ({ open, onOpenChange }: Props) => {
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [step, setStep] = useState<'input' | 'pixkey' | 'processing' | 'success'>('input');
  const { balance, removeBalance } = useBalance();
  const { playClick, playSuccess } = useSound();

  const handleContinue = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0 || value > balance) return;
    playClick();
    setStep('pixkey');
  };

  const handleWithdraw = async () => {
    if (!pixKey.trim()) return;
    const value = parseFloat(amount);
    setStep('processing');
    await mockWithdraw(value);
    removeBalance(value);
    playSuccess();
    setStep('success');
    setTimeout(() => {
      setStep('input');
      setAmount('');
      setPixKey('');
      onOpenChange(false);
    }, 2500);
  };

  const handleClose = (v: boolean) => {
    if (step !== 'processing') {
      onOpenChange(v);
      setStep('input');
      setAmount('');
      setPixKey('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black">
            <ArrowUp className="text-secondary" size={22} /> Sacar via PIX
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-sm text-muted-foreground">Saldo disponível: <span className="font-black text-foreground">R${balance.toFixed(2)}</span></p>
              <Input
                type="number"
                placeholder="0,00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="text-2xl font-black h-14 text-center bg-muted border-border"
              />
              <Button
                className="w-full h-13 text-lg font-black rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 active:scale-95 transition-transform"
                onClick={handleContinue}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
              >
                Continuar
              </Button>
            </motion.div>
          )}

          {step === 'pixkey' && (
            <motion.div key="pixkey" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-muted-foreground">Chave PIX de destino</label>
                <Input
                  type="text"
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                  value={pixKey}
                  onChange={e => setPixKey(e.target.value)}
                  className="mt-1 h-12 bg-muted border-border font-semibold"
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap size={12} className="text-accent" /> Saque de R${amount} processado via Solana
              </p>
              <Button
                className="w-full h-13 text-lg font-black rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 active:scale-95 transition-transform"
                onClick={handleWithdraw}
                disabled={!pixKey.trim()}
              >
                Confirmar Saque
              </Button>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-8">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Loader2 className="text-secondary" size={48} />
              </motion.div>
              <p className="font-black">Processando saque via Solana...</p>
              <p className="text-xs text-muted-foreground">Convertendo e enviando para sua chave PIX</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-16 h-16 rounded-full bg-success flex items-center justify-center glow-green"
              >
                <Check className="text-white" size={32} />
              </motion.div>
              <p className="font-black text-xl">Saque Processado! ⚡</p>
              <p className="text-sm text-muted-foreground">R${amount} via Solana → PIX</p>
              <p className="text-xs text-muted-foreground">Chegará em 1-2 dias úteis</p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
