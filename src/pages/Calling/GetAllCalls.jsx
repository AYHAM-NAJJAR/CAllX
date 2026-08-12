import React, { useState } from 'react';
import { useCalls } from '../../hooks/useCalls';
import CallCard from './components/CallCard';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import LoadingCircle from '../../components/common/LoadingCircle';
import LoadingError from '../../components/common/LoadingError';
import Button from '../../components/common/Button';
function GetAllCalls() {
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const location = useLocation();
    const isSubCreate = location.pathname.includes("/main/calls/");
  const token = localStorage.getItem('Token');
  const GO =  useNavigate();
  const { data, isLoading, isError, error, isFetching } = useCalls(token, page, pageSize);
  
   if (isLoading) {
    return <LoadingCircle Phrase={"Calls"} />;
  }

  if (isError) {
    return <LoadingError Phrase={"Calls"} />;
  }

  const calls = data?.calls || [];
  const pagination = data?.pagination || {};
   if (isSubCreate) {
    return <Outlet/>
  }
  return (
    <div className="p-6 bg-[#0F172A] rounded-xl shadow-xl border border-slate-800 text-slate-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Call Logs</h2>
          <p className="text-xs text-slate-400 mt-1">Manage and view all incoming/outgoing calls</p>
        </div>
        <Button
        path={`/main/calls/mycall`}
        className="bg-customButton hover:bg-blue-500 text-white px-4 py-1 font-bold rounded-lg"
        >
          My Call
        </Button>
        {isFetching && (
          <span className="text-xs text-[#0D9EF2] bg-[#0D9EF2]/10 border border-[#0D9EF2]/20 px-3 py-1 rounded-full font-medium animate-pulse">
            Updating...
          </span>
        )}
      </div>

      {/* Cards Grid */}
      {calls.length === 0 ? (
        <div className="p-12 text-center bg-[#101B22] border border-slate-800 rounded-xl text-slate-400">
          No calls recorded at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calls.map((call) => (
            <CallCard key={call.callId} call={call} onClick={()=>GO(`/main/calls/details/${call.callId}`)} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Page <span className="font-semibold text-white">{(pagination.pageNumber || 0) + 1}</span> of{' '}
            <span className="font-semibold text-white">{pagination.totalPages}</span> (Total Items:{' '}
            <span className="font-semibold text-white">{pagination.totalElements}</span>)
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={pagination.isFirst}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#101B22] border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            <button
              onClick={() => setPage((prev) => (pagination.isLast ? prev : prev + 1))}
              disabled={pagination.isLast}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0D9EF2] rounded-lg hover:bg-[#0D9EF2]/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#0D9EF2]/10 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetAllCalls;