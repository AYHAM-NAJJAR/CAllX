import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchStatsHistory } from '../../services/stats/roomsHistory';

export default function RoomHistory() {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStatsHistory();
        setHistory(data);
      } catch (err) {
        setError(t('roomHistory.errorFetching'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [t]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return t('roomHistory.durationMins', { mins });
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400 bg-[#0F172A] min-h-screen flex items-center justify-center">
        {t('roomHistory.loading')} <span className="animate-pulse transition-all ease-linear text-2xl text-[#0D9EF2]">......</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-400 bg-[#0F172A] min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-6xl mx-auto p-6 bg-[#101B22] rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-white">{t('roomHistory.title')}</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] text-gray-300 text-sm border-b border-gray-800">
                <th className="p-3">{t('roomHistory.roomName')}</th>
                <th className="p-3">{t('roomHistory.egressId')}</th>
                <th className="p-3">{t('roomHistory.startedAt')}</th>
                <th className="p-3">{t('roomHistory.duration')}</th>
                <th className="p-3 text-center">{t('roomHistory.peakParticipants')}</th>
                <th className="p-3 text-center">{t('roomHistory.totalJoins')}</th>
                <th className="p-3">{t('roomHistory.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-[#0F172A]/50 transition-colors">
                  <td className="p-3 font-medium text-white">{item.roomName}</td>
                  <td className="p-3 font-mono text-xs text-[#0D9EF2]">{item.egressId}</td>
                  <td className="p-3">{new Date(item.startedAt).toLocaleString()}</td>
                  <td className="p-3">{formatDuration(item.durationSeconds)}</td>
                  <td className="p-3 text-center">{Math.max(0, item.peakParticipants - 1)}</td>
                  <td className="p-3 text-center">{Math.max(0, item.totalJoins - 1)}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#0D9EF2]/20 text-[#0D9EF2] border border-[#0D9EF2]/30">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}