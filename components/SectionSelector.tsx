import { motion } from 'framer-motion';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */


export default function SectionSelector({
  setActiveSection,
}: {
  setActiveSection: (section: 'quote' | 'ticker' | 'dashboard' | 'news') => void;
}) {
  const buttons = [
    { label: '📊 Intraday Quotes', value: 'quote' },
    { label: '📈 Live Ticker', value: 'ticker' },
    { label: '📋 OHLC Dashboard', value: 'dashboard' },
    { label: '📰 Market News', value: 'news' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', damping: 15 }}
      className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-center mt-8"
    >
      {buttons.map((btn) => (
        <motion.button
          key={btn.value}
          onClick={() => setActiveSection(btn.value as any)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/10 text-white px-6 py-4 rounded-xl border border-white/20 backdrop-blur-md shadow-lg hover:bg-white/20 transition duration-300 font-semibold tracking-wide"
        >
          {btn.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
