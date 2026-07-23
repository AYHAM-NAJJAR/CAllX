import React, { useState, useEffect, useRef } from "react";
import { CALL_STATUS } from "../../services/call/Livekit/livekitConstants";
import { endActiveOutboundCall, initiateOutboundCall } from "../../services/realtime/stomp/Stompmake";
import { useOutboundWS } from "./context/OutboundWSContext";


export default function MakeCall() {
  // 1. استدعاء حالة الاتصال مباشرة من الـ Context
  const { isConnected: isWsConnected } = useOutboundWS();
  const token = localStorage.getItem("Token");

  // 2. حالات التحكم في الواجهة (UI States) - أبقينا فقط على رقم الهاتف
  const [phoneNumber, setPhoneNumber] = useState("+96395589126324");
  const [callState, setCallState] = useState(CALL_STATUS.IDLE); 
  const [currentCallId, setCurrentCallId] = useState(null);
  const [uiMessage, setUiMessage] = useState("");
  
  // 3. حالات المؤقت (Timer)
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

  // 4. دالة التحديث للـ Call الحاصلة (بدون الحاجة لإدارة الـ WebSocket هنا)
  const handleUiUpdate = (update) => {
    console.log("📥 [UI UPDATE TRIGGERED] البيانات المستقبلة في الواجهة:", update);

    let inferredStatus = update.status;
    if (!inferredStatus && update.callId && update.room) {
      inferredStatus = CALL_STATUS.RINGING; 
    }

    if (inferredStatus) {
      setCallState(inferredStatus);
      
      if (inferredStatus === CALL_STATUS.IDLE || inferredStatus === "IDLE") {
        setTimerActive(false);
        setSeconds(0);
        setCurrentCallId(null);
      }
    }
    
    if (update.callId !== undefined) {
      setCurrentCallId(update.callId);
    }
    
    if (update.message) setUiMessage(update.message);
    
    if (update.startTimer) {
      setSeconds(0);
      setTimerActive(true);
    }
  };

  // 5. إجراءات أزرار التحكم بالمكالمة فقط
  const handleCall = () => {
    if (!phoneNumber) {
      alert("الرجاء إدخال رقم هاتف العميل");
      return;
    }
    setSeconds(0);
    initiateOutboundCall(phoneNumber, token, handleUiUpdate);
  };

  const handleHangUp = () => {
    endActiveOutboundCall(token, handleUiUpdate);
    setTimerActive(false);
  };

  // تحديد لون نقطة الحالة ديناميكياً
  const getDotColorClass = () => {
    if (!isWsConnected) return "bg-zinc-400"; 
    if (callState === "CONNECTED" || callState === CALL_STATUS.CONNECTED) return "bg-[#185FA5] animate-pulse"; 
    if (callState === CALL_STATUS.RINGING) return "bg-amber-600 animate-pulse"; 
    return "bg-[#0F6E56]"; 
  };

  return (
    <div className="flex justify-center p-5 font-sans" dir="rtl">
      <div className="w-full max-w-md bg-white border border-sky-300 rounded-xl overflow-hidden shadow-sm transition-all">
        
        {/* رأس اللوحة */}
        <div className="flex items-center gap-3 p-3.5 px-4 border-b border-black/10 bg-sky-600">
          <span className="text-[11px] font-medium py-0.5 px-2 rounded-full bg-sky-600 text-[#0C447C] tracking-wide">
            Agent
          </span>
          <h2 className="text-sm font-semibold text-zinc-800 m-0">
            لوحة تحكم الوكيل (الاتصال الصادر)
          </h2>
        </div>

        {/* جسم اللوحة */}
        <div className="p-4">
          
          {/* شريط حالة الاتصال التلقائي المستند للـ Context */}
          <div className="flex items-center gap-2 mb-4 p-2.5 px-3 bg-sky-600 rounded-lg border border-black/5">
            <div className={`w-2.5 h-2.5 rounded-full ${getDotColorClass()}`} />
            <span className="text-xs text-zinc-600 font-medium">
              {isWsConnected ? "متصل بخدمة الاتصال الصادر (Context)" : "جاري الاتصال بالسيرفر..."}
            </span>
          </div>

          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 mt-3 block">
            طلب مكالمة جديدة
          </div>

          {/* حقل إدخال رقم الهاتف فقط */}
          <div className="flex flex-col gap-1.5 mb-3">
            <label className="text-xs text-zinc-500 font-medium">رقم هاتف العميل المستهدف</label>
            <input 
              type="text" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              className="w-full p-2 text-sm bg-sky-600 border border-black/15 rounded-lg outline-none focus:border-[#185FA5] font-mono text-zinc-800 transition-colors text-left" 
              dir="ltr"
            />
          </div>

          <button 
            onClick={handleCall} 
            disabled={!isWsConnected || (callState !== CALL_STATUS.IDLE && callState !== "IDLE")}
            className="flex items-center justify-center w-full p-2.5 text-sm font-medium rounded-lg border border-black/15 bg-sky-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none transition-all cursor-pointer active:scale-[0.98]"
          >
            📞 إرسال طلب المكالمة الصادرة
          </button>

          {/* بطاقة المكالمة الديناميكية المحمية من التعليق */}
          {(callState === CALL_STATUS.RINGING || callState === "RINGING" || callState === "CONNECTED" || callState === CALL_STATUS.CONNECTED) && (
            <div className="bg-sky-600 border border-black/10 rounded-lg p-4 mt-4 text-center">
              <div className="text-[11px] text-zinc-400 uppercase tracking-widest mb-1.5 font-semibold">
                {(callState === CALL_STATUS.RINGING || callState === "RINGING") ? "جاري الاتصال والرنين عند العميل..." : "المكالمة متصلة الآن"}
              </div>
              <div className="text-2xl font-bold font-mono text-zinc-900 tracking-wider">
                {formatTime()}
              </div>
              {currentCallId && (
                <div className="text-[11px] font-mono text-zinc-500 mt-1 break-all" dir="ltr">
                  Call ID: {currentCallId}
                </div>
              )}
              
              <button 
                onClick={handleHangUp} 
                className="flex items-center justify-center w-full p-2.5 text-sm font-medium rounded-lg text-[#791F1F] bg-sky-600 border border-[#A32D2D] hover:bg-[#fbdada] transition-all cursor-pointer mt-3"
              >
                إنهاء الجلسة وفصل الخط 🛑
              </button>
            </div>
          )}

          {/* صندوق الإشعارات السفلي اللحظي */}
          {uiMessage && (
            <div className="mt-3 p-2.5 bg-sky-600 text-[#633806] rounded-md text-xs font-medium border border-amber-200/40">
              ℹ️ {uiMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}