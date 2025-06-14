/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/StockDashboard.tsx
'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import useOHLCData from '@/utils/hooks/useOHLCData';
import OHLCChart from './OHLCChart';
import CompanyProfile from './CompanyProfile';
import FinancialDataVisualization from './FinancialDataVisualization';
import { FinancialData } from '@/utils/financial';

interface NewsItem {
  id: number;
  headline: string;
  source: string;
  url: string;
  datetime?: number;
}

interface StockDashboardProps {
  initialTicker: string;
  onSymbolChange: Dispatch<SetStateAction<string>>;
}

export default function StockDashboard({ 
  initialTicker,
  onSymbolChange 
}: StockDashboardProps) {
  const [ticker, setTicker] = useState(initialTicker);
  const [timeRange, setTimeRange] = useState('1M');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [financialLoading, setFinancialLoading] = useState(false);
  
  const { data, loading, error, refresh } = useOHLCData(ticker, {
    timespan: 'day',
    from: getFromDate(timeRange),
    to: new Date().toISOString().split('T')[0],
    adjusted: true
  });

  // Fetch company news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!apiKey) throw new Error('API key missing');
        
        const toDate = new Date().toISOString().split('T')[0];
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7);
        
        const response = await fetch(
          `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fromDate.toISOString().split('T')[0]}&to=${toDate}&token=${apiKey}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch news');
        
        const newsData = await response.json();
        setNews(newsData.slice(0, 3) as NewsItem[]);
      } catch (err) {
        console.error('Failed to load news', err);
        setNews([]);
      }
    };

    fetchNews();
  }, [ticker]);

  const fetchFinancialData = async () => {
    try {
      setFinancialLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
      if (!apiKey) throw new Error('API key missing');
      
      const response = await fetch(
        `https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=${apiKey}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch financial data');
      
      const data = await response.json() as FinancialData;
      setFinancialData(data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setFinancialData(null);
    } finally {
      setFinancialLoading(false);
    }
  };

  const handleSearch = (symbol: string) => {
    const newSymbol = symbol.toUpperCase();
    setTicker(newSymbol);
    onSymbolChange(newSymbol);
    setFinancialData(null);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/([0-9]+)/g, ' $1')
      .trim();
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return String(value);
  };

  return (
    <div className="space-y-4 md:space-y-6 min-w-0 px-2 sm:px-0">
      {/* Search and Time Range Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(ticker)}
          className="bg-white/10 border border-white/20 rounded px-3 py-2 sm:px-4 sm:py-2 flex-grow"
          placeholder="Enter symbol (e.g., AAPL)"
        />
        
        <div className="flex gap-3 sm:gap-4">
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="bg-black/10 border border-black/20 rounded px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base"
          >
            <option value="1D">1D</option>
            <option value="1W">1W</option>
            <option value="1M">1M</option>
            <option value="3M">3M</option>
            <option value="1Y">1Y</option>
          </select>
          
          <button
            onClick={() => handleSearch(ticker)}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base whitespace-nowrap"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      <CompanyProfile symbol={ticker} />

      {/* Error and Loading States */}
      {error && (
        <div className="bg-red-900/20 text-red-400 p-3 sm:p-4 rounded text-sm sm:text-base">
          Error: {String(error)}
        </div>
      )}

      {loading && (
        <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
          Loading market data...
        </div>
      )}

      {/* Main Content */}
      {!loading && data.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <OHLCChart data={data} timeframe={timeRange} />
            </div>
          </div>
          
          {/* Financial Data Button */}
          <div className="flex justify-center my-4 sm:my-6">
            <button
              onClick={fetchFinancialData}
              disabled={financialLoading}
              className={`
                px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium
                ${financialLoading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 transition-colors duration-200'}
              `}
            >
              {financialLoading ? 'Loading...' : 'Get Financial Data'}
            </button>
          </div>

          {/* Financial Data Display */}
          {financialData && (
            <div className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10 mt-2 sm:mt-4">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Financial Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Key Metrics and Annual Series sections can be uncommented if needed */}
              </div>

              <FinancialDataVisualization financialData={financialData} />
            </div>
          )}
        </>
      )}

      {/* News Section */}
      <div className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Latest News</h3>
        {news.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {news.map((item) => (
              <div key={item.id} className="border-b border-white/10 pb-3 sm:pb-4 last:border-0">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline block"
                >
                  <h4 className="font-medium text-sm sm:text-base">{item.headline}</h4>
                </a>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {item.source} • {item.datetime ? new Date(item.datetime * 1000).toLocaleDateString() : ''}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm sm:text-base">No recent news found</p>
        )}
      </div>
    </div>
  );
}

function getFromDate(timeRange: string): string {
  const date = new Date();
  switch (timeRange) {
    case '1D': date.setDate(date.getDate() - 1); break;
    case '1W': date.setDate(date.getDate() - 7); break;
    case '1M': date.setMonth(date.getMonth() - 1); break;
    case '3M': date.setMonth(date.getMonth() - 3); break;
    case '1Y': date.setFullYear(date.getFullYear() - 1); break;
    default: date.setMonth(date.getMonth() - 1);
  }
  return date.toISOString().split('T')[0];
}