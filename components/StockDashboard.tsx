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
    <div className="space-y-6 min-w-0">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(ticker)}
          className="bg-white/10 border border-white/20 rounded px-4 py-2"
          placeholder="Enter symbol (e.g., AAPL)"
        />
        
        <select
          value={timeRange}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          className="bg-black/10 border border-black/20 rounded px-4 py-2"
        >
          <option value="1D">1 Day</option>
          <option value="1W">1 Week</option>
          <option value="1M">1 Month</option>
          <option value="3M">3 Months</option>
          <option value="1Y">1 Year</option>
        </select>
        
        <button
          onClick={() => handleSearch(ticker)}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      <CompanyProfile symbol={ticker} />

      {error && (
        <div className="bg-red-900/20 text-red-400 p-4 rounded">
          Error: {String(error)}
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-400">
          Loading market data...
        </div>
      )}

      {!loading && data.length > 0 && (
        <>
          <OHLCChart data={data} timeframe={timeRange} />
          
          <div className="flex justify-center my-6">
            <button
              onClick={fetchFinancialData}
              disabled={financialLoading}
              className={`
                px-6 py-3 rounded-lg text-lg font-medium
                ${financialLoading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 transition-colors duration-200'}
              `}
            >
              {financialLoading ? 'Loading...' : 'Get Financial Data'}
            </button>
          </div>

          {financialData && (
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 mt-4">
              <h3 className="text-xl font-bold mb-4">Financial Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Key Metrics and Annual Series sections can be uncommented if needed */}
              </div>

              <FinancialDataVisualization financialData={financialData} />
            </div>
          )}
        </>
      )}

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">Latest News</h3>
        {news.length > 0 ? (
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="border-b border-white/10 pb-4 last:border-0">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  <h4 className="font-medium">{item.headline}</h4>
                </a>
                <p className="text-sm text-gray-400 mt-1">
                  {item.source} • {item.datetime ? new Date(item.datetime * 1000).toLocaleDateString() : ''}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No recent news found</p>
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