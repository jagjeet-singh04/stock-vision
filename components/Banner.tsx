'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


// components/Banner.tsx
type Section = 'quote' | 'ticker' | 'dashboard' | 'news';

interface BannerProps {
  onSelect: (section: Section) => void;
}

const Banner = ({ onSelect }: BannerProps) => {
  // ... existing Banner implementation ...
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const banners = [
    { 
      id: 1, 
      title: "Market Overview", 
      // Professional blue gradient - conveys stability and overview
      color: "bg-gradient-to-r from-blue-700 to-cyan-600"
    },
    { 
      id: 2, 
      title: "Intraday Quote", 
      // Green gradient - represents growth and real-time quotes
      color: "bg-gradient-to-r from-emerald-600 to-teal-500"
    },
    { 
      id: 3, 
      title: "Live Ticker", 
      // Dynamic orange gradient - suggests activity and movement
      color: "bg-gradient-to-r from-amber-600 to-orange-500"
    },
    { 
      id: 4, 
      title: "OHLC Dashboard", 
      // Purple gradient - technical and analytical feel
      color: "bg-gradient-to-r from-violet-700 to-purple-500"
    },
    { 
      id: 5, 
      title: "Market News", 
      // Neutral slate gradient - professional news background
      color: "bg-gradient-to-r from-slate-700 to-slate-600"
    }
  ];

  // Handle click function
  const handleClick = useCallback((id: number) => {
    if (id === 1) return;
    if (id === 2) onSelect('quote');
    if (id === 3) onSelect('ticker');
    if (id === 4) onSelect('dashboard');
    if (id === 5) onSelect('news');
  }, [onSelect]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
    resetInterval();
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
    resetInterval();
  };

  // Reset auto-scroll interval
// Reset auto-scroll interval
const resetInterval = useCallback(() => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
  intervalRef.current = setInterval(() => {
    setCurrentIndex(prev => (prev + 1) % banners.length);
  }, 5000);
}, [banners.length]); // ✅ wrap in useCallback with dependency


  // Initialize interval
 useEffect(() => {
  resetInterval();
  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, [resetInterval]); // ✅ safe dependency


  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-2xl mb-10">
      {banners.map((banner, index) => (
        <motion.div
          key={banner.id}
          className="absolute inset-0 flex items-center justify-center rounded-2xl cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 10 : 0
          }}
          transition={{ duration: 1 }}
          onClick={() => handleClick(banner.id)}
        >
          {/* Color background instead of image */}
          <div className={`absolute inset-0 ${banner.color}`}>
            {/* Subtle pattern overlay for visual interest */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_70%,transparent_150%)]" />
          </div>
          
          {/* Semi-transparent overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20" />
          
          <motion.h2 
            className="text-4xl font-bold text-white text-center p-6 z-10 drop-shadow-lg"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {banner.title}
          </motion.h2>
        </motion.div>
      ))}
      
      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all"
        onClick={(e) => {
          e.stopPropagation();
          goToPrevious();
        }}
        aria-label="Previous slide"
      >
        <FaChevronLeft className="text-white text-xl" />
      </button>
      
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all"
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        aria-label="Next slide"
      >
        <FaChevronRight className="text-white text-xl" />
      </button>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`mx-1 h-2 w-2 rounded-full transition-all ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/30'}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
              resetInterval();
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};



export default Banner;