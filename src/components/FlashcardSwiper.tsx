import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { mockFlashcards, Flashcard } from '@/services/mockWeb3Services';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FlashcardSwiper = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState(0);

  const card = mockFlashcards[currentIndex];
  const total = mockFlashcards.length;

  const handleSwipe = (direction: number) => {
    setExitX(direction * 300);
    setTimeout(() => {
      setCurrentIndex(i => (i + (direction > 0 ? 1 : total - 1 + 1)) % total);
      setExitX(0);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-sm h-[280px]">
        <SwipeCard
          key={currentIndex}
          card={card}
          onSwipe={handleSwipe}
          exitX={exitX}
        />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => handleSwipe(-1)} className="p-2 rounded-full bg-muted hover:bg-muted/80">
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-1.5">
          {mockFlashcards.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`} />
          ))}
        </div>
        <button onClick={() => handleSwipe(1)} className="p-2 rounded-full bg-muted hover:bg-muted/80">
          <ChevronRight size={20} />
        </button>
      </div>

      <p className="text-sm text-muted-foreground">{currentIndex + 1} de {total} cards</p>
    </div>
  );
};

const SwipeCard = ({ card, onSwipe, exitX }: { card: Flashcard; onSwipe: (d: number) => void; exitX: number }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80) {
      onSwipe(info.offset.x > 0 ? 1 : -1);
    }
  };

  return (
    <motion.div
      className={`absolute inset-0 rounded-2xl p-6 flex flex-col justify-center items-center text-center text-white bg-gradient-to-br ${card.color} shadow-xl cursor-grab active:cursor-grabbing`}
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x: exitX }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <span className="text-5xl mb-4">{card.emoji}</span>
      <h3 className="text-xl font-extrabold mb-3">{card.title}</h3>
      <p className="text-sm leading-relaxed opacity-90">{card.content}</p>
    </motion.div>
  );
};

export default FlashcardSwiper;
