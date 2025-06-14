'use client';

import { useState, useEffect } from 'react';
import CompanyProfile from './CompanyProfile';
import CompanyNews from './CompanyNews';

interface QuoteData {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

interface QuoteCardProps {
  symbol: string;
}

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

export default function QuoteCard({ symbol }: QuoteCardProps) {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!symbol) return;

      setIsLoading(true);
      setError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!apiKey) {
          throw new Error('Finnhub API key not configured');
        }

        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch quote data');
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setQuote(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();

    // Refresh quote every 30 seconds
    const interval = setInterval(fetchQuote, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (isLoading && !quote) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-red-500/20">
        <div className="text-red-400 text-center">
          <p className="font-semibold">Error loading quote</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!quote) return null;

  const isPositive = quote.d >= 0;
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{symbol}</h2>
          <div className="text-xs text-gray-400">
            Real-time • {new Date(quote.t * 1000).toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {formatPrice(quote.c)}
            </div>
            <div className={`flex items-center justify-center space-x-1 ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
              <span className="font-medium">
                {formatChange(quote.d)} ({formatPercent(quote.dp)})
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Day Range</div>
            <div className="text-white">
              <div className="text-lg font-semibold text-red-400">
                L: {formatPrice(quote.l)}
              </div>
              <div className="text-lg font-semibold text-green-400">
                H: {formatPrice(quote.h)}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Open</div>
            <div className="text-2xl font-bold text-white">
              {formatPrice(quote.o)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Previous Close</div>
            <div className="text-2xl font-bold text-white">
              {formatPrice(quote.pc)}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-gray-400 mb-1">Position in Day Range</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
              style={{
                width: `${Math.max(0, Math.min(100, ((quote.c - quote.l) / (quote.h - quote.l)) * 100))}%`
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Low: {formatPrice(quote.l)}</span>
            <span>High: {formatPrice(quote.h)}</span>
          </div>
        </div>
      </div>

      <CompanyProfile symbol={symbol} />
      <CompanyNews symbol={symbol} />
    </div>
  );
}