// utils/hooks/useOHLCData.ts
import { useState, useEffect, useCallback } from 'react';
import PolygonApiService from '@/utils/polygonApi';

export default function useOHLCData(
  ticker: string,
  options: {
    multiplier?: number;
    timespan?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    from?: string;
    to?: string;
    adjusted?: boolean;
  } = {}
) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set default values
  const {
    multiplier = 1,
    timespan = 'day',
    from = getDefaultFromDate(),
    to = new Date().toISOString().split('T')[0],
    adjusted = true
  } = options;

  const fetchData = useCallback(async () => {
    try {
      if (!ticker) {
        setData([]);
        return;
      }

      setLoading(true);
      setError(null);

      const response = await PolygonApiService.getAggregates(
        ticker,
        multiplier,
        timespan,
        from,
        to,
        {
          adjusted,
          sort: 'asc',
          limit: 5000
        }
      );

      setData(response.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch OHLC data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [ticker, multiplier, timespan, from, to, adjusted]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}

function getDefaultFromDate(daysBack = 30): string {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date.toISOString().split('T')[0];
}