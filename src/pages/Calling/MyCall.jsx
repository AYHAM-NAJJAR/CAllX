import React, { useState, useEffect, use } from 'react';
import { useTranslation } from 'react-i18next';
import { getParticipantCalls } from '../../services/call/core/getCallsForParticipant';
import { ArrowLeft, ClipboardClock } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

function MyCall() {
  const { t } = useTranslation();
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حالة التحكم بالصفحات (Pagination)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const pageSize = 10; // عدد العناصر في كل صفحة
  const GO =useNavigate();
  const token = localStorage.getItem('Token');
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const agentIdentity = user?.email;
    const context = useOutletContext() || {};
  const { toggleSidebar } = context;
  useEffect(() => {
    const fetchCalls = async () => {
      if (!token || !agentIdentity) {
        setError(t('myCall.missingAuth'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // التمرير الديناميكي لرقم الصفحة والحجم
        const responseData = await getParticipantCalls(token, agentIdentity, currentPage, pageSize);
        
        if (responseData && responseData.content) {
          setCalls(responseData.content);
          setTotalPages(responseData.totalPages || 0);
          setIsLastPage(responseData.last ?? (currentPage >= (responseData.totalPages - 1)));
        }
      } catch (err) {
        setError(err.message || t('myCall.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [token, agentIdentity, currentPage, t]);

  const handleNextPage = () => {
    if (!isLastPage && currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ENDED':
        return <span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">ENDED</span>;
      case 'CANCELLED':
        return <span className="bg-red-950/60 text-red-400 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">CANCELLED</span>;
      case 'ACCEPTED':
        return <span className="bg-emerald-950/60 text-emerald-400 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">ACCEPTED</span>;
      case 'RINGING':
        return <span className="bg-amber-950/60 text-amber-400 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide animate-pulse">RINGING</span>;
      default:
        return <span className="bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div 
        className="flex justify-center items-center h-64 text-white" 
        style={{ backgroundColor: '#0F172A' }} // primary
      >
        <div 
          className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" 
          style={{ borderColor: '#0D9EF2' }} // customButton
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div 
          className="p-4 rounded-xl text-red-400 text-center font-medium border border-red-950/40" 
          style={{ backgroundColor: '#101B22' }} // secondary
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-6 min-h-screen text-white font-sans ltr select-none"
      style={{ backgroundColor: '#0F172A' }} // primary
    >
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
      <div className="mb-8 border-b border-slate-800/60 pb-4">
  {/* زر التراجع */}
  <button 
    onClick={() => GO("/main/calls")}
    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-medium mb-4"
  >
    <ArrowLeft size={18} />
    <span>{t('myCall.backToCalls')}</span>
  </button>

  {/* الأيقونة والعنوان */}
  <div className="flex items-center gap-3">
    <div onClick={toggleSidebar}>
      <ClipboardClock   className="cursor-pointer w-7 h-7 text-slate-300 shrink-0" />
    </div>
    
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{t('myCall.title')}</h1>
      <p className="text-xs text-slate-400 mt-0.5">{t('myCall.subtitle')}</p>
    </div>
  </div>
</div>

        {/* Content Section */}
        {calls.length === 0 ? (
          <div 
            className="p-12 text-center rounded-2xl text-slate-400 border border-slate-800/40"
            style={{ backgroundColor: '#101B22' }} // secondary
          >
            {t('myCall.noRecords')}
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {calls.map((call) => (
                <div 
                  key={call.callId} 
                  className="p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-200 hover:border-slate-700 border border-slate-800/40 shadow-sm"
                  style={{ backgroundColor: '#101B22' }} // secondary
                >
                  {/* Identity info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-sm md:text-base tracking-wide text-slate-100">
                        {call.callerIdentity}
                      </span>
                      <span className="text-slate-500 text-xs">➔</span>
                      <span className="font-semibold text-sm md:text-base tracking-wide text-slate-100">
                        {call.calleeIdentity}
                      </span>
                      {getStatusBadge(call.status)}
                    </div>
                    <p className="text-xs text-slate-400">
                      {t('myCall.createdAt')}: {new Date(call.createdAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>

                  {/* Additional metrics info */}
                  <div className="flex items-center gap-8 text-sm text-slate-300 w-full md:w-auto justify-between md:justify-end border-t border-slate-800/40 md:border-0 pt-3 md:pt-0">
                    <div className="min-w-[80px]">
                      <span className="text-xs text-slate-500 block font-medium uppercase tracking-wider mb-0.5">{t('myCall.duration')}</span>
                      <span className="font-mono">
                        {call.durationSeconds ? t('myCall.durationSeconds', { seconds: call.durationSeconds }) : '—'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block font-medium uppercase tracking-wider mb-0.5">{t('myCall.agent')}</span>
                      <span className="text-xs font-mono text-slate-400 bg-slate-900/40 px-2 py-0.5 rounded border border-slate-800/30">
                        {call.agentIdentity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800/60">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  currentPage === 0
                    ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95'
                }`}
              >
                {t('myCall.previous')}
              </button>

              <span className="text-xs font-mono text-slate-400">
                {t('myCall.pageInfo', { current: currentPage + 1, total: totalPages || 1 })}
              </span>

              <button
                onClick={handleNextPage}
                disabled={isLastPage || currentPage >= totalPages - 1}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isLastPage || currentPage >= totalPages - 1
                    ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95'
                }`}
              >
                {t('myCall.next')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyCall;