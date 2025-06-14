// components/QuickSelect.tsx
'use client';

import { motion } from 'framer-motion';
import useMarketAudio  from '@/utils/hooks/useMarketAudio';
import  usePriceAnimation  from '@/utils/hooks/usePriceAnimation';

export default function QuickSelect({
  selectedSymbol,
  onSelect // Changed from setSelectedSymbol to onSelect
}: {
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
}) {
  const { playTickSound } = useMarketAudio();
  const { triggerPriceChange } = usePriceAnimation();

  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-6 text-center"
    >
      <div className="flex justify-center items-center gap-4 flex-wrap">
        <motion.span 
          className="text-gray-300 text-sm font-medium"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Quick Select:
        </motion.span>
        {symbols.map((symbol, index) => (
          <motion.button
            key={symbol}
            onClick={() => {
              onSelect(symbol); // Now using onSelect instead of setSelectedSymbol
              playTickSound();
              triggerPriceChange(Math.random() > 0.5 ? 'up' : 'down');
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md ${
              selectedSymbol === symbol
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
            whileHover={{ 
              scale: 1.1, 
              y: -2,
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
          >
            {symbol}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}