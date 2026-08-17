import React, { useState, useEffect } from 'react';
import { Menu, ShieldCheck } from 'lucide-react'; 
import AuditTable from './components/AuditTabel'; 
import { Auditing } from '../../services/Monitoring/GetRecentActivity(Audit Trail)';
import Button from '../../components/common/Button';
import LoadingCircle from '../../components/common/LoadingCircle';
import LoadingError from '../../components/common/LoadingError';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AuditLogs = () => {
  const { t } = useTranslation();
  const [auditData, setAuditData] = useState(null);
  const [limit, setLimit] = useState(20);
  const token = localStorage.getItem("Token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const context = useOutletContext() || {};
  const { toggleSidebar } = context;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await Auditing(token, limit);
        setAuditData(response);
        setLoading(false);
      } catch (err) {
        alert(err);
        setError(true);
      }
    };
    
    if (token) {
      fetchData();
    }
  }, [limit, token]);

  if (loading) {
    return <LoadingCircle Phrase={"Audits Logs"} />;
  }

  if (error) {
    return <LoadingError Phrase={"Audits Logs"} />;
  }

  return (
    <div>
      {/* هيدر مصمم مباشرة بدون مكون Header الخارجي */}
      <div className="px-8 py-10 border-b border-slate-800 flex flex-col gap-4">
        
        {/* السطر العلوي: زر المنيو أولاً، وبجانبه أيقونة الدرع والاسم */}
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-3">
            {/* زر القائمة أصبح في البداية */}
            
             
             

            {/* أيقونة الدرع بجانب الاسم مباشرة */}
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <div onClick={toggleSidebar} className="cursor-pointer">
                <ShieldCheck className="text-sky-400" size={24} />
              </div>
              
              <span>{t('auditLogs.title')}</span>
            </div>
          </div>

          {/* زر جلب المزيد في الطرف الآخر */}
          <Button
            onClick={() => setLimit(prev => prev + 20)}
            className="bg-customButton text-slate-50 px-6 py-2 rounded-lg font-semibold transition hover:opacity-90"
          >
            {t('auditLogs.getMoreAudits')}
          </Button>
        </div>

        {/* الوصف التوضيحي تحت العنوان */}
        <p className="text-slate-400 text-sm">
          {t('auditLogs.subtitle')}
        </p>
      </div>

      {/* جدول البيانات */}
      <div className="px-4 py-6">
        {auditData ? (
          <AuditTable data={auditData} />
        ) : (
          <p className="text-white">{t('auditLogs.loading')}</p>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;