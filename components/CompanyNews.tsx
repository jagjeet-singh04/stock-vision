// components/CompanyNews.tsx
'use client';

import { useState, useEffect } from 'react';
import FinnhubApiService from '@/utils/finnhubApi';
import { format } from 'date-fns';

interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  url: string;
  image: string;
  source: string;
  datetime: number;
}

export default function CompanyNews({ symbol }: { symbol: string }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await FinnhubApiService.getCompanyNews(symbol);
        setNews(data.slice(0, 5)); // Show only the latest 5 news items
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch company news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  if (loading) {
    return (
      <div className="bg-white/5 rounded-lg p-4 mt-4 border border-white/10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-2"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/5 rounded-lg p-4 mt-4 border border-white/10">
        <div className="text-red-400 text-center">
          <p>Error loading news: {error}</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="bg-white/5 rounded-lg p-4 mt-4 border border-white/10">
      <h3 className="text-lg font-semibold mb-4">Latest Company News</h3>
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
            <div className="flex gap-4">
              {item.image && (
                <div className="flex-shrink-0 w-20 h-20">
                  <img 
                    src={item.image} 
                    alt={item.headline}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-cyan-400 transition-colors"
                >
                  <h4 className="font-medium">{item.headline}</h4>
                </a>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {item.summary}
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <span>{item.source}</span>
                  <span className="mx-2">•</span>
                  <span>{format(new Date(item.datetime * 1000), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}