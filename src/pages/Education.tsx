import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FlashcardSwiper from '@/components/FlashcardSwiper';
import BottomNav from '@/components/BottomNav';

const Education = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="gradient-primary px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/dashboard')} className="text-white/80 hover:text-white">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-extrabold text-white">Educação Financeira</h1>
          </div>
          <p className="text-white/70 text-sm">
            Aprenda como seu dinheiro rende de forma simples e divertida 🎓
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FlashcardSwiper />
        </motion.div>

        <motion.div
          className="mt-8 p-4 rounded-2xl bg-card border shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-extrabold mb-2">🏆 Seu progresso</h3>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: '33%' }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">2 de 6 lições concluídas</p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Education;
