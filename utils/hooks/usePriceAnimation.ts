import { useState, useCallback } from 'react';

export default function usePriceAnimation() {
  const [priceChange, setPriceChange] = useState<'up' | 'down' | 'neutral'>('neutral');
  
  const triggerPriceChange = useCallback((direction: 'up' | 'down') => {
    setPriceChange(direction);
    setTimeout(() => setPriceChange('neutral'), 1000);
  }, []);
  
  return { priceChange, triggerPriceChange };
}