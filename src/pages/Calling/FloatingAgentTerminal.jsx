import React, { useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { 
  User, 
  Ticket, 
  ChevronRight, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Building2, 
  Users, 
  Headphones,
  Mail,
  Hash
} from 'lucide-react';
import { useCall } from '../../context/Call/CallContext';
import { CALL_STATUS } from '../../services/call/Livekit/livekitConstants';

import ringtoneAudioFile from '../../assets/universfield-ringtone-085-496369.mp3';

const FloatingAgentTerminal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    incomingCalls,
    activeCall,
    callStatus,
    isMuted,
    currentCustomer,
    handleAcceptCall,
    handleEndOrRejectCall,
    handleToggleMute,
  } = useCall();


  console.group("🔎 [FloatingAgentTerminal Debugging]");
  console.log("1. callStatus:", callStatus);
  console.log("2. currentCustomer:", currentCustomer);
  console.log("3. incomingCalls:", incomingCalls);
  console.table(incomingCalls);
  console.groupEnd();

  const nodeRef = useRef(null);
  const ringtoneRef = useRef(null);

  const stopAudioPlayback = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (!ringtoneRef.current) {
      ringtoneRef.current = new Audio(ringtoneAudioFile);
      ringtoneRef.current.loop = true;
    }

    const ringtone = ringtoneRef.current;
    const isRinging = callStatus === CALL_STATUS.RINGING && incomingCalls.length > 0 && currentCustomer;

    if (isRinging) {
      ringtone.play().catch((error) => {
        console.warn("Ringtone autoplay was prevented by browser policy:", error);
      });
    } else {
      stopAudioPlayback();
    }

    return () => {
      stopAudioPlayback();
    };
  }, [callStatus, incomingCalls, currentCustomer]);

  // 🟢 شرط صارم للتحقق من وجود مكالمة نشطة حقاً (يتم إخفاؤها فوراً إذا ألغى العميل أو انتهت)
  const isCallActiveState = 
    callStatus !== CALL_STATUS.IDLE &&
    callStatus !== CALL_STATUS.CANCELLED &&
    callStatus !== CALL_STATUS.ENDED &&
    callStatus !== CALL_STATUS.DISCONNECTED;

  const hasValidData = 
    (incomingCalls && incomingCalls.length > 0) || 
    currentCustomer || 
    activeCall;

  const hasLiveCall = isCallActiveState && hasValidData;

  const isInCallRoom = location.pathname.includes('/main/call-room');

  const onAnswerClick = () => {
    stopAudioPlayback();

    if (incomingCalls[0]?.callId) {
      handleAcceptCall(incomingCalls[0].callId);
    }
    navigate('/main/call-room', { 
    state: { 
      customerEmail: currentCustomer?.email,
      customerUserId: currentCustomer?.userId,
      customerPhone: currentCustomer?.phone,
      customerTenantId: currentCustomer?.tenantId
    } 
  });
  };

  const onEndCallClick = () => {
    stopAudioPlayback();
    handleEndOrRejectCall();
  };

  useHotkeys('1', () => {
    if (callStatus === CALL_STATUS.RINGING && incomingCalls.length > 0) {
      onAnswerClick();
    }
  }, { enableOnFormTags: false });

  useHotkeys('2', () => {
    if (callStatus === CALL_STATUS.CONNECTED) {
      handleToggleMute();
    }
  }, { enableOnFormTags: false });

  useHotkeys('3', () => {
    if (hasLiveCall) {
      onEndCallClick();
    }
  }, { enableOnFormTags: false });

  // إذا لم تكن هناك مكالمة حقيقية أو بيانات صالحة، أو كنا داخل غرفة المكالمة، يتم إخفاء النافذة تماماً وإيقاف الصوت
  if (!hasLiveCall || !currentCustomer || isInCallRoom) {
    stopAudioPlayback();
    return null;
  }

  // 🟢 استخراج البيانات بشكل آمن ومرن تماماً لمنع أخطاء الـ Undefined
  const activeCallData = incomingCalls[0] || {};
  
  const displayPhone = activeCallData.callerIdentity || currentCustomer?.phone || "+95684455";
  const displayEmail = currentCustomer?.email || "غير متوفر";
  
  const userIdVal = currentCustomer?.userId || activeCallData.customer?.userId;
  const displayUserId = userIdVal ? `ID: ${userIdVal}` : "";
  
  const tenantIdVal = currentCustomer?.tenantId || activeCallData.customer?.tenantId || "1";

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-header" bounds="body">
      <div
        ref={nodeRef}
        className="fixed z-50 w-[360px] bg-[#0b1329] text-white rounded-3xl shadow-2xl border border-slate-800/80 p-5 font-sans overflow-hidden select-none"
        style={{ bottom: '40px', left: '40px' }}
      >
        <div className="drag-header cursor-move w-full flex justify-center py-1 -mt-2 mb-2">
          <div className="w-12 h-1 bg-slate-700/60 rounded-full" />
        </div>

        <div className="flex flex-col items-center justify-center mt-2 mb-4">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full border-2 border-cyan-500/80 flex items-center justify-center bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <User className="w-9 h-9 text-cyan-400" />
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0b1329] rounded-full" />
          </div>

          <h2 className="text-xl font-semibold text-slate-100 tracking-wide font-mono">
            {displayPhone}
          </h2>

          <div className="flex flex-col items-center gap-1 mt-1">
            <p className="text-xs text-cyan-400 font-mono flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {displayEmail}
            </p>
            {displayUserId && (
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <Hash className="w-3 h-3" /> {displayUserId} | Tenant: {tenantIdVal}
              </p>
            )}
          </div>

          <button className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-[11px] font-medium text-cyan-400 hover:bg-cyan-900/50 transition-colors">
            <Ticket className="w-3.5 h-3.5" />
            <span>THIS CUSTOMER HAS A TICKET</span>
          </button>
        </div>

        <div className="my-5">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-2 px-1">
            FORWARD TO
          </span>
          <div className="space-y-1.5">
            <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/40 text-slate-300 text-xs transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-medium">Department 1</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>

            <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/40 text-slate-300 text-xs transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-medium">Department 2</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>

            <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/40 text-slate-300 text-xs transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400">
                  <Headphones className="w-4 h-4" />
                </div>
                <span className="font-medium">Department 3</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>
          </div>
        </div>

        {callStatus === CALL_STATUS.RINGING && incomingCalls.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 mt-4 pt-2 border-t border-slate-800/50">
            <button className="flex flex-col items-center justify-center py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors">
              <PhoneCall className="w-4 h-4 rotate-45 mb-1 text-slate-400" />
              <span className="text-[10px] font-bold tracking-wider">FORWARD</span>
            </button>

            <button 
              onClick={onAnswerClick}
              className="flex flex-col items-center justify-center py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold transition-colors shadow-lg shadow-emerald-500/20"
            >
              <PhoneCall className="w-4 h-4 mb-1 fill-current" />
              <span className="text-[10px] font-bold tracking-wider">ANSWER</span>
            </button>

            <button 
              onClick={onEndCallClick}
              className="flex flex-col items-center justify-center py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              <PhoneOff className="w-4 h-4 mb-1 text-slate-400" />
              <span className="text-[10px] font-bold tracking-wider">IGNORED</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-slate-800/50">
            <button 
              onClick={handleToggleMute}
              disabled={callStatus !== CALL_STATUS.CONNECTED}
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl border text-xs font-bold transition-colors ${
                isMuted 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
            </button>

            <button 
              onClick={onEndCallClick}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/20"
            >
              <PhoneOff className="w-4 h-4" />
              <span>HANG UP</span>
            </button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
          <div className="h-full bg-cyan-500 w-1/3 rounded-r-full" />
        </div>
      </div>
    </Draggable>
  );
};

export default FloatingAgentTerminal;