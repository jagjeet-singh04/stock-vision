'use client';
import { motion } from 'framer-motion';
import useMarketPulse from '../utils/hooks/useMarketPulse';
import useMarketAudio from '../utils/hooks/useMarketAudio';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { Dispatch, SetStateAction, useState } from 'react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavItemClick = (key: string) => {
    setActiveSection(key as Section);
    playTickSound();
    setMobileMenuOpen(false);
  };

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
              <span className="hidden sm:inline">StockVision Pro</span>
              <span className="sm:hidden">SVP</span>
            </motion.button>
          </div>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <li key={item.key}>
                <motion.button
                  onClick={() => handleNavItemClick(item.key)}
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-2"
          >
            <ul className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <motion.button
                    onClick={() => handleNavItemClick(item.key)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === item.key
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </nav>
  );
}