import { useCallback, useRef } from 'react';

const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function resumeCtx() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.15) {
  if (!audioCtx) return;
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

let ambientNodes: { oscs: OscillatorNode[]; gains: GainNode[] } | null = null;

function startAmbientLoop() {
  if (!audioCtx || ambientNodes) return;
  resumeCtx();
  const freqs = [261.63, 329.63, 392.00]; // C major chord
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];
  freqs.forEach(freq => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.value = 0.012;
    osc.connect(g).connect(audioCtx.destination);
    osc.start();
    oscs.push(osc);
    gains.push(g);
  });
  ambientNodes = { oscs, gains };
}

function stopAmbientLoop() {
  if (!ambientNodes) return;
  ambientNodes.oscs.forEach(osc => { try { osc.stop(); } catch {} });
  ambientNodes = null;
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
    // Metallic cha-ching
    resumeCtx();
    playTone(1200, 0.06, 'square', 0.1);
    setTimeout(() => playTone(1600, 0.06, 'square', 0.1), 70);
    setTimeout(() => playTone(2000, 0.08, 'square', 0.12), 140);
    setTimeout(() => playTone(2400, 0.1, 'sine', 0.14), 210);
    setTimeout(() => playTone(3200, 0.15, 'sine', 0.1), 300);
  }, []);

  const playError = useCallback(() => {
    playTone(200, 0.2, 'sawtooth', 0.08);
    setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.06), 150);
  }, []);

  const playAmbient = useCallback(() => {
    startAmbientLoop();
  }, []);

  const stopAmbient = useCallback(() => {
    stopAmbientLoop();
  }, []);

  return { playCoin, playLevelUp, playSuccess, playClick, playSwipe, playNav, playDeposit, playError, playAmbient, stopAmbient };
};
