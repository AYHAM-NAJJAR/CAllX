import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react'; 
import AuditTable from './components/AuditTabel'; 
import { Auditing } from '../../services/Monitoring/GetRecentActivity(Audit Trail)';
import Button from '../../components/common/Button';
import LoadingCircle from '../../components/common/LoadingCircle';
import LoadingError from '../../components/common/LoadingError';
import Header from '../../components/common/Header';


const AuditLogs = () => {
  const [auditData, setAuditData] = useState(null);
  const [limit, setLimit] = useState(20);
  const token = localStorage.getItem("Token");
     const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // إضافة limit إلى مصفوفة الاعتماد يضمن إعادة استدعاء API عند الضغط على الزر
  useEffect(() => {
    
    const fetchData = async () => {
        setLoading(true);
      try {
        const response = await Auditing(token, limit);
        setAuditData(response);
        setLoading(false)
      } catch (err) {
        alert(err)
        setError(true)
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
        <Header 
            className="px-4 py-6 border-b border-slate-800" // هنا تتحكم بالمسافات كما تشاء
            title="Audit Logs"
            description="Review recent system activities, track ticket status updates, and monitor user actions for security and compliance."
            icon={ShieldCheck}
            extraContent={
                <Button
                onClick={() => setLimit(prev => prev + 20)}
                className="bg-customButton text-slate-50 px-6 py-2 rounded-lg font-semibold transition hover:opacity-90"
                >
                Get More audits
                </Button>
            }
        />
      <div className="px-4 py-6 ">
        {auditData ? (
          <AuditTable data={auditData} />
        ) : (
          <p className="text-white">Loading...</p>
        )}
      </div>
    </div>
    
  );
};

export default AuditLogs;