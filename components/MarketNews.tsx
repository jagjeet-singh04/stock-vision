// components/MarketNews.tsx
'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  url: string;
  image: string;
  source: string;
  datetime: number;
  category: string;
  related: string;
}

export default function MarketNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!apiKey) {
          throw new Error('API key not configured');
        }

        const response = await fetch(
          `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setNews(data.slice(0, 5)); // Show only 5 latest news
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-center">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Latest Market News</h2>
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
            <div className="flex flex-col sm:flex-row gap-4">
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.headline}
                  className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <h3 className="font-semibold text-white">{item.headline}</h3>
                </a>
                <p className="text-gray-400 text-sm mt-1">{item.summary}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500 gap-2">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{new Date(item.datetime * 1000).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}