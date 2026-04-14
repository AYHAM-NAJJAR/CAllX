import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import timer from "../../../assets/timer.png"
import Button from '../../common/Button';
Modal.setAppElement('#root');

const labelStyle = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2";
const inputStyle = "w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-sky-500 transition-colors focus:ring-1 focus:ring-sky-500/20";

function ModalWrapUp({ isOpen, setIsOpen }) {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!isOpen) return;


    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      setTimeLeft(30); 
    };
  }, [isOpen]); 
  const formatTime = (seconds) => {
    const s = seconds < 10 ? `0${seconds}` : seconds;
    return `00 : ${s}`;
  };

  // Calculates progress bar percentage
  const progressWidth = (timeLeft / 30) * 100;
  // --- Timer Logic End ---

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      className=" w-full max-w-4xl mx-auto my-auto  outline-none rounded self-center "
      overlayClassName="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div className="flex flex-col md:flex-row w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Left Sidebar: Timer Section */}
        <div className="w-full md:w-1/3 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50">
          <div className="w-20 h-20 transition-all duration-300 animate-pulse  bg-sky-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-sky-500/20">
            <img src={timer} />
          </div>
          
          <h2 className="text-xl font-bold text-slate-100">After Call Work</h2>
          <p className="text-[10px] tracking-[0.2em] text-slate-500 uppercase mt-1 mb-8">ACW Timer</p>
          
          <div className={`text-6xl font-black tracking-tighter mb-4 tabular-nums transition-colors duration-500 ${timeLeft <= 5 ? 'text-red-500' : 'text-sky-500'}`}>
            {formatTime(timeLeft)}
          </div>
          
          <p className="text-center text-xs text-slate-400 leading-relaxed px-4 mb-8">
            Please complete the ticket summary before the timer expires.
          </p>
          
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_12px_rgba(14,165,233,0.5)]" 
              style={{ 
                width: `${progressWidth}%`,
                backgroundColor: timeLeft <= 5 ? '#ef4444' : '#0ea5e9' 
              }}
            ></div>
          </div>
        </div>

        {/* Right Section: Ticket Summary Form */}
        <div className="w-full md:w-2/3 p-4 bg-slate-900">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-emerald-500/20 flex flex-col justify-center gap-0.5 p-1 rounded">
                <div className="h-0.5 w-full bg-emerald-500"></div>
                <div className="h-0.5 w-3/4 bg-emerald-500"></div>
                <div className="h-0.5 w-full bg-emerald-500"></div>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Ticket Summary</h3>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 bg-slate-800 px-3 py-1 rounded-full uppercase ring-1 ring-white/5">
              Wrap-up Phase
            </span>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelStyle}>Customer Name</label>
                <input type="text" defaultValue="Sarah Jenkins" className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Category</label>
                <select className={`${inputStyle} appearance-none cursor-pointer`}>
                  <option>Technical Support</option>
                  <option>Billing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelStyle}>Phone Number</label>
                <input type="text" defaultValue="+1 202 555 0109" className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Priority</label>
                <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
                  {['Low', 'Medium', 'High'].map((p) => (
                    <button 
                      key={p}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        p === 'Medium' 
                        ? 'bg-sky-500/10 text-sky-500 ring-1 ring-sky-500/50' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className={labelStyle}>Department / Destination</label>
              <input type="text" defaultValue="Tier 2 Engineering" className={inputStyle} />
            </div>

            <div>
              <label className={labelStyle}>Problem Description</label>
              <textarea 
                rows="3" 
                className={`${inputStyle} leading-relaxed resize-none h-28`}
                defaultValue="Customer reported intermittent connectivity issues with the API gateway. Confirmed latency spikes from their region."
              />
            </div>

            <div>
              <label className={labelStyle}>Note</label>
              <input type="text" placeholder="Add a quick note..." className={inputStyle} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-end gap-6">
            <button 
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold text-slate-500 hover:text-slate-300 transition-colors"
            >
              Skip Wrap-up
            </button>
            <Button path={"/main"} className="bg-sky-500 hover:bg-sky-400 px-8 py-3 rounded-2xl font-bold text-sm text-white shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
              Save & Go Ready
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalWrapUp;