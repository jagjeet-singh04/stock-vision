
'use client';

import { useEffect, useRef, useState } from 'react';

interface Trade {
  p: number; // price
  s: string; // symbol
  t: number; // timestamp
  v: number; // volume
}

export default function LiveTicker() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
useEffect(() => {
  if (!API_KEY) {
    console.error('❌ Finnhub API key missing.');
    return;
  }

  const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
  ws.current = socket;

  socket.onopen = () => {
    console.log('✅ WebSocket connected');
    socket.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }));
    socket.send(JSON.stringify({ type: 'subscribe', symbol: 'AMZN' }));
    socket.send(JSON.stringify({ type: 'subscribe', symbol: 'BINANCE:BTCUSDT' }));
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'trade') {
      setTrades((prev) => [...message.data, ...prev].slice(0, 20));
    }
  };

  socket.onerror = (event) => {
    console.error('⚠️ WebSocket encountered an error.');
    console.log('🔍 WebSocket readyState:', socket.readyState);
    console.log('📦 Event details:', event);
  };

  socket.onclose = () => {
    console.warn('🔌 WebSocket disconnected');
  };

  return () => {
    socket.close();
  };
}, [API_KEY]);


  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">📈 Live Price Ticker</h2>
      {trades.length === 0 ? (
        <p className="text-gray-500">Waiting for live data...</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {trades.map((trade, index) => (
            <li key={index} className="flex justify-between text-sm text-gray-700">
              <span className="font-medium">{trade.s}</span>
              <span>${trade.p.toFixed(2)}</span>
              <span>{new Date(trade.t).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
