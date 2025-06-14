import { useState, useEffect } from 'react';

export default function useMarketPulse() {
  const [volatility, setVolatility] = useState(0.5);
  const [sentiment, setSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newVolatility = Math.random();
      setVolatility(newVolatility);
      
      if (newVolatility > 0.7) setSentiment('bullish');
      else if (newVolatility < 0.3) setSentiment('bearish');
      else setSentiment('neutral');
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { volatility, sentiment };
}