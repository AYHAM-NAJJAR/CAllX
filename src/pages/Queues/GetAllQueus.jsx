// GetAllQueus.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // نستخدم هذا الهوك لمراقبة تغير مسار الصفحة
import { Layers, AlertCircle } from 'lucide-react';
import { useActiveQueues } from '../../hooks/useQueues';
import QueueCard from './components/QueueCard';

function GetAllQueus() {
  
  const token = localStorage.getItem('Token'); 
  const location = useLocation(); 
  
  const { data: queues, isLoading, isError, error, refetch } = useActiveQueues(token);

  
  useEffect(() => {
    refetch();
  }, [location.pathname, refetch]);

  return (
    <div className="bg-[#0F172A] min-h-screen text-white px-5 py-10 font-sans">
      {/* Container max-width للتنسيق */}
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-wrap justify-between items-center mb-10 gap-5">
          <div className="flex items-center gap-3.5">
            <div className="bg-[#0D9EF2]/10 p-3 rounded-xl flex items-center justify-center">
              <Layers size={32} className="text-[#0D9EF2]" />
            </div>
            <div>
              <h1 className="m-0 text-3xl font-bold tracking-tight">
                Support Queues
              </h1>
              <p className="m-0 text-slate-400 text-sm mt-1">
                Monitor and manage all active live ticketing support queues.
              </p>
            </div>
          </div>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-3 border-[#0D9EF2]/20 border-t-[#0D9EF2] rounded-full animate-spin" />
            <p className="text-slate-400 m-0 text-sm">Fetching active queues...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 flex items-center gap-3 text-red-500">
            <AlertCircle size={24} className="flex-shrink-0" />
            <div>
              <h4 className="m-0 font-semibold text-base">Failed to load queues</h4>
              <p className="m-0 text-sm text-red-300 mt-0.5">{error?.message || 'Something went wrong.'}</p>
            </div>
          </div>
        )}

        {/* Data Cards Grid */}
        {!isLoading && !isError && (
          <div>
            {queues && queues.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                {queues.map((queue) => (
                  <QueueCard key={queue.id} queue={queue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-5 bg-[#101B22] rounded-xl border border-dashed border-white/10">
                <p className="text-slate-400 m-0 text-base">No queues found active at the moment.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default GetAllQueus;