// utils/polygonApi.ts
class PolygonApiService {
  private static readonly BASE_URL = 'https://api.polygon.io/v2';
  private static readonly API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

  static async getAggregates(
    ticker: string,
    multiplier: number,
    timespan: string,
    from: string,
    to: string,
    options: {
      adjusted?: boolean;
      sort?: string;
      limit?: number;
    } = {}
  ): Promise<any> {
    try {
      // Validate required parameters
      if (!ticker || !multiplier || !timespan || !from || !to) {
        throw new Error(
          `Missing required parameters: ${JSON.stringify({
            ticker,
            multiplier,
            timespan,
            from,
            to
          })}`
        );
      }

      // Construct URL
      const url = new URL(
        `${this.BASE_URL}/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}`
      );

      // Add API key
      url.searchParams.append('apiKey', this.API_KEY || '');

      // Add optional parameters
      if (options.adjusted !== undefined) {
        url.searchParams.append('adjusted', String(options.adjusted));
      }
      if (options.sort) {
        url.searchParams.append('sort', options.sort);
      }
      if (options.limit) {
        url.searchParams.append('limit', String(options.limit));
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

export default PolygonApiService;