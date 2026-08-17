import React, { useState, useEffect } from 'react';
import { Users, Radio, Clock, ShieldAlert, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLiveStats } from '../../services/stats/getLiveStats';
import LoadingError from '../../components/common/LoadingError';
import LoadingCircle from '../../components/common/LoadingCircle';

const LiveStatsDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data with automatic polling every 5 seconds
    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await getLiveStats();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (err) {
                setError(t('liveStats.failedToFetch'));
            } finally {
                setLoading(false);
            }
        };

        loadStats();
        const interval = setInterval(loadStats, 5000);
        return () => clearInterval(interval);
    }, [t]);

    if (loading) {
        return <LoadingCircle Phrase={"Rooms"} />;
    }
    
    if (error) {
        return <LoadingError Phrase={"Rooms"} />;
    }

    const roomsArray = stats?.rooms ? Object.values(stats.rooms) : [];

    return (
        <div className="p-6 max-w-6xl mx-auto font-sans" dir="ltr" style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC' }}>
            {/* Header and General Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">

                {/* Summary Cards */}
                <div className="flex gap-4">
                    <div className="p-4 rounded-xl border border-slate-800 flex items-center gap-3" style={{ backgroundColor: '#101B22' }}>
                        <div className="p-3 rounded-lg bg-sky-950/50" style={{ color: '#0D9EF2' }}>
                            <Radio size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">{t('liveStats.activeRooms')}</p>
                            <p className="text-xl font-bold text-slate-100">{stats?.activeRooms || 0}</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-800 flex items-center gap-3" style={{ backgroundColor: '#101B22' }}>
                        <div className="p-3 rounded-lg bg-emerald-950/50 text-emerald-400">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">{t('liveStats.totalParticipants')}</p>
                            <p className="text-xl font-bold text-slate-100">{stats?.totalParticipants || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rooms View */}
            {roomsArray.length === 0 ? (
                <div className="rounded-2xl p-12 text-center border border-dashed border-slate-800" style={{ backgroundColor: '#101B22' }}>
                    <Radio className="mx-auto h-12 w-12 text-slate-600 mb-3 animate-pulse" />
                    <h3 className="text-lg font-medium text-slate-300">{t('liveStats.noActiveRoomsTitle')}</h3>
                    <p className="text-slate-500 text-sm mt-1">{t('liveStats.noActiveRoomsDesc')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {roomsArray.map((room) => (
                        <div 
                            key={room.roomName} 
                            className="rounded-2xl border border-slate-800 p-6 transition-all hover:border-slate-700 shadow-lg"
                            style={{ backgroundColor: '#101B22' }}
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-800/80">
                                <div>
                                    <span className="inline-block px-2.5 py-1 bg-emerald-950 text-emerald-400 text-xs font-semibold rounded-full mb-2 border border-emerald-900/50">
                                        {t('liveStats.activeNow')}
                                    </span>
                                    <h3 className="text-sm font-mono text-slate-400 break-all" title={room.roomName}>
                                        {room.roomName}
                                    </h3>
                                </div>
                                <div className="text-right text-xs text-slate-400 flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>{new Date(room.startedAt).toLocaleTimeString()}</span>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div className="p-3 rounded-xl border border-slate-800/50" style={{ backgroundColor: '#0F172A' }}>
                                    <span className="block text-slate-400 text-xs">{t('liveStats.peakParticipants')}</span>
                                    <span className="font-bold text-slate-200">{room.peakParticipants} users</span>
                                </div>
                                <div className="p-3 rounded-xl border border-slate-800/50" style={{ backgroundColor: '#0F172A' }}>
                                    <span className="block text-slate-400 text-xs">{t('liveStats.totalJoins')}</span>
                                    <span className="font-bold text-slate-200">{room.totalJoins}</span>
                                </div>
                            </div>

                            {/* Participants List */}
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    {t('liveStats.currentParticipants')} ({room.currentParticipants.length})
                                </h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {room.currentParticipants.map((participant, index) => {
                                        const isAgent = participant.includes('_agent');
                                        const isCustomer = participant.includes('_customer');
                                        
                                        return (
                                            <div 
                                                key={index}
                                                className="flex items-center justify-between p-2.5 rounded-xl text-xs border border-slate-800/40"
                                                style={{ backgroundColor: '#0F172A' }}
                                            >
                                                <span className="font-medium text-slate-300 truncate max-w-[200px]" title={participant}>
                                                    {participant}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-md font-medium text-[10px] ${
                                                    isAgent ? 'bg-sky-950 text-sky-400 border border-sky-900/50' :
                                                    isCustomer ? 'bg-amber-950 text-amber-400 border border-amber-900/50' : 
                                                    'bg-slate-800 text-slate-300'
                                                }`}>
                                                    {isAgent ? t('liveStats.agent') : isCustomer ? t('liveStats.customer') : t('liveStats.external')}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LiveStatsDashboard;