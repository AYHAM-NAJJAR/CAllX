// QueueCard.jsx
import React, { useState } from 'react';
import { UserCheck, Clock, Key, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import Button from '../../../components/common/Button';
import { updateQueueStatus } from '../../../services/Queue/updateStatus';

function QueueCard({ queue }) {
  const { name, queueKey, waitingCount, active, createdAt } = queue;

  // حالة محليّة لإدارة حالة النشاط والتحميل
  const [isActive, setIsActive] = useState(active);
  const [loading, setLoading] = useState(false);
   // جلب التوكن من التخزين المحلي
    const token = localStorage.getItem('Token'); 
  // تنسيق التاريخ لشكل مقروء
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // دالة تغيير الحالة عند النقر
  const handleToggleStatus = async (e) => {
    e.stopPropagation(); // منع انتشار الحدث إذا كانت البطاقة قابلة للنقر
    if (loading) return;

    const nextStatus = !isActive;
    setLoading(true);

    try {
      await updateQueueStatus(queueKey, nextStatus,token);
      setIsActive(nextStatus); // تحديث الحالة عند نجاح الطلب
    } catch (error) {
      console.error('Failed to update status:', error);
      // يمكن إضافة إشعار خطأ هنا (Toast)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#101B22] rounded-xl p-5 border border-white/5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="m-0 mb-1 text-[18px] font-semibold text-white">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-400 text-[13px]">
            <Key size={14} className="text-[#0D9EF2]" />
            <span>{queueKey}</span>
          </div>
        </div>

        {/* Status Toggle Button */}
        <button
          onClick={handleToggleStatus}
          disabled={loading}
          title={isActive ? 'Deactivate Queue' : 'Activate Queue'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
            isActive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
          } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isActive ? (
            <ToggleRight size={18} className="text-emerald-400" />
          ) : (
            <ToggleLeft size={18} className="text-rose-400" />
          )}
          <span>{isActive ? 'Active' : 'Inactive'}</span>
        </button>
      </div>

      {/* Divider */}
      <hr className="border-none border-t border-white/[0.08] mb-4" />

      {/* Content Stats */}
      <div className="flex flex-col gap-3">
        {/* Waiting Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <UserCheck size={18} />
            <span className="text-sm">Waiting Customers</span>
          </div>
          <span className={`text-base font-bold px-2 py-0.5 rounded-md ${
            waitingCount > 0 
              ? 'text-[#0D9EF2] bg-[#0D9EF2]/10' 
              : 'text-white bg-white/5'
          }`}>
            {waitingCount}
          </span>
        </div>

        {/* Created At */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={18} />
            <span className="text-sm">Created Date</span>
          </div>
          <span className="text-sm text-slate-300 font-medium">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        path={`/main/queue/all/details/${queueKey}`}
        className="mt-5 w-full bg-[#0D9EF2] text-white border-none rounded-lg px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-[#0b84cb] transition-colors"
      >
        Manage Queue
      </Button>
    </div>
  );
}

export default QueueCard;