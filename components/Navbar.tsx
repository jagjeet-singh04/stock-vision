'use client';
import { motion } from 'framer-motion';
import useMarketPulse from '../utils/hooks/useMarketPulse';
import useMarketAudio from '../utils/hooks/useMarketAudio';
import { FaHome } from 'react-icons/fa';
import { Dispatch, SetStateAction } from 'react';

// Define the Section type
type Section = 'quote' | 'ticker' | 'dashboard' | 'news' | null;

interface NavbarProps {
  activeSection: Section;
  setActiveSection: Dispatch<SetStateAction<Section>>;
  onHomeClick: () => void;
}

export default function Navbar({ 
  activeSection, 
  setActiveSection,
  onHomeClick
}: NavbarProps) {
  const { sentiment } = useMarketPulse();
  const { playTickSound } = useMarketAudio();

  const navItems = [
    { key: 'quote', label: 'Intraday Quotes' },
    { key: 'ticker', label: 'Live Ticker' },
    { key: 'dashboard', label: 'OHLC Dashboard' },
    { key: 'news', label: 'Market News' }
  ];

  // Sentiment-based gradient colors
  const sentimentColors = {
    bullish: 'from-emerald-400 to-green-600',
    bearish: 'from-red-400 to-red-600',
    neutral: 'from-cyan-400 to-emerald-400'
  };

  const gradientClass = sentimentColors[sentiment] || 'from-cyan-400 to-emerald-400';

  return (
    <nav className="bg-[#0f172a]/90 px-4 py-3 sticky top-0 z-50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <motion.button
              onClick={() => {
                onHomeClick();
                playTickSound();
              }}
              className={`flex items-center text-xl font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome className="mr-2" />
              StockVision Pro
            </motion.button>
          </div>
          
          <ul className="flex space-x-1 md:space-x-4">
            {navItems.map((item) => (
              <li key={item.key}>
                <motion.button
                  onClick={() => {
                    setActiveSection(item.key as Section);
                    playTickSound();
                  }}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeSection === item.key
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}