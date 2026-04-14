import React from 'react';
import Modal from 'react-modal'; 
import Button from '../../common/Button';

const ModalTicket = ({ isOpenTicket, onClose }) => {
  return (
    <Modal
      isOpen={isOpenTicket}
      onRequestClose={onClose}
      // تنسيق الطبقة الخلفية (الشفافة)
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]"
      // تنسيق حاوية المودال نفسها
      className=" outline-4 ring-white  w-full max-w-2xl mx-4 relative"
    >
      <div className="bg-[#0d1117] text-gray-300 rounded-xl border border-gray-800 shadow-2xl overflow-hidden font-sans">
        
        <div className="p-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-blue-400 text-xs font-bold tracking-widest">TICKET #TK-8824</span>
                <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-500/20 uppercase font-bold">
                  In Progress
                </span>
              </div>
              <h2 className="text-white text-2xl font-bold leading-tight mt-1">
                Technical Issue: Database Connection Timeout
              </h2>
            </div>
            <span className="bg-red-500/10 text-red-500 text-[10px] px-3 py-1 rounded-full border border-red-500/20 font-black tracking-tighter">
              High Priority
            </span>
          </div>

          {/* Customer & Dept Info */}
          <div className="grid grid-cols-2 gap-0 py-6 border-y border-gray-800/50 mb-6">
            <div className="flex items-center gap-4 pr-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex-shrink-0 border border-gray-700"></div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-0.5">Customer</p>
                <p className="text-sm font-bold text-gray-100 italic">Jane Doe</p>
                <p className="text-[11px] text-gray-500">+1 (555) 012-3456</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-l border-gray-800/80 pl-8">
              <div className="w-10 h-10 rounded bg-blue-500/5 flex items-center justify-center border border-blue-500/10">
                <div className="w-4 h-4 border-2 border-blue-500/40 rounded-sm"></div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-0.5">Assigned Department</p>
                <p className="text-sm font-bold text-gray-100">Technical Support (Tier 2)</p>
                <p className="text-[11px] text-gray-500 text-blue-400/80">Estimated Response: 15m</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                Problem Description
              </h3>
              <span className="text-[10px] text-gray-600 font-mono tracking-tighter">CATEGORY: DATABASE / TECHNICAL</span>
            </div>
            <div className="bg-[#161b22] p-6 rounded-xl border border-gray-800/50 leading-relaxed">
              <p className="text-[13px] text-gray-400 mb-4">
                The customer reports consistent connection timeouts when attempting to sync their local database with the cloud environment. This happens specifically during peak hours (09:00 - 11:00 EST).
              </p>
              <p className="text-[13px] text-gray-400 italic border-l-2 border-blue-500/30 pl-4">
                Initial diagnostics show latency spikes in the US-EAST-1 region. Logs indicate 'Error 504: Gateway Timeout' occurring frequently. 
              </p>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
              <span>Last updated 12 mins ago</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
              <span>Agent: Mark Sullivan</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-[#090c10] px-8 py-5 flex justify-between items-center border-t border-gray-800">
          <button className="bg-[#21262d] hover:bg-[#30363d] text-gray-200 text-[11px] font-bold uppercase tracking-widest py-2.5 px-6 rounded-lg transition-all border border-gray-700 active:scale-95">
            View History
          </button>
          <Button 
            onClick={onClose}
            className="text-gray-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors"
          >
            Close Ticket
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalTicket;