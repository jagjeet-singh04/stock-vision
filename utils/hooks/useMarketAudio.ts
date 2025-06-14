import { useState, useCallback } from 'react';

export default function useMarketAudio() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const playTickSound = useCallback(() => {
    if (audioEnabled && !document.hidden) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }, [audioEnabled]);
  
  return { audioEnabled, setAudioEnabled, playTickSound };
}