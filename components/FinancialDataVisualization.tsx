// components/FinancialDataVisualization.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */


'use client';

import { useState, useMemo } from 'react';
import { 
  LineChart, RadarChart, AreaChart, PieChart,
  Line, Bar, Radar,   XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface FinancialData {
  series?: {
    annual?: {
      [key: string]: Array<{
        period: string;
        v: number;
      }>;
    };
  };
  metric?: {
    [key: string]: number | string;
  };
}

interface MetricItem {
  name: string;
  value: number | string;
  key: string;
}

const formatMetricName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/([A-Z]{2,})/g, ' $1')
    .replace(/(\d+)/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();
};

const FinancialDashboard = ({ financialData }: { financialData: FinancialData }) => {
  const [activeTab, setActiveTab] = useState('keyMetrics');
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Categorize metrics into groups - ONLY THESE WILL BE SHOWN
  const { keyMetrics, performanceMetrics, ratioMetrics, valuationMetrics } = useMemo(() => {
    const metrics = financialData.metric || {};
    // const annualData = financialData.series?.annual || {};

    // Key Metrics (general overview)
    const keyMetrics = [
      '10DayAverageTradingVolume',
      '13WeekPriceReturnDaily',
      '26WeekPriceReturnDaily',
      '52WeekHigh',
      '52WeekLow',
      '52WeekPriceReturnDaily',
      '5DayPriceReturnDaily'
    ].filter(key => metrics[key] !== undefined)
     .map(key => ({
        name: formatMetricName(key),
        value: metrics[key],
        key
      }));

    // Performance Metrics
    const performanceMetrics = [
      'assetTurnoverAnnual',
      'assetTurnoverTTM',
      'bookValuePerShareAnnual',
      'bookValuePerShareQuarterly',
      'bookValueShareGrowth5Y',
      'capexCagr5Y'
    ].filter(key => metrics[key] !== undefined)
     .map(key => ({
        name: formatMetricName(key),
        value: metrics[key],
        key
      }));

    // Ratio Metrics
    const ratioMetrics = Object.entries(metrics)
      .filter(([key]) => key.includes('Ratio') || key.includes('Margin'))
      .map(([key, value]) => ({
        name: formatMetricName(key),
        value,
        key
      }));

    // Valuation Metrics
    const valuationMetrics = Object.entries(metrics)
      .filter(([key]) => key.includes('PE') || key.includes('Price') || key.includes('EV'))
      .map(([key, value]) => ({
        name: formatMetricName(key),
        value,
        key
      }));

    return { keyMetrics, performanceMetrics, ratioMetrics, valuationMetrics };
  }, [financialData]);

  // Chart data transformations - ONLY FOR YOUR METRICS
  const { performanceData, ratioData, valuationData } = useMemo(() => {
    const annualData = financialData.series?.annual || {};

    const performanceData = ['eps', 'revenuePerShare', 'freeCashFlowPerShare'].flatMap(key => 
      annualData[key]?.map((item: { period: string; v: number }) => ({
        date: new Date(item.period),
        year: new Date(item.period).getFullYear(),
        [key]: item.v,
        name: formatMetricName(key)
      })) || []
    );

    const ratioData = ratioMetrics.map(item => ({
      name: item.name,
      value: Number(item.value)
    }));

    const valuationData = valuationMetrics.map(item => ({
      name: item.name,
      value: Number(item.value)
    }));

    return { performanceData, ratioData, valuationData };
  }, [financialData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const valueFormatter = (value: number) => value.toFixed(2);

  const formatValue = (value: number | string) => {
    if (typeof value === 'number') {
      return value > 1000 ? `$${(value / 1000).toFixed(1)}B` : value.toFixed(2);
    }
    return value;
  };

  const renderMetricCards = (metrics: MetricItem[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {metrics.map(({ name, value, key }) => (
        <div 
          key={key}
          className={`p-4 rounded-lg transition-all border
            ${hoveredMetric === key ? 
              'bg-blue-900/50 scale-105 border-blue-500' : 
              'bg-gray-800/50 border-gray-700'}`}
          onMouseEnter={() => setHoveredMetric(key)}
          onMouseLeave={() => setHoveredMetric(null)}
        >
          <div className="text-sm text-gray-400">{name}</div>
          <div className="text-xl font-bold mt-1">
            {typeof value === 'number' ? formatValue(value) : value}
          </div>
          {hoveredMetric === key && (
            <div className="text-xs text-gray-400 mt-2">
              {getMetricDescription(key)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-2xl">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 gap-2 mb-6">
          <TabsTrigger value="keyMetrics" className="py-3 hover:bg-gray-700 transition-colors">📊 Key Metrics</TabsTrigger>
          <TabsTrigger value="performance" className="py-3 hover:bg-gray-700 transition-colors">📈 Performance</TabsTrigger>
          <TabsTrigger value="ratios" className="py-3 hover:bg-gray-700 transition-colors">🧮 Key Ratios</TabsTrigger>
          <TabsTrigger value="valuation" className="py-3 hover:bg-gray-700 transition-colors">💰 Valuation</TabsTrigger>
        </TabsList>

        {/* Key Metrics Tab */}
        <TabsContent value="keyMetrics">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Key Financial Metrics</h3>
            {renderMetricCards(keyMetrics)}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <div className="space-y-6">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              {renderMetricCards(performanceMetrics)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Historical Performance</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fill: '#9CA3AF' }}
                        tickMargin={10}
                      />
                      <YAxis 
                        tick={{ fill: '#9CA3AF' }}
                        tickFormatter={valueFormatter}
                      />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(31, 41, 55, 0.9)',
                          borderColor: '#4B5563',
                          borderRadius: '0.5rem'
                        }}
                        formatter={(value: number) => [`$${valueFormatter(value)}`, 'Value']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="eps" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="EPS"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenuePerShare" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Revenue/Share"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Growth Radar</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ratioData.slice(0, 6)}>
                      <PolarGrid stroke="#4B5563" />
                      <PolarAngleAxis 
                        dataKey="name" 
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <Radar 
                        name="Ratios" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.4} 
                      />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(31, 41, 55, 0.9)',
                          borderColor: '#4B5563',
                          borderRadius: '0.5rem'
                        }}
                        formatter={valueFormatter}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Ratio Metrics Tab */}
        <TabsContent value="ratios">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Key Financial Ratios</h3>
            {renderMetricCards(ratioMetrics)}
          </div>
        </TabsContent>

        {/* Valuation Metrics Tab */}
        <TabsContent value="valuation">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Valuation Metrics</h3>
            {renderMetricCards(valuationMetrics)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function getMetricDescription(metric: string): string {
  const descriptions: Record<string, string> = {
    // Key Metrics
    '10DayAverageTradingVolume': "Average trading volume over the last 10 days",
    '13WeekPriceReturnDaily': "13-week price return percentage",
    '26WeekPriceReturnDaily': "26-week price return percentage",
    '52WeekHigh': "Highest price in the last 52 weeks",
    '52WeekLow': "Lowest price in the last 52 weeks",
    '52WeekPriceReturnDaily': "52-week price return percentage",
    '5DayPriceReturnDaily': "5-day price return percentage",
    
    // Performance Metrics
    'assetTurnoverAnnual': "Annual asset turnover ratio",
    'assetTurnoverTTM': "Trailing twelve months asset turnover",
    'bookValuePerShareAnnual': "Annual book value per share",
    'bookValuePerShareQuarterly': "Quarterly book value per share",
    'bookValueShareGrowth5Y': "5-year book value per share growth rate",
    'capexCagr5Y': "5-year capital expenditure compound annual growth rate",
    
    // Common metrics
    'eps': "Earnings per share indicates company profitability per outstanding share",
    'peRatio': "Price-to-Earnings ratio shows how much investors pay for each dollar of earnings",
    'debtToEquity': "Indicates relative proportion of shareholders' equity and debt used to finance assets",
    'currentRatio': "Measures company's ability to pay short-term obligations",
    'returnOnEquity': "Measures profitability relative to shareholders' equity"
  };
  return descriptions[metric] || "Key financial metric indicating company performance";
}

export default FinancialDashboard;