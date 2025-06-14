// app/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';
// app/page.tsx
// ... existing imports ...
import FeatureCard from '@/components/FeatureCard'; // Add this
import Footer from '@/components/Footer'; // Add this
type Section = 'quote' | 'ticker' | 'dashboard' | 'news' | null;


import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import LiveTicker from '@/components/LiveTicker';
import QuoteCard from '@/components/QuoteCard';
import StockDashboard from '@/components/StockDashboard';
import LoadingScreen from '@/components/LoadingScreen';
import BackgroundEffects from '@/components/BackgroundEffects';
import Navbar from '@/components/Navbar';
import MarketSentimentIndicator from '@/components/MarketSentimentIndicator';
import AudioToggleButton from '@/components/AudioToggleButton';
import SectionCard from '@/components/SectionCard';
import SectionSelector from '@/components/SectionSelector';
import QuickSelect from '@/components/QuickSelect';
import MarketNews from '@/components/MarketNews';
import useMarketPulse from '@/utils/hooks/useMarketPulse';
import usePriceAnimation from '@/utils/hooks/usePriceAnimation';
import useMarketAudio from '@/utils/hooks/useMarketAudio';
import Banner from '@/components/Banner';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateX: -15, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 100 }
  },
  hover: {
    scale: 1.05,
    rotateX: 5,
    transition: { type: 'spring', damping: 15, stiffness: 200 }
  }
};

const priceFlashVariants = {
  up: {
    backgroundColor: ['rgba(34, 197, 94, 0)', 'rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0)'],
    transition: { duration: 0.6 }
  },
  down: {
    backgroundColor: ['rgba(239, 68, 68, 0)', 'rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0)'],
    transition: { duration: 0.6 }
  },
  neutral: {}
};

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [activeSection, setActiveSection] = useState<Section>(null);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true); // Add this state
  const containerRef = useRef<HTMLDivElement>(null);

  const { sentiment, volatility } = useMarketPulse();
  const { priceChange, triggerPriceChange } = usePriceAnimation();
  const { playTickSound } = useMarketAudio();

  const sentimentColors = {
    bullish: 'from-emerald-400 to-green-600',
    bearish: 'from-red-400 to-red-600',
    neutral: 'from-cyan-400 to-emerald-400'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Don't set activeSection to 'news' anymore
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol);
    playTickSound();
    triggerPriceChange(Math.random() > 0.5 ? 'up' : 'down');

    if (activeSection === 'quote' || activeSection === 'dashboard') {
      setActiveSection(null);
      setTimeout(() => setActiveSection(activeSection), 50);
    }
  };

  // Add this function to handle banner selection
  const handleBannerSelect = (section: string) => {
    setShowBanner(false);
    setActiveSection(section as 'quote' | 'ticker' | 'dashboard' | 'news');
  };

  const handleHomeClick = () => {
  setActiveSection(null);
  setShowBanner(true);
};

useEffect(() => {
    if (activeSection) {
      setShowBanner(false);
    }
  }, [activeSection]);

  const handleFeatureSelect = (section: string) => {
    setShowBanner(false);
    setActiveSection(section as 'quote' | 'ticker' | 'dashboard' | 'news');
  };
  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-hidden relative" ref={containerRef}>
      <BackgroundEffects 
        sentiment={sentiment}
      />

      <MarketSentimentIndicator />
      <AudioToggleButton />

      <AnimatePresence>
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <Navbar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            onHomeClick={handleHomeClick} 
          />

            <main className="p-4 relative">
              <div className="max-w-6xl mx-auto">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, type: 'spring', damping: 15 }}
                  className={`text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r ${sentimentColors[sentiment]} drop-shadow-lg`}
                >
                  Stock Vision - Market Analytics
                </motion.h1>

                {/* Banner Section - Only show when no active section is selected */}
                <AnimatePresence>
                  {showBanner && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Banner onSelect={handleBannerSelect} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* NEW: Why Choose Stock Vision Section */}
          {!activeSection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <div className="text-center mb-12">
                <motion.h2 
                  className="text-4xl font-bold mb-4"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                >
                  Why Choose <span className="text-cyan-400">Stock Vision</span>
                </motion.h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Advanced market analytics platform providing real-time data, 
                  technical indicators, and financial insights for informed trading decisions.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard 
                  title="Intraday Quotes" 
                  description="Real-time stock quotes with detailed analytics and historical data visualization."
                  color="bg-gradient-to-br from-emerald-600/80 to-teal-500/80"
                  onSelect={() => handleFeatureSelect('quote')}
                />
                <FeatureCard 
                  title="Live Ticker" 
                  description="Live updating ticker of the most active stocks with price movement indicators."
                  color="bg-gradient-to-br from-amber-600/80 to-orange-500/80"
                  onSelect={() => handleFeatureSelect('ticker')}
                />
                <FeatureCard 
                  title="OHLC Dashboard" 
                  description="Comprehensive Open, High, Low, Close data analysis with technical indicators."
                  color="bg-gradient-to-br from-violet-700/80 to-purple-500/80"
                  onSelect={() => handleFeatureSelect('dashboard')}
                />
                <FeatureCard 
                  title="Market News" 
                  description="Latest financial news and market updates from trusted global sources."
                  color="bg-gradient-to-br from-slate-700/80 to-slate-600/80"
                  onSelect={() => handleFeatureSelect('news')}
                />
              </div>
            </motion.div>
          )}

                <AnimatePresence mode="wait">
                  {activeSection === 'quote' && (
                    <SectionCard variants={cardVariants}>
                      <motion.div
                        variants={priceFlashVariants}
                        animate={priceChange}
                        className="rounded-2xl space-y-6"
                      >
                        <QuoteCard symbol={selectedSymbol} />
                        <QuickSelect 
                          selectedSymbol={selectedSymbol}
                          onSelect={handleSymbolChange}
                        />
                      </motion.div>
                    </SectionCard>
                  )}

                  {activeSection === 'ticker' && (
                    <SectionCard variants={cardVariants}>
                      <LiveTicker />
                    </SectionCard>
                  )}

                  {activeSection === 'dashboard' && (
                    <SectionCard variants={cardVariants}>
                      <StockDashboard 
                        key={selectedSymbol}
                        initialTicker={selectedSymbol} 
                        onSymbolChange={setSelectedSymbol}
                      />
                      <QuickSelect 
                        selectedSymbol={selectedSymbol}
                        onSelect={handleSymbolChange}
                      />
                    </SectionCard>
                  )}

                  {activeSection === 'news' && (
                    <SectionCard variants={cardVariants}>
                      <MarketNews />
                    </SectionCard>
                  )}

                  {!activeSection && !showBanner && (
                    <SectionSelector setActiveSection={setActiveSection} />
                  )}
                </AnimatePresence>
              </div>
            </main>
          </>
        )}
      </AnimatePresence>

        {/* NEW: Footer */}
      <Footer />

    </div>
  );
}