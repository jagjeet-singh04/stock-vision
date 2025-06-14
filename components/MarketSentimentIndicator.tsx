import { motion } from 'framer-motion';
import useMarketPulse  from '../utils/hooks/useMarketPulse';

export default function MarketSentimentIndicator() {
  const { sentiment } = useMarketPulse();
  
  const sentimentColors = {
    bullish: 'bg-emerald-500/20 border-emerald-400 text-emerald-400',
    bearish: 'bg-red-500/20 border-red-400 text-red-400',
    neutral: 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
  };

  return (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      <motion.div
        className={`px-4 py-2 rounded-full backdrop-blur-md border text-xs font-medium ${sentimentColors[sentiment]}`}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {sentiment === 'bullish' ? '🐂 Bullish' : sentiment === 'bearish' ? '🐻 Bearish' : '📊 Neutral'}
      </motion.div>
    </motion.div>
  );
}