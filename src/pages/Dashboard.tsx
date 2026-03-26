import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '@/contexts/BalanceContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSound } from '@/hooks/useSound';
import EvolutionaryPig from '@/components/EvolutionaryPig';
import BottomNav from '@/components/BottomNav';
import DepositModal from '@/components/DepositModal';
import WithdrawModal from '@/components/WithdrawModal';
import { ArrowDown, ArrowUp, GraduationCap, TrendingUp, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { balance, dailyYield } = useBalance();
  const { user, logout } = useAuth();
  const { playClick } = useSound();
  const navigate = useNavigate();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-primary px-5 pt-6 pb-10 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-white/70 text-sm">Olá,</p>
              <p className="text-white font-extrabold text-lg">{user?.name || 'Usuário'} 👋</p>
            </div>
            <button onClick={handleLogout} className="text-white/60 hover:text-white">
              <LogOut size={20} />
            </button>
          </div>

          <EvolutionaryPig />

          <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/70 text-sm">Saldo Total</p>
            <motion.p
              className="text-4xl font-black text-white"
              key={Math.floor(balance)}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
            >
              R$ {balance.toFixed(2)}
            </motion.p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <TrendingUp size={14} className="text-emerald-300" />
              <p className="text-emerald-300 text-sm font-bold">
                +5.87% ao ano • +R${dailyYield.toFixed(4)}/dia
              </p>
            </div>
            <p className="text-white/50 text-xs mt-0.5">Rendendo automaticamente todos os dias</p>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto px-5 -mt-5">
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            className="flex-1 h-14 rounded-2xl font-extrabold text-base gap-2 gradient-primary text-white shadow-lg"
            onClick={() => { playClick(); setDepositOpen(true); }}
          >
            <ArrowDown size={20} /> Depositar
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-14 rounded-2xl font-extrabold text-base gap-2"
            onClick={() => { playClick(); setWithdrawOpen(true); }}
          >
            <ArrowUp size={20} /> Sacar
          </Button>
          <Button
            variant="secondary"
            className="h-14 rounded-2xl font-extrabold px-4"
            onClick={() => { playClick(); navigate('/education'); }}
          >
            <GraduationCap size={22} />
          </Button>
        </motion.div>

        {/* Info Card */}
        <motion.div
          className="mt-6 p-4 rounded-2xl bg-card border shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-extrabold text-sm mb-3">📊 Como seu dinheiro está rendendo</h3>
          <div className="space-y-2">
            {[
              { label: 'Rendimento hoje', value: `+R$ ${dailyYield.toFixed(4)}`, color: 'text-emerald-500' },
              { label: 'Rendimento este mês', value: `+R$ ${(dailyYield * 30).toFixed(2)}`, color: 'text-emerald-500' },
              { label: 'APY atual', value: '5.87%', color: 'text-primary' },
              { label: 'Protocolo', value: 'Cofre Seguro v2', color: 'text-muted-foreground' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-sm">
            💡 <span className="font-bold">Dica:</span> Ative o Pix Automático e poupe sem esforço todo mês!
          </p>
        </motion.div>
      </div>

      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
      <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
