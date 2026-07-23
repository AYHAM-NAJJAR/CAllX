// CallContext.js
import { createContext, useContext, useState } from "react";
import {
  startAgentInboundEngine,
  acceptIncomingCall,
  terminateOrRejectCall
} from "../../services/realtime/stomp/stopm";

import { toggleMicrophone } from "../../services/call/Livekit/livekitService";
import { CALL_STATUS } from "../../services/call/Livekit/livekitConstants";

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [incomingCalls, setIncomingCalls] = useState([]);
  const [activeCall, setActiveCall] = useState(null);
  const [room, setRoom] = useState(null);
  const [callStatus, setCallStatus] = useState(CALL_STATUS.IDLE);
  const [isMuted, setIsMuted] = useState(false);
  const [wsStatus, setWsStatus] = useState("Disconnected");
  const [agentEmail, setAgentEmail] = useState("");

  const initInboundEngine = (token, queueId, email) => {
    setAgentEmail(email);

    startAgentInboundEngine(
      token,
      queueId,
      email,
      (uiUpdate) => {
        const {
          status,
          callId,
          callerIdentity,
          room: livekitRoom,
          message,
          isWsConnected
        } = uiUpdate;

        console.log(`[Context Event]: ${message} -> Status: ${status}`);

        if (isWsConnected === true) setWsStatus("Connected");
        if (isWsConnected === false) setWsStatus("Disconnected");

        if (status) {
          setCallStatus(status);
        }

        // تم الإصلاح: تحديث الحالة إلى CONNECTED لتفعيل المايك في الواجهة
        if (livekitRoom) {
          setRoom(livekitRoom);
          setCallStatus(CALL_STATUS.CONNECTED); 
        }

        if (status === CALL_STATUS.RINGING) {
          const newCall = { callId, callerIdentity, status };
          addIncomingCall(newCall);
        }

        // التنظيف الشامل إذا فصل العميل
        if (
          [
            CALL_STATUS.DISCONNECTED,
            CALL_STATUS.FAILED,
            CALL_STATUS.ENDED,
            CALL_STATUS.REJECTED,
            CALL_STATUS.CANCELLED,
            CALL_STATUS.MISSED
          ].includes(status)
        ) {
          resetCallState();
        }
      }
    );
  };

  const handleAcceptCall = async (callId) => {
    const targetCall = incomingCalls.find((c) => c.callId === callId) || { callId };

    setActiveCall(targetCall);
    removeIncomingCall(callId);
    setCallStatus(CALL_STATUS.CONNECTING_TO_ROOM);

    await acceptIncomingCall(callId, agentEmail, (uiUpdate) => {
      if (uiUpdate.status) {
        setCallStatus(uiUpdate.status);
      }

      // تم الإصلاح: تفعيل حالة الاتصال عند استلام الغرفة
      if (uiUpdate.room) {
        setRoom(uiUpdate.room);
        setCallStatus(CALL_STATUS.CONNECTED);
      }

      // تنظيف الشاشة إذا فشل الاتصال أو فصل أثناء الرد
      if ([CALL_STATUS.FAILED, CALL_STATUS.DISCONNECTED, CALL_STATUS.ENDED, CALL_STATUS.CANCELLED].includes(uiUpdate.status)) {
        resetCallState();
      }
    });
  };

  const handleEndOrRejectCall = async () => {
    await terminateOrRejectCall(agentEmail, (uiUpdate) => {
      if (uiUpdate.status) {
        setCallStatus(uiUpdate.status);
      }
      resetCallState();
    });
  };

  const handleToggleMute = async () => {
    if (!room) return;

    const nextMuteState = !isMuted;
    await toggleMicrophone(room, !nextMuteState);
    setIsMuted(nextMuteState);
  };

  const addIncomingCall = (call) => {
    setIncomingCalls((prev) => {
      if (prev.some((c) => c.callId === call.callId)) return prev;
      return [...prev, call];
    });
  };

  const removeIncomingCall = (callId) => {
    setIncomingCalls((prev) => prev.filter((c) => c.callId !== callId));
  };

  // تم الإصلاح: مسح جميع المكالمات المعلقة لضمان اختفاء الواجهة
 const resetCallState = () => {
    setActiveCall(null);
    setRoom(null);
    setIsMuted(false);
    setIncomingCalls([]); 
    setCallStatus(CALL_STATUS.IDLE); // تأكد أن هذه تغير الحالة في الـ State
    
    // إضافي: فرض إعادة تصيير (Re-render) للواجهة إذا لزم الأمر
    console.log("UI Reset: All states cleared");
};

  const value = {
    incomingCalls,
    activeCall,
    room,
    callStatus,
    isMuted,
    wsStatus,
    agentEmail,
    initInboundEngine,
    handleAcceptCall,
    handleEndOrRejectCall,
    handleToggleMute,
    resetCallState
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = () => useContext(CallContext);