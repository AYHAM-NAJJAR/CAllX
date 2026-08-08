import React, { useEffect, useState } from 'react';
import { fetchSummary } from '../../services/stats/summary';

export default function Summary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchSummary();
        setSummary(data);
      } catch (err) {
        setError('Error in fetching summary data.');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400 bg-[#0F172A] min-h-[200px] flex items-center justify-center rounded-xl">
        Loading summary <span className="animate-pulse transition-all ease-linear text-2xl text-[#0D9EF2]">......</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-400 bg-[#0F172A] min-h-[200px] flex items-center justify-center rounded-xl border border-red-500/20">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0F172A]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Total Sessions Card */}
        <div className="bg-[#101B22] p-6 rounded-xl shadow-lg border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Total Sessions</p>
            <h3 className="text-3xl font-bold text-white">{summary?.totalSessions ?? 0}</h3>
          </div>
          <div className="p-3 bg-[#0D9EF2]/15 text-[#0D9EF2] rounded-lg border border-[#0D9EF2]/30">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        {/* Total Minutes Recorded Card */}
        <div className="bg-[#101B22] p-6 rounded-xl shadow-lg border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Total Minutes Recorded</p>
            <h3 className="text-3xl font-bold text-white">{summary?.totalMinutesRecorded ?? 0} <span className="text-lg font-normal text-gray-400">mins</span></h3>
          </div>
          <div className="p-3 bg-[#0D9EF2]/15 text-[#0D9EF2] rounded-lg border border-[#0D9EF2]/30">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}