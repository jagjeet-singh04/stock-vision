// utils/finnhubApi.ts
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

class FinnhubApiService {
  private static readonly BASE_URL = 'https://finnhub.io/api/v1';

  static async getCompanyProfile(symbol: string): Promise<any> {
    try {
      if (!symbol) throw new Error('Symbol is required');
      
      const url = new URL(`${this.BASE_URL}/stock/profile2`);
      url.searchParams.append('symbol', symbol);
      url.searchParams.append('token', FINNHUB_API_KEY || '');

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch company profile for ${symbol}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching company profile for ${symbol}:`, error);
      throw error;
    }
  }

  
  static async getCompanyNews(symbol: string, daysBack: number = 7): Promise<any[]> {
    try {
      if (!symbol) throw new Error('Symbol is required');
      
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(toDate.getDate() - daysBack);

      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      const url = new URL(`${this.BASE_URL}/company-news`);
      url.searchParams.append('symbol', symbol);
      url.searchParams.append('from', formatDate(fromDate));
      url.searchParams.append('to', formatDate(toDate));
      url.searchParams.append('token', FINNHUB_API_KEY || '');

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error('Failed to fetch company news');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error fetching company news for ${symbol}:`, error);
      return [];
    }
  }
}

export default FinnhubApiService;