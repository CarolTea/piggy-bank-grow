import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound';
import { mockFlashcards, Flashcard } from '@/services/mockWeb3Services';
import Confetti from './Confetti';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard?: Flashcard;
}

const getRandomFlashcard = (): Flashcard => {
  return mockFlashcards[Math.floor(Math.random() * mockFlashcards.length)];
};

const FlashcardPopup = ({ open, onOpenChange, flashcard }: Props) => {
  const { playCelebration } = useSound();
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasPlayedEntry, setHasPlayedEntry] = useState(false);
  // Lock card on open to prevent re-rolls during re-renders
  const lockedCard = useRef<Flashcard | null>(null);

  if (open && !lockedCard.current) {
    lockedCard.current = flashcard || getRandomFlashcard();
  }

  const card = lockedCard.current || getRandomFlashcard();

  // Play sound on flashcard entry
  useEffect(() => {
    if (open && !hasPlayedEntry) {
      playCelebration();
      setHasPlayedEntry(true);
    }
    if (!open) {
      setHasPlayedEntry(false);
      lockedCard.current = null;
    }
  }, [open, hasPlayedEntry, playCelebration]);

  const handleConfirm = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <>
      <Confetti active={showConfetti} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xs mx-auto rounded-3xl bg-card border-border p-0 overflow-hidden">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Colored header */}
                <div className={`bg-gradient-to-br ${card.color} p-6 pb-8 text-center`}>
                  <motion.span
                    className="text-5xl block mb-2"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {card.emoji}
                  </motion.span>
                  <h3 className="text-white font-black text-lg">{card.title}</h3>
                </div>

                {/* Content */}
                <div className="p-5 pb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {card.content}
                  </p>
                  <Button
                    className="w-full h-12 rounded-2xl font-black text-base gradient-hot text-white glow-pink border-0 active:scale-95 transition-transform"
                    onClick={handleConfirm}
                  >
                    Entendi! 🎉
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FlashcardPopup;
