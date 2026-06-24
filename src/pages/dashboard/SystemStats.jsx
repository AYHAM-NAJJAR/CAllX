import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import { Users, Ticket, AlertTriangle, Layers, Activity, ShieldAlert, Loader2, AlertCircle, BarChart3 } from 'lucide-react';
import { useSystemStats } from '../../hooks/useSystemStats';
import LoadingCircle from '../../components/common/LoadingCircle';
import LoadingError from '../../components/common/LoadingError';

function SystemStats() {
  const token = localStorage.getItem("Token");
  const { data: stats, isLoading, isError } = useSystemStats(token);

  // 1. حالة التحميل (Loading State)
    if (isLoading) {
    return (
      <LoadingCircle Phrase={"System Stats"}/>
    );
  }

  if (isError) {
    return (
      <LoadingError Phrase={"Stats"}/>
    );
  }

  if (!stats) return null;

  // دالة مساعدة لتعيين ألوان مخصصة لكل أولوية ديناميكياً (متوافقة مع أشرطة التقدم)
  const getPriorityStyles = (priority) => {
    switch (priority.toUpperCase()) {
      case 'CRITICAL':
        return { bar: 'bg-red-500', text: 'text-red-400' };
      case 'HIGH':
        return { bar: 'bg-orange-500', text: 'text-orange-400' };
      case 'MEDIUM':
        return { bar: 'bg-blue-500', text: 'text-blue-400' };
      case 'LOW':
        return { bar: 'bg-emerald-500', text: 'text-emerald-400' };
      default:
        return { bar: 'bg-slate-500', text: 'text-slate-400' };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      
      {/* الهيدر أو رأس الصفحة */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-wide text-cyan-400 uppercase flex items-center gap-2">
            <Activity size={20} />
            System Statistics
          </h2>
          <p className="text-xs text-slate-400 mt-1">Core system metrics, ticket analysis and configuration data.</p>
        </div>
      </div>

      {/* 1. صف الكروت الإحصائية الأربعة الأولى */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-200 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Users</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Users size={18} /></div>
          </div>
          <p className="text-3xl font-bold tracking-tight">{stats.totalUsers ?? 0}</p>
        </div>

        {/* Total Tickets */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-200 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Tickets</span>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Ticket size={18} /></div>
          </div>
          <p className="text-3xl font-bold tracking-tight">{stats.totalTickets ?? 0}</p>
        </div>

        {/* Open Tickets */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-200 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Open Tickets</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><AlertTriangle size={18} /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight text-amber-400">{stats.openTickets ?? 0}</p>
            <span className="text-xs text-slate-400 font-medium">Requires Action</span>
          </div>
        </div>

        {/* Escalated Tickets */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-200 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Escalated Tickets</span>
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400"><ShieldAlert size={18} /></div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-emerald-400">{stats.escalatedTickets ?? 0}</p>
        </div>

      </div>

      {/* 2. صف التحليلات الرسومية المتطورة (الأولويات + الفئات) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* كرت: توزيع التذاكر حسب الأولوية باستخدام Radix UI Progress */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-amber-500" />
            Tickets By Priority
          </h3>
          <div className="space-y-4">
            {stats.ticketsByPriority && Object.keys(stats.ticketsByPriority).length > 0 ? (
              Object.entries(stats.ticketsByPriority).map(([priority, count]) => {
                const percentage = stats.totalTickets > 0 ? (count / stats.totalTickets) * 100 : 0;
                const styles = getPriorityStyles(priority);
                
                return (
                  <div key={priority} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={`font-semibold ${styles.text}`}>{priority}</span>
                      <span className="text-slate-400">{count} tickets</span>
                    </div>
                    {/* Radix UI Progress Root */}
                    <Progress.Root
                      className="relative overflow-hidden bg-slate-900 rounded-full w-full h-2 border border-slate-800"
                      style={{ transform: 'translateZ(0)' }}
                      value={percentage}
                    >
                      <Progress.Indicator
                        className={`${styles.bar} w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]`}
                        style={{ transform: `translateX(-${100 - percentage}%)` }}
                      />
                    </Progress.Root>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No priorities recorded.</p>
            )}
          </div>
        </div>
        
        {/* كرت: توزيع التذاكر حسب الفئة باستخدام Radix UI Progress */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase mb-4 flex items-center gap-2">
            <Layers size={16} className="text-cyan-400" />
            Tickets By Category
          </h3>
          <div className="space-y-4">
            {stats.ticketsByCategory && Object.keys(stats.ticketsByCategory).length > 0 ? (
              Object.entries(stats.ticketsByCategory).map(([category, count]) => {
                const percentage = stats.totalTickets > 0 ? (count / stats.totalTickets) * 100 : 0;
                
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300 capitalize">{category}</span>
                      <span className="text-slate-400">{count} tickets</span>
                    </div>
                    {/* Radix UI Progress Root */}
                    <Progress.Root
                      className="relative overflow-hidden bg-slate-900 rounded-full w-full h-2 border border-slate-800"
                      style={{ transform: 'translateZ(0)' }}
                      value={percentage}
                    >
                      <Progress.Indicator
                        className="bg-cyan-500 w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
                        style={{ transform: `translateX(-${100 - percentage}%)` }}
                      />
                    </Progress.Root>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No categories recorded.</p>
            )}
          </div>
        </div>

      </div>

      {/* 3. الصف السفلي: تحليل الحقول الديناميكية */}
      <div className="bg-[#121E28] border border-slate-800 rounded-xl p-6 shadow-md">
        <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase mb-4 flex items-center gap-2">
          <Activity size={16} className="text-purple-400" />
          Dynamic Fields Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-center h-full">
            <span className="text-xs text-slate-400 mb-1">Most Used Custom Field</span>
            <span className="text-sm font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-1.5 rounded text-center block truncate">
              "{stats.dynamicFieldsAnalytics?.mostUsedCustomField || "N/A"}"
            </span>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3">Value Distribution</p>
            <div className="grid grid-cols-3 gap-3">
              {stats.dynamicFieldsAnalytics?.fieldValuesDistribution && 
                Object.entries(stats.dynamicFieldsAnalytics.fieldValuesDistribution).map(([label, value]) => (
                  <div key={label} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">{label}</span>
                    <span className="text-lg font-bold text-slate-200">{value}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 text-right mt-4 italic border-t border-slate-800/50 pt-2">
          * Field analysis is calculated globally across all active tickets.
        </div>
      </div>

    </div>
  );
}

export default SystemStats;