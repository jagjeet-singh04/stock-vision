import { motion } from 'framer-motion';
import useMarketAudio  from '@/utils/hooks/useMarketAudio';

export default function AudioToggleButton() {
  const { audioEnabled, setAudioEnabled } = useMarketAudio();
  
  return (
    <motion.button
      className="fixed bottom-4 right-4 z-50 p-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
      onClick={() => setAudioEnabled(!audioEnabled)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <span className="text-sm">{audioEnabled ? '🔊' : '🔇'}</span>
    </motion.button>
  );
}