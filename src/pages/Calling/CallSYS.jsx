import React, { useState } from 'react';
import { Activity, PhoneCall } from 'lucide-react';
import LiveStatsDashboard from './LiveStatsDashboard';
import RoomHistory from './RoomHistory';
import Summary from './Summary';
import Button from "../../components/common/Button";
import FloatingMakeCall from './FloatingMakeCall';


function CallSYS() {
  // 👈 2. حالة للتحكم في إظهار أو إخفاء المكون العائم
  const [isMakeCallOpen, setIsMakeCallOpen] = useState(false);

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto font-sans relative" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>
      {/* Dashboard Header */}
      <div className="mb-8 p-6 border-b flex justify-between items-center border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" style={{ color: '#F8FAFC' }}>
            <Activity className="w-8 h-8" style={{ color: '#0D9EF2' }} />
            Live Statistics Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Monitor active calls and rooms in real-time</p>
        </div>
        
        {/* 👈 3. إضافة حدث onClick لتفعيل النافذة العائمة */}
        <Button 
          onClick={() => setIsMakeCallOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-900/20 flex items-center gap-2 cursor-pointer"
        >
          <PhoneCall className="w-5 h-5 animate-pulse" />
          <span>Make Call</span>
        </Button>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-10">
        <LiveStatsDashboard />
        <RoomHistory />
        <Summary />
      </div>

      {/* 👈 4. عرض النافذة العائمة عند النقر وتمرير دالة الإغلاق */}
      {isMakeCallOpen && (
        <FloatingMakeCall onClose={() => setIsMakeCallOpen(false)} />
      )}
    </div>
  );
}

export default CallSYS;