import React, { useCallback, useEffect, useState } from 'react';
import { GetSystemStatsHealth } from '../../services/Monitoring/GetSystemStatsHealth';
import { Activity, Users, Server, HardDrive, Clock, Database, CheckCircle, AlertTriangle, Ban, SendHorizontal, MessageSquareReply, SquareStack } from 'lucide-react';
import LoadingCircle from '../../components/common/LoadingCircle';
import LoadingError from '../../components/common/LoadingError';
import { GetPerformanceMetrics } from '../../services/Monitoring/GetPerformanceMetrics';

function Monitory() {
  const token = localStorage.getItem("Token");
  const [stats, setStats] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const metrics = useCallback(async () => {
  if (!token) return;
  try {
    setLoading(true);
    const [statsRes, perfRes] = await Promise.all([
      GetSystemStatsHealth(token),
      GetPerformanceMetrics(token)
    ]);

    
    if (statsRes && perfRes) {
      setStats({
        ...statsRes,
        ...perfRes 
      });
    }
  } catch (err) {
    setError(true);
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [token]);

  useEffect(() => {
    metrics();
  }, [metrics]);
  
  if (loading) {
    return <LoadingCircle Phrase={"Metrics"} />;
  }

  if (error) {
    return <LoadingError Phrase={"Metrics"} />;
  }
  return (
    <div className="space-y-8 animate-fade-in text-slate-100 p-6">
      
      {/* الهيدر */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-wide text-cyan-400 uppercase flex items-center gap-2">
            <Activity size={20} />
            System Health
          </h2>
          <p className="text-xs text-slate-400 mt-1">System Monitoring Stats</p>
        </div>
      </div>

      {/* صف الكروت الإحصائية (توزيع البيانات الجديدة) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Users */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Users</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Users size={18} /></div>
          </div>
          <p className="text-3xl font-bold tracking-tight">{stats.totalUsers ?? 0}</p>
        </div>

        {/* Active Tickets */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Active Tickets</span>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Activity size={18} /></div>
          </div>
          <p className="text-3xl font-bold tracking-tight">{stats.activeTickets ?? 0}</p>
        </div>

        {/* DB Status */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Database Status</span>
            <div className={`p-2 rounded-lg ${stats.dbStatus === 'UP' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <Database size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight">{stats.dbStatus ?? "N/A"}</p>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* System Uptime */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-6 shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-full text-amber-400"><Clock size={24} /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">System Uptime</p>
            <p className="text-xl font-mono">{stats.systemUptime ?? "0"}</p>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-6 shadow-md flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-full text-purple-400"><HardDrive size={24} /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Heap Memory Usage</p>
            <p className="text-xl font-mono">{stats.heapMemoryUsage ?? "0"}</p>
          </div>
        </div>
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-6 shadow-md flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-full text-purple-400"><Ban size={24} className='text-red-600' /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Error Rate</p>
            <p className="text-xl font-mono">{stats.errorRate ?? "0"}</p>
          </div>
        </div>
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-6 shadow-md flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-full text-purple-400"><SendHorizontal size={24} className='text-green-400' /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Requests Per Minute</p>
            <p className="text-xl font-mono">{stats.requestsPerMinute ?? "0"}</p>
          </div>
        </div>
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-6 shadow-md flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-full text-purple-400"><MessageSquareReply  size={24} className='text-indigo-600' /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">avg Response Time</p>
            <p className="text-xl font-mono">{stats.avgResponseTime ?? "0"}</p>
          </div>
        </div>
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-6 shadow-md flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-full text-purple-400"><SquareStack  size={24} className='text-white' /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">active Threads</p>
            <p className="text-xl font-mono">{stats.activeThreads ?? "0"}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Monitory;