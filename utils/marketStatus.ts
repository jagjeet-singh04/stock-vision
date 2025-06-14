// utils/marketStatus.ts
import axios from 'axios';

export async function getMarketStatus() {
  const url = `https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`;

  try {
    const res = await axios.get(url);
    return res.data.markets; // markets is an array of venue info
  } catch (err: any) {
    console.error('Market status fetch error:', err.message);
    return [];
  }
}
