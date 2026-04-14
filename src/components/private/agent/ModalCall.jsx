import { useState } from 'react';
import Modal from 'react-modal';
import Button from '../../common/Button';
import ModalTicket from './ModalTicket';

// تأكد أن هذا السطر يعمل مع بنية ملفاتك، عادة يكون '#root'
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

function ModalCall({ isOpen, setIsOpen }) {
  const [showDepartments, setShowDepartments] = useState(false);
  const [isOpenTicket,setIsOpenTicket] = useState(false);
  return (
    <>
    <ModalTicket
      isOpenTicket={isOpenTicket}
      onClose={setIsOpenTicket}
    />

    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      className="outline-none w-full max-w-md mx-4"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-[#0b121d] rounded-[40px] overflow-hidden border border-gray-800 shadow-2xl relative">
        <div className="flex flex-col items-center pt-10 pb-6 px-6">
          
          {/* Avatar Section */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full border-2 border-blue-500 flex items-center justify-center bg-[#0f172a] shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.113a7.5 7.5 0 0 1 15-0.226" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#0b121d] rounded-full"></div>
          </div>

          {/* Customer Info */}
          <h2 className="text-white text-2xl font-bold mb-1">Customer</h2>
          <p className="text-gray-400 text-lg mb-6 font-medium">+95684455</p>

          {/* Ticket Badge */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 flex items-center gap-2 mb-8">
            <Button onClick={()=>setIsOpenTicket(true)} className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">
              This customer has a ticket
            </Button>
          </div>

          {/* Departments List (Animated) */}
          <div 
            className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${
              showDepartments ? "max-h-[300px] opacity-100 mb-6" : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-gray-500 text-[10px] font-black tracking-[0.2em] uppercase mb-4 px-2">
              Forward To
            </p>
            <div className="space-y-2">
              {["Support Team", "Sales Dept", "Technical Unit"].map((dept, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[#16202c] hover:bg-[#1e293b] rounded-2xl cursor-pointer group transition-colors border border-transparent hover:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center text-gray-400 group-hover:text-blue-400 transition-colors">
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6.75h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18" />
                      </svg>
                    </div>
                    <span className="text-gray-200 text-sm font-semibold">{dept}</span>
                  </div>
                  <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-gray-600 rotate-45 mr-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-[#111a27] p-5 flex items-center justify-between gap-3 border-t border-gray-800">
          <button
            onClick={() => setShowDepartments(!showDepartments)}
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-[24px] transition-all ${
              showDepartments ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#1c2633] text-gray-400 hover:bg-[#253041]"
            }`}
          >
           
            <span className="text-[9px] font-black uppercase tracking-widest">Forward</span>
          </button>

          <Button path={"/main/callroom"} className="flex-1 bg-green-500 hover:bg-green-400 text-white flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-[24px] transition-all shadow-lg shadow-green-500/20">
            
            <span className="text-[9px] font-black uppercase tracking-widest">Answer</span>
          </Button>

          <Button
            path={""}
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-[#1c2633] hover:bg-red-500/10 hover:text-red-500 text-gray-400 flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-[24px] transition-all"
          >
            
            <span className="text-[9px] font-black uppercase tracking-widest">Ignore</span>
          </Button>
        </div>

        {/* Animated Progress Bar at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-1 flex">
          <div className="bg-blue-500 w-1/3 h-full animate-pulse"></div>
          <div className="bg-blue-900/30 flex-1 h-full"></div>
        </div>
      </div>
    </Modal>
    </>
    
  );
}

export default ModalCall;