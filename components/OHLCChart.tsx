import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface OHLCDataPoint {
  t: number;  // timestamp
  o: number;  // open
  h: number;  // high
  l: number;  // low
  c: number;  // close
  v: number;  // volume
  vw?: number; // volume weighted average price
}

interface OHLCChartProps {
  data: OHLCDataPoint[];
  timeframe: string;
  chartType?: 'line' | 'candlestick' | 'volume';
  height?: number;
}

interface ChartData {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: {
    payload: ChartData;
    value: number;
    name: string;
  }[];
  label?: string;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: date.getHours() === 0 ? undefined : 'numeric',
    minute: date.getMinutes() === 0 && date.getHours() === 0 ? undefined : '2-digit'
  });
};

const formatPrice = (value: number) => {
  return `$${value.toFixed(2)}`;
};

const formatVolume = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-gray-700 font-medium">{`Date: ${label}`}</p>
        <p className="text-blue-600 text-sm">Open: {formatPrice(data.open)}</p>
        <p className="text-green-600 text-sm">High: {formatPrice(data.high)}</p>
        <p className="text-red-600 text-sm">Low: {formatPrice(data.low)}</p>
        <p className="text-blue-800 text-sm font-medium">Close: {formatPrice(data.close)}</p>
        <p className="text-gray-600 text-sm">Volume: {formatVolume(data.volume)}</p>
        {data.vwap && (
          <p className="text-orange-600 text-sm">VWAP: {formatPrice(data.vwap)}</p>
        )}
      </div>
    );
  }
  return null;
};

const OHLCChart: React.FC<OHLCChartProps> = ({ 
  data, 
  timeframe, 
  chartType = 'line',
  height = 400 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData: ChartData[] = data.map(item => ({
    date: formatDate(item.t),
    timestamp: item.t,
    open: item.o,
    high: item.h,
    low: item.l,
    close: item.c,
    volume: item.v,
    vwap: item.vw
  }));

  const renderChart = () => {
    switch (chartType) {
      case 'volume':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tickFormatter={formatVolume}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [formatVolume(value), 'Volume']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar dataKey="volume" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'candlestick':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={formatPrice}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="high" 
                stroke="#22c55e" 
                strokeWidth={1}
                dot={false}
                name="High"
              />
              <Line 
                type="monotone" 
                dataKey="low" 
                stroke="#ef4444" 
                strokeWidth={1}
                dot={false}
                name="Low"
              />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                name="Close"
              />
              {chartData[0]?.vwap && (
                <Line 
                  type="monotone" 
                  dataKey="vwap" 
                  stroke="#f59e0b" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="VWAP"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={formatPrice}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Close Price"
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {timeframe} - {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
        </h3>
        <p className="text-sm text-gray-600">
          Showing {data.length} data points
        </p>
      </div>
      {renderChart()}
    </div>
  );
};

export default OHLCChart;