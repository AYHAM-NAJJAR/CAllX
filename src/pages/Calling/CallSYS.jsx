import React from 'react';
import { Activity, Menu, PhoneCall } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import LiveStatsDashboard from './LiveStatsDashboard';
import RoomHistory from './RoomHistory';
import Summary from './Summary';
import Button from "../../components/common/Button";

function CallSYS() {
  const { t } = useTranslation();
  
  // استقبال دالة الاتصال المركزية من الـ Outlet context الخاص بـ Panel
  const context = useOutletContext() || {};
  const { handleGlobalCall, toggleSidebar } = context;

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-7xl mx-auto font-sans relative" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>
      
      {/* Dashboard Header */}
      <div className="mb-6 md:mb-8 p-4 sm:p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 border-slate-800">
        
        {/* Left Side: Title & Sidebar Toggle */}
        <div className="w-full md:w-auto">
          <Button 
            onClick={toggleSidebar} 
            className="p-2 mb-2 md:mb-0 text-slate-300 hover:text-sky-400 rounded-lg transition-all shrink-0 inline-flex items-center"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 sm:gap-3" style={{ color: '#F8FAFC' }}>
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 shrink-0" style={{ color: '#0D9EF2' }} />
            <span className="truncate">{t('callSys.title')}</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">{t('callSys.subtitle')}</p>
        </div>
        
        {/* استخدام الدالة المركزية لفتح النافذة العائمة */}
        <Button 
          onClick={() => {
            if (handleGlobalCall) {
              handleGlobalCall("", null);
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-3 md:py-2 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto shrink-0"
        >
          <PhoneCall className="w-5 h-5 animate-pulse" />
          <span>{t('callSys.makeCall')}</span>
        </Button>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6 sm:space-y-8 md:space-y-10">
        <LiveStatsDashboard />
        <RoomHistory />
        <Summary />
      </div>
      
    </div>
  );
}

export default CallSYS;