import React, { useState, useEffect, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import { 
  PhoneCall, 
  X, 
  User, 
  Building2, 
  Hash,
  PhoneOff,
  Activity
} from 'lucide-react';
import { useOutboundWS } from './context/OutboundWSContext';
import { CALL_STATUS } from '../../services/call/Livekit/livekitConstants';
import { endActiveOutboundCall, initiateOutboundCall } from '../../services/realtime/stomp/Stompmake';

const FloatingMakeCall = ({ onClose, number }) => {
  // ==========================================
  // 1. المنطق البرمجي (Business Logic)
  // ==========================================
  
  const nodeRef = useRef(null);
  
  // استدعاء حالة الاتصال مباشرة من الـ Context
  const { isConnected: isWsConnected } = useOutboundWS();
  const token = localStorage.getItem("Token");

  // حالات التحكم في الواجهة (UI States)
  const [phoneNumber, setPhoneNumber] = useState(number);
  const [callState, setCallState] = useState(CALL_STATUS.IDLE); 
  const [currentCallId, setCurrentCallId] = useState(null);
  const [uiMessage, setUiMessage] = useState("");
  
  // حالات المؤقت (Timer)
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // إدارة العداد (Timer)
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  // تنسيق الوقت ليظهر بشكل 00:00
  const formatTime = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // دالة التحديث للـ Call الحاصلة من WebSocket
  const handleUiUpdate = useCallback((update) => {
    console.log("🔥 HANDLE UI UPDATE", update);

    let inferredStatus = update.status;

    if (!inferredStatus && update.callId && update.room) {
        inferredStatus = CALL_STATUS.RINGING;
    }

    if (inferredStatus) {
        setCallState(inferredStatus);

        // في حال إرجاع السيرفر حالة IDLE أو DISCONNECTED أو ENDED
        if (
          inferredStatus === CALL_STATUS.IDLE || 
          inferredStatus === "IDLE" || 
          inferredStatus === "DISCONNECTED" || 
          inferredStatus === "ENDED"
        ) {
            setTimerActive(false);
            setSeconds(0);
            setCurrentCallId(null);
            setCallState(CALL_STATUS.IDLE);
        }
    }

    if (update.callId !== undefined)
        setCurrentCallId(update.callId);

    if (update.message)
        setUiMessage(update.message);

    if (update.startTimer) {
        setSeconds(0);
        setTimerActive(true);
    }

  }, []);

  // إجراءات أزرار التحكم بالمكالمة
  const handleCall = () => {
    if (!phoneNumber) {
      alert("الرجاء إدخال رقم هاتف العميل");
      return;
    }
    setSeconds(0);
    initiateOutboundCall(phoneNumber, token, handleUiUpdate);
  };

  const handleHangUp = () => {
    // إرسال أمر إنهاء المكالمة إلى Back-end / STOMP
    endActiveOutboundCall(token, handleUiUpdate);

    // إعادة ضبط الحالات المحلية فوراً
    setTimerActive(false);
    setSeconds(0);
    setCallState(CALL_STATUS.IDLE);
    setCurrentCallId(null);

    // إن كنت تريد إغلاق النافذة العائمة كلياً فور إنهاء المكالمة:
    if (onClose) {
      onClose();
    }
  };

  // تحديد لون نقطة الحالة ديناميكياً
  const getDotColorClass = () => {
    if (!isWsConnected) return "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"; 
    if (callState === "CONNECTED" || callState === CALL_STATUS.CONNECTED || callState === "ACCEPTED") 
        return "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"; 
    if (callState === CALL_STATUS.RINGING || callState === "RINGING") 
        return "bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"; 
    return "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"; 
  };

  const isCallActive = 
    callState === CALL_STATUS.RINGING || 
    callState === "RINGING" || 
    callState === "CONNECTED" || 
    callState === CALL_STATUS.CONNECTED || 
    callState === "ACCEPTED";


  // ==========================================
  // 2. واجهة المستخدم (UI Rendering)
  // ==========================================
  return (
    <Draggable nodeRef={nodeRef} handle=".drag-header" bounds="body">
      <div
        ref={nodeRef}
        className="fixed z-50 w-[340px] bg-[#0b1329] text-white rounded-3xl shadow-2xl border border-slate-800/80 p-5 font-sans overflow-hidden select-none"
        style={{ bottom: '40px', right: '40px' }}
      >
        {/* Drag Handle & Close */}
        <div className="drag-header cursor-move w-full flex items-center justify-between py-1 -mt-1 mb-3">
          <div className="w-12 h-1 bg-slate-700/60 rounded-full " />
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header Title & WS Status */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Make a Call</h3>
              <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${getDotColorClass()}`}></span>
                {isWsConnected ? "Server Connected" : "Connecting..."}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Body: Idle vs Active Call */}
        {!isCallActive ? (
          <>
            {/* Input Field */}
            <div className="relative mb-4">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number..."
                dir="ltr"
                className="w-full bg-slate-900/80 border border-slate-800/80 rounded-2xl py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
              />
              <Hash className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>

            {/* Action Button (Start Call) */}
            <div className="mt-4 pt-2 border-t border-slate-800/50">
              <button 
                onClick={handleCall}
                disabled={!isWsConnected}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
              >
                <PhoneCall className="w-4 h-4 fill-current" />
                <span>START CALL</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Active Call UI */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mt-2 text-center flex flex-col items-center">
              <Activity className="w-8 h-8 text-emerald-400 mb-2 animate-pulse" />
              
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-semibold">
                {(callState === CALL_STATUS.RINGING || callState === "RINGING") 
                  ? "Ringing Customer..." 
                  : "Call Connected"}
              </div>
              
              <div className="text-4xl font-bold font-mono text-white tracking-wider mb-2">
                {formatTime()}
              </div>
              
              <div className="text-[11px] font-mono text-emerald-400/80 mt-1">
                {phoneNumber}
              </div>
              
              {currentCallId && (
                <div className="text-[9px] font-mono text-slate-500 mt-2 break-all px-4">
                  ID: {currentCallId}
                </div>
              )}
            </div>

            {/* Action Button (Hang Up) */}
            <div className="mt-4 pt-2 border-t border-slate-800/50">
              <button 
                onClick={handleHangUp}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/20"
              >
                <PhoneOff className="w-4 h-4" />
                <span>HANG UP</span>
              </button>
            </div>
          </>
        )}

        {/* UI Messages Toast */}
        {uiMessage && (
          <div className="mt-3 p-2 bg-slate-800/80 text-amber-400 rounded-xl text-[10px] text-center font-medium border border-amber-500/20">
            {uiMessage}
          </div>
        )}

        {/* Bottom Decorative Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
          <div className={`h-full w-1/3 rounded-r-full transition-colors duration-300 ${
            isCallActive ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
        </div>
      </div>
    </Draggable>
  );
};

export default FloatingMakeCall;