

# Fix: Ambient Sound, Pig Blur, Flashcard Pop-ups

## 3 Problems

1. **Ambient sound is an eternal buzz** — `startAmbientLoop()` creates 3 continuous oscillators playing a C major chord forever. Needs to be removed entirely or replaced with something non-annoying.
2. **Pig is blurry** — the `backdrop-blur-sm` on the circular backdrop and `blur-2xl` on the glow layer are bleeding into the SVG itself, making the pig look out of focus.
3. **Flashcards should pop up as modals** — some flashcards should appear as surprise pop-ups with a celebration sound when the user clicks "OK".

## Changes

### 1. Kill the Ambient Buzz (`useSound.ts`, `Dashboard.tsx`)
- Remove `startAmbientLoop`, `stopAmbientLoop`, `ambientNodes` entirely from `useSound.ts`
- Remove `playAmbient`, `stopAmbient` from the hook return
- Add a new `playCelebration` sound: rapid ascending tones + sparkle effect (party horn feel)
- Remove ambient logic from `Dashboard.tsx` (the `useEffect` with `ambientStarted`, the mute toggle controlling ambient)

### 2. Fix Pig Blur (`EvolutionaryPig.tsx`)
- Remove `backdrop-blur-sm` from the circular backdrop div
- Change the glow div from `blur-2xl` to a simple `opacity` animation without blur, or use a very subtle `blur-md` on a separate layer that doesn't overlap the SVG
- Ensure the SVG itself has `position: relative; z-index: 10` so it renders crisp above any glow effects

### 3. Flashcard Pop-up System (`FlashcardSwiper.tsx` or new component)
- Create a `FlashcardPopup` component: a modal/dialog that shows a random flashcard with the card's emoji, title, and content
- Shows up as a pop-up overlay with scale-in animation
- Has a single "Entendi! 🎉" button
- When user clicks the button: play `playCelebration` sound (party/confetti feel) + trigger mini confetti
- Integrate into `Dashboard.tsx`: trigger a random flashcard pop-up after a deposit succeeds, or on first visit, or after 30 seconds idle
- The pop-up should feel like a "reward" moment

### Files to Modify
1. `src/hooks/useSound.ts` — remove ambient, add `playCelebration`
2. `src/components/EvolutionaryPig.tsx` — remove blur classes from backdrop/glow
3. `src/components/FlashcardPopup.tsx` — **new file**, modal flashcard with celebration sound
4. `src/pages/Dashboard.tsx` — remove ambient logic, add pop-up trigger
5. `src/components/DepositModal.tsx` — trigger flashcard pop-up after successful deposit

