// components/CompanyProfile.tsx
'use client';

import { useState, useEffect } from 'react';
import FinnhubApiService from '@/utils/finnhubApi';

export default function CompanyProfile({ symbol }: { symbol: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await FinnhubApiService.getCompanyProfile(symbol);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch company profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [symbol]);

  if (loading) return <div className="text-center py-4">Loading company profile...</div>;
  if (error) return <div className="text-red-400 text-center py-4">{error}</div>;
  if (!profile || Object.keys(profile).length === 0) return null;

  return (
    <div className="bg-white/5 rounded-lg p-4 mt-4 border border-white/10">
      <div className="flex items-start gap-4">
        {profile.logo && (
          <img 
            src={profile.logo} 
            alt={`${profile.name} logo`} 
            className="w-16 h-16 object-contain rounded-md"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold">{profile.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300 mt-2">
            <div>
              <p><span className="font-medium">Ticker:</span> {profile.ticker}</p>
              <p><span className="font-medium">Exchange:</span> {profile.exchange}</p>
              <p><span className="font-medium">Industry:</span> {profile.finnhubIndustry}</p>
            </div>
            <div>
              <p><span className="font-medium">Country:</span> {profile.country}</p>
              <p><span className="font-medium">Currency:</span> {profile.currency}</p>
              {profile.ipo && (
                <p><span className="font-medium">IPO Date:</span> {new Date(profile.ipo).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          {profile.marketCapitalization && (
            <p className="mt-2">
              <span className="font-medium">Market Cap:</span> ${(profile.marketCapitalization / 1000000000).toFixed(2)}B
            </p>
          )}
          {profile.weburl && (
            <a 
              href={profile.weburl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-3 text-cyan-400 hover:underline text-sm"
            >
              Visit Company Website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}