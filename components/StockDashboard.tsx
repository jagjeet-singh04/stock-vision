/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */


'use client';


import { useState, useEffect } from 'react';
import useOHLCData from '@/utils/hooks/useOHLCData';
import OHLCChart from './OHLCChart';
import CompanyProfile from './CompanyProfile';
import FinancialDataVisualization from './FinancialDataVisualization';

export default function StockDashboard({ initialTicker }: { initialTicker: string }) {
  const [ticker, setTicker] = useState(initialTicker);
  const [timeRange, setTimeRange] = useState('1M');
  const [news, setNews] = useState<any[]>([]);
  const [financialData, setFinancialData] = useState<any>(null);
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
        const toDate = new Date().toISOString().split('T')[0];
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7);
        
        const response = await fetch(
          `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fromDate.toISOString().split('T')[0]}&to=${toDate}&token=${apiKey}`
        );
        const data = await response.json();
        setNews(data.slice(0, 3)); // Show only 3 latest news
      } catch (err) {
        console.error('Failed to load news', err);
      }
    };

    fetchNews();
  }, [ticker]);

  const fetchFinancialData = async () => {
    try {
      setFinancialLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
      const response = await fetch(
        `https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=${apiKey}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch financial data');
      
      const data = await response.json();
      setFinancialData(data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setFinancialLoading(false);
    }
  };

  const handleSearch = (symbol: string) => {
    setTicker(symbol.toUpperCase());
    setFinancialData(null); // Reset financial data when symbol changes
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  // Format helper functions
  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/([0-9]+)/g, ' $1')
      .trim();
  };

  const formatValue = (value: any): string => {
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

      {/* Company Profile */}
      <CompanyProfile symbol={ticker} />

      {/* Chart and other existing components */}
      {error && (
        <div className="bg-red-900/20 text-red-400 p-4 rounded">
          Error: {error}
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
          
          {/* Add Financial Data Button and Display */}
           <div className="flex justify-center my-6"> {/* Added margin */}
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
                {/* Key Metrics */}
                {/* <div>
                  <h4 className="font-semibold mb-3">Key Ratios</h4>
                  <div className="space-y-3">
                    {Object.entries(financialData.metric || {})
                      .filter(([key]) => !key.includes('Date') && !key.includes('Growth'))
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-300 capitalize">{formatKey(key)}:</span>
                          <span className="font-medium">{formatValue(value)}</span>
                        </div>
                      ))}
                  </div>
                </div> */}

                {/* Annual Series */}
                {/* <div>
                  <h4 className="font-semibold mb-3">Annual Performance</h4>
                  {Object.entries(financialData.series?.annual || {})
                    .filter(([key]) => ['eps', 'bookValue', 'currentRatio'].includes(key))
                    .map(([key, values]) => (
                      <div key={key} className="mb-4">
                        <h5 className="text-gray-300 capitalize mb-2">{formatKey(key)}</h5>
                        <div className="space-y-2">
                          {(Array.isArray(values) ? values : [])
                            .sort((a, b) => new Date(a.period).getFullYear() - new Date(b.period).getFullYear())
                            .map((item) => (
                              <div key={item.period} className="flex justify-between text-sm">
                                <span>{item.period ? new Date(item.period).getFullYear() : 'N/A'}</span>
                                <span>{formatValue(item.v)}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div> */}
              </div>

              {/* Add the visualization component */}
              <FinancialDataVisualization financialData={financialData} />
            </div>
          )}
        </>
      )}

      {/* Company News */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">Latest News</h3>
        {news.length > 0 ? (
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="border-b border-white/10 pb-4 last:border-0">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  <h4 className="font-medium">{item.headline}</h4>
                </a>
                <p className="text-sm text-gray-400 mt-1">{item.source}</p>
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