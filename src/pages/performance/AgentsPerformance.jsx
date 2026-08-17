import React from 'react';
import { Clock, Trophy, Smile, Users, BarChart2, AlertCircle, Menu } from 'lucide-react';
import { useAgentsPerformanceMetrics } from '../../hooks/useAgentsPerformanceMetrics';
import LoadingCircle from '../../components/common/LoadingCircle';
import { useOutletContext } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

function AgentsPerformance() {
  const { t } = useTranslation();
  const token = localStorage.getItem("Token"); 
  const context = useOutletContext() || {};
  const { toggleSidebar } = context;
  const { data: performanceData, isLoading, isError, error } = useAgentsPerformanceMetrics(token);

  // 1. حالة التحميل (Loading State)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary text-slate-100 flex flex-col items-center justify-center gap-3">
        <LoadingCircle/>
      </div>
    );
  }

  // 2. حالة حدوث خطأ (Error State)
  if (isError) {
    return (
      <div className="min-h-screen bg-primary text-slate-100 flex flex-col items-center justify-center gap-3 p-4 text-center">
        <AlertCircle className="text-red-500" size={40} />
        <h3 className="text-lg font-bold">{t('agentsPerformance.errorTitle')}</h3>
        <p className="text-sm text-slate-400 max-w-md">
          {error?.response?.data?.message || error?.message || t('agentsPerformance.errorFallback')}
        </p>
      </div>
    );
  }

  if (!performanceData) return null;

  const [timeValue, timeUnit] = performanceData.averageResolutionTime?.split(' ') || ["0", "mins"];

  return (
    <div className="min-h-screen bg-primary text-slate-100 p-6 font-sans">
      
      {/* الهيدر أو رأس الصفحة */}
      <div className="flex flex-col items-start justify-between mb-8 border-b border-slate-800 pb-5">
      
        <div className='flex flex-row items-center p-4 justify-center'>
          <div className='flex flex-col'>
            <h1 className="text-2xl font-bold tracking-wide uppercase flex items-center gap-2">
              <div onClick={toggleSidebar} > <BarChart2  className="text-[#10B981] cursor-pointer" size={24} /></div>
              {t('agentsPerformance.title')}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {t('agentsPerformance.subtitle')}
            </p>
          </div>
        </div>
        
        {/* مؤشر تحديث البيانات تلقائياً أو فلتر */}
        <div className="flex items-center gap-2 text-xs bg-primary border border-slate-800 px-3 py-1.5 rounded-md text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {t('agentsPerformance.liveMetrics')}
        </div>
      </div>

      {/* شبكة الكروت الإحصائية (Grid Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* الكرت الأول: Active Agents */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {t('agentsPerformance.activeAgents')}
            </span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{performanceData.activeAgents}</span>
            <span className="text-xs text-emerald-400 font-medium">{t('agentsPerformance.onDuty')}</span>
          </div>
        </div>

        {/* الكرت الثاني: Customer Satisfaction */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {t('agentsPerformance.customerSatisfaction')}
            </span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Smile size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{performanceData.customerSatisfactionScore}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
        </div>

        {/* الكرت الثالث: Avg Resolution Time */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {t('agentsPerformance.avgResolutionTime')}
            </span>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{timeValue}</span>
            <span className="text-sm text-slate-400">{timeUnit}</span>
          </div>
        </div>

        {/* الكرت الرابع: Top Performing Agent */}
        <div className="bg-[#121E28] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-200 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {t('agentsPerformance.topPerformingAgentLabel')}
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Trophy size={20} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold truncate text-emerald-400">
              {performanceData.topPerformingAgent || "N/A"}
            </span>
            <span className="text-xs text-slate-400 mt-1">{t('agentsPerformance.highestResolutionRate')}</span>
          </div>
        </div>

      </div>

      {/* قسم مستقبلي مقترح للرسوم البيانية أو تفاصيل أعمق بنفس الصفحة */}
      <div className="mt-8 bg-[#121E28] border border-slate-800 rounded-xl p-6 h-64 flex items-center justify-center text-slate-500 text-sm border-dashed">
        {t('agentsPerformance.placeholderChart')}
      </div>

    </div>
  );
}

export default AgentsPerformance;