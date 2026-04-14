import React from 'react';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

const CallRoom = () => {
     const navigate = useNavigate();
    const goBack = () => {
    navigate("/main", { state: { from: "callroom" } });
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold tracking-widest text-slate-500">CALL ROOM</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 border border-emerald-500/50 rounded text-emerald-500 text-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Available
          </div>
          <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">?</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Active Caller Card */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
                <div>
                  <h2 className="text-lg font-bold">JOHN DOE</h2>
                  <p className="text-emerald-400 text-xs font-medium">Connected • 04:12</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-xs">Mute</button>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-xs">Hold</button>
                <Button onClick={goBack} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-xs font-bold">Hang Up</Button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-500 uppercase tracking-tighter">
              Call Center Pro | Agent ID: 4492-X
            </div>
          </div>

          {/* Ticket Form */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-sm tracking-wider">TICKET CREATOR</h3>
              <span className="text-xs text-slate-500">NEW INCIDENT</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Customer Name</label>
                <input type="text" defaultValue="JOHN DOE" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Phone</label>
                <input type="text" defaultValue="+1 (555) 0123-4567" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Category</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm focus:border-emerald-500 outline-none appearance-none">
                  <option>Billing Dispute</option>
                  <option>Technical Issue</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Priority</label>
                <div className="flex bg-slate-950 border border-slate-800 rounded p-1">
                  <button className="flex-1 py-1 text-xs text-slate-500">Low</button>
                  <button className="flex-1 py-1 text-xs bg-slate-800 rounded shadow">Medium</button>
                  <button className="flex-1 py-1 text-xs text-slate-500">High</button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Problem Description</label>
              <textarea rows="4" placeholder="Enter notes..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm focus:border-emerald-500 outline-none resize-none"></textarea>
            </div>

            <div className="mt-6">
              <label className="block text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Department</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm focus:border-emerald-500 outline-none appearance-none">
                <option>Finance & Accounting</option>
                <option>IT Support</option>
              </select>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="bg-emerald-600 hover:bg-emerald-500 px-8 py-2 rounded-lg font-bold text-sm transition-colors">
                Save Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* History */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-sm tracking-wider mb-6">INTERACTION HISTORY</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 shrink-0 bg-slate-800 rounded"></div>
                <div>
                  <p className="text-sm font-medium">Email Sent</p>
                  <p className="text-[10px] text-slate-500">Oct 12, 2023 • Service Update</p>
                </div>
              </div>
              <div className="flex gap-4 text-red-400">
                <div className="w-8 h-8 shrink-0 bg-red-950 rounded border border-red-900"></div>
                <div>
                  <p className="text-sm font-medium">Dropped Connection</p>
                  <p className="text-[10px] opacity-70">Aug 15, 2023 • Technical Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Health Stats */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-sm tracking-wider mb-6">INTERACTION HEALTH</h3>
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-slate-500 uppercase">Satisfaction Level</span>
                <span className="text-2xl font-black text-emerald-500">85%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-6 mb-6">
              <div className="text-center">
                <p className="text-xl font-bold">12</p>
                <p className="text-[10px] text-slate-500 uppercase">Total Calls</p>
                <p className="text-[10px] text-red-500">▼ -14%</p>
              </div>
              <div className="text-center border-l border-slate-800">
                <p className="text-xl font-bold">48</p>
                <p className="text-[10px] text-slate-500 uppercase">Live Chats</p>
                <p className="text-[10px] text-slate-400">STABLE</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border-l-4 border-sky-500">
              <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase">Internal Note</p>
              <p className="text-xs text-sky-400 leading-relaxed italic">
                "Known issue on v15.4. Check server-side logs for session handshake timeouts."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-900 flex flex-wrap gap-4 text-[10px] text-slate-600 uppercase tracking-widest">
        <span>System: Operational</span>
        <span>Latency: 12ms</span>
        <span>Pulse: Live</span>
      </div>
    </div>
  );
};

export default CallRoom;