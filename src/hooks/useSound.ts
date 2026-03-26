import { useCallback } from 'react';

const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.15) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(g).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export const useSound = () => {
  const playCoin = useCallback(() => {
    playTone(880, 0.1, 'square', 0.1);
    setTimeout(() => playTone(1175, 0.15, 'square', 0.1), 100);
  }, []);

  const playLevelUp = useCallback(() => {
    playTone(523, 0.12, 'square', 0.1);
    setTimeout(() => playTone(659, 0.12, 'square', 0.1), 120);
    setTimeout(() => playTone(784, 0.12, 'square', 0.1), 240);
    setTimeout(() => playTone(1047, 0.2, 'square', 0.1), 360);
  }, []);

  const playSuccess = useCallback(() => {
    playTone(660, 0.15, 'sine', 0.12);
    setTimeout(() => playTone(880, 0.2, 'sine', 0.12), 150);
  }, []);

  const playClick = useCallback(() => {
    playTone(600, 0.05, 'sine', 0.08);
  }, []);

  const playSwipe = useCallback(() => {
    playTone(400, 0.08, 'sine', 0.06);
    setTimeout(() => playTone(500, 0.06, 'sine', 0.04), 60);
  }, []);

  const playNav = useCallback(() => {
    playTone(700, 0.04, 'sine', 0.06);
  }, []);

  const playDeposit = useCallback(() => {
    // Cha-ching sound
    playTone(1200, 0.08, 'square', 0.08);
    setTimeout(() => playTone(1600, 0.08, 'square', 0.08), 80);
    setTimeout(() => playTone(2000, 0.12, 'square', 0.1), 160);
    setTimeout(() => playTone(2400, 0.2, 'sine', 0.12), 260);
  }, []);

  const playError = useCallback(() => {
    playTone(200, 0.2, 'sawtooth', 0.08);
    setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.06), 150);
  }, []);

  return { playCoin, playLevelUp, playSuccess, playClick, playSwipe, playNav, playDeposit, playError };
};
