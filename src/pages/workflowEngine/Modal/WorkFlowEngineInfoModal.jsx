import { ArrowDown, Network, X } from 'lucide-react';
import React from 'react'
import Modal from 'react-modal';

function WorkFlowEngineInfoModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none w-full max-w-md"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 p-4"
    >
      <div className="bg-[#111726] border border-slate-800/80 rounded-xl p-6 flex flex-col relative shadow-2xl ">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="w-full flex items-center gap-2 mb-6 border-b border-slate-800/60 pb-4">
          <Network className="w-4 h-4 text-slate-400" />
          <h2 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Logic Preview & Guide</h2>
        </div>

        {/* The Exact Visual Flow Chart Maintained */}
        <div className="flex flex-col items-center justify-center w-full my-4">
          <div className="w-full max-w-[200px] border border-emerald-500/30 bg-emerald-500/5 px-4 py-2.5 rounded-lg text-center shadow-lg shadow-emerald-950/20">
            <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Condition</span>
          </div>
          
          <div className="h-10 w-px bg-slate-700 flex items-center justify-center relative">
            <div className="absolute top-1/2 -translate-y-1/2 bg-[#1A2333] border border-slate-700 rounded-full p-0.5">
              <ArrowDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="w-full max-w-[200px] border border-indigo-500/30 bg-indigo-500/5 px-4 py-2.5 rounded-lg text-center shadow-lg shadow-indigo-950/20">
            <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Action</span>
          </div>
        </div>

        {/* Brief & Comprehensive English Guide */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-3 text-left">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">How it works:</h3>
          
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside bg-[#090D16] p-3 rounded-lg border border-slate-800/40">
            <li><strong className="text-emerald-400">Evaluation (IF):</strong> Every inbound or updated ticket is scanned against your specified criteria sequentially.</li>
            <li><strong className="text-indigo-400">Execution (THEN):</strong> If all active conditions return <code className="text-slate-400 bg-slate-800 px-1 rounded">true</code>, the engine instantly triggers the mapped mutations.</li>
            <li><strong className="text-amber-400">Priority Weight:</strong> Rules execute based on their priority tier numerical order to prevent pipeline conflicts.</li>
          </ul>
        </div>

        

      </div>
    </Modal>
  )
}

export default WorkFlowEngineInfoModal;