import { useCallback, useState, useEffect, createContext, useContext } from 'react';

const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

// Global mute state
let globalMuted = typeof window !== 'undefined' ? localStorage.getItem('smartpig_muted') === 'true' : false;
const muteListeners = new Set<(muted: boolean) => void>();

function setGlobalMuted(muted: boolean) {
  globalMuted = muted;
  if (typeof window !== 'undefined') localStorage.setItem('smartpig_muted', String(muted));
  muteListeners.forEach(fn => fn(muted));
}

function resumeCtx() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.15) {
  if (!audioCtx || globalMuted) return;
  resumeCtx();
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

function playFile(path: string, volume = 0.5) {
  if (globalMuted) return;
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(() => {});
}

export const useSound = () => {
  const [muted, setMuted] = useState(globalMuted);

  useEffect(() => {
    const listener = (m: boolean) => setMuted(m);
    muteListeners.add(listener);
    return () => { muteListeners.delete(listener); };
  }, []);

  const toggleMute = useCallback(() => {
    setGlobalMuted(!globalMuted);
  }, []);

  const playCoin = useCallback(() => {
    playFile('/sounds/som_moeda.mp3', 0.8);
  }, []);

  const playLevelUp = useCallback(() => {
    playFile('/sounds/level_up.wav');
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
    playFile('/sounds/pix_in_completo.mp3');
  }, []);

  const playWithdraw = useCallback(() => {
    playFile('/sounds/pix_out_complete.wav');
  }, []);

  const playError = useCallback(() => {
    playTone(200, 0.2, 'sawtooth', 0.08);
    setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.06), 150);
  }, []);

  const playCelebration = useCallback(() => {
    playFile('/sounds/card_entry.wav');
  }, []);

  const playAppOpen = useCallback(() => {
    playFile('/sounds/abriu_o_app.wav');
  }, []);

  return { playCoin, playLevelUp, playSuccess, playClick, playSwipe, playNav, playDeposit, playWithdraw, playError, playCelebration, playAppOpen, muted, toggleMute };
};
