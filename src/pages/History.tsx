import { motion } from 'framer-motion';
import { mockTransactionHistory, Transaction } from '@/services/mockWeb3Services';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Zap, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const iconMap: Record<Transaction['type'], { icon: typeof ArrowDown; color: string; label: string }> = {
  deposit: { icon: ArrowDown, color: 'text-[hsl(var(--success))]', label: 'Depósito' },
  withdraw: { icon: ArrowUp, color: 'text-destructive', label: 'Saque' },
  yield: { icon: Zap, color: 'text-accent', label: 'Rendimento' },
};

const History = () => {
  const transactions = mockTransactionHistory();

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="relative overflow-hidden px-6 pt-12 pb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-primary" />
            <h1 className="text-2xl font-black text-foreground">Histórico</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Suas transações recentes</p>
        </motion.div>
      </div>

      <div className="px-4 space-y-3">
        {transactions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-muted-foreground font-bold">Nenhuma transação ainda</p>
            <p className="text-sm text-muted-foreground mt-1">Faça seu primeiro depósito!</p>
          </motion.div>
        ) : (
          transactions.map((tx, i) => {
            const { icon: Icon, color, label } = iconMap[tx.type];
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-card border-border">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(tx.date, "dd MMM yyyy, HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-sm ${tx.type === 'withdraw' ? 'text-destructive' : color}`}>
                        {tx.type === 'withdraw' ? '-' : '+'}R${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground capitalize">{tx.status === 'completed' ? '✓ Concluído' : '⏳ Pendente'}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default History;
