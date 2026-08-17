import React, { useState } from 'react';
import { useCalls } from '../../hooks/useCalls';
import CallCard from './components/CallCard';
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingCircle from '../../components/common/LoadingCircle';
import LoadingError from '../../components/common/LoadingError';
import Button from '../../components/common/Button';
import { Menu, Phone } from 'lucide-react';

function GetAllCalls() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const location = useLocation();
  const isSubCreate = location.pathname.includes("/main/calls/");
  const token = localStorage.getItem('Token');
  const GO = useNavigate();
  const { data, isLoading, isError, error, isFetching } = useCalls(token, page, pageSize);
  const context = useOutletContext() || {};
  const { toggleSidebar } = context;

  if (isLoading) {
    return <LoadingCircle Phrase={"Calls"} />;
  }

  if (isError) {
    return <LoadingError Phrase={"Calls"} />;
  }

  const calls = data?.calls || [];
  const pagination = data?.pagination || {};

  if (isSubCreate) {
    return <Outlet />;
  }

  return (
    <div className="p-4 sm:p-6 bg-[#0F172A] rounded-xl shadow-xl border border-slate-800 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
        
        {/* Left Side: Professional Menu Icon & Title */}
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Button 
            onClick={toggleSidebar} 
            className="p-2 sm:p-2.5   text-slate-300 hover:text-[#0D9EF2]  rounded-lg transition-all shrink-0 shadow-sm flex items-center justify-center"
            aria-label="Toggle Sidebar"
          >
            <Phone/>
          </Button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
              {t('getAllCalls.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1">
              {t('getAllCalls.subtitle')}
            </p>
          </div>
        </div>

        {/* Right Side: Status Badge & Action Button */}
        <div className="flex items-center justify-end w-full sm:w-auto gap-3 sm:gap-4">
          {isFetching && (
            <span className="text-[10px] sm:text-xs text-[#0D9EF2] bg-[#0D9EF2]/10 border border-[#0D9EF2]/20 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium animate-pulse shrink-0">
              {t('getAllCalls.updating')}
            </span>
          )}
          <Button
            path={`/main/calls/mycall`}
            className="w-full sm:w-auto bg-[#0D9EF2] hover:bg-blue-500 text-white px-4 py-2 sm:py-1.5 text-sm font-bold rounded-lg flex justify-center items-center shadow-lg shadow-[#0D9EF2]/20 transition-all"
          >
            {t('getAllCalls.myCall')}
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      {calls.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-[#101B22] border border-slate-800 rounded-xl text-slate-400 text-sm sm:text-base">
          {t('getAllCalls.noCalls')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {calls.map((call) => (
            <CallCard 
              key={call.callId} 
              call={call} 
              onClick={() => GO(`/main/calls/details/${call.callId}`)} 
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-800">
          
          <div className="text-xs sm:text-sm text-slate-400 text-center md:text-left">
            {t('getAllCalls.page')} <span className="font-semibold text-white">{(pagination.pageNumber || 0) + 1}</span> {t('getAllCalls.of')}{' '}
            <span className="font-semibold text-white">{pagination.totalPages}</span> ({t('getAllCalls.totalItems')}{' '}
            <span className="font-semibold text-white">{pagination.totalElements}</span>)
          </div>

          <div className="flex gap-2 sm:gap-3 w-full md:w-auto justify-center md:justify-end">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={pagination.isFirst}
              className="flex-1 md:flex-none px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#101B22] border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {t('getAllCalls.previous')}
            </button>

            <button
              onClick={() => setPage((prev) => (pagination.isLast ? prev : prev + 1))}
              disabled={pagination.isLast}
              className="flex-1 md:flex-none px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0D9EF2] rounded-lg hover:bg-[#0D9EF2]/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#0D9EF2]/10 transition-all"
            >
              {t('getAllCalls.next')}
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default GetAllCalls;