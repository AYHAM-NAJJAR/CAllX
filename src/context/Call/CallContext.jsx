// CallContext.js
import { createContext, useContext, useState } from "react";
import {
  startAgentInboundEngine,
  acceptIncomingCall,
  terminateOrRejectCall
} from "../../services/realtime/stomp/stopm"; // تم التأكد من الاسم المعياري stomp

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
  const [agentEmail, setAgentEmail] = useState(""); // تخزين الهوية داخلياً لتغذية أوامر الحركة

  /**
   * دالة تهيئة المحرك واستقبال الأحداث العامة من الـ WebSocket
   */
  const initInboundEngine = (token, queueId, email) => {
    // حفظ بريد الوكيل في الـ State لاستخدامه في أزرار القبول والإنهاء
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

        // 1. تحديث حالة اتصال الـ WebSocket
        if (isWsConnected === true) setWsStatus("Connected");
        if (isWsConnected === false) setWsStatus("Disconnected");

        // 2. تحديث الحالة العامة للمكالمة في الـ UI
        if (status) {
          setCallStatus(status);
        }

        // 3. تخزين الـ Room الخاص بـ LiveKit عند الاتصال بنجاح
        if (livekitRoom) {
          setRoom(livekitRoom);
        }

        // 4. التعامل مع حالة الرنين الوارد (RINGING)
        if (status === CALL_STATUS.RINGING) {
          const newCall = {
            callId,
            callerIdentity,
            status
          };
          addIncomingCall(newCall);
        }

        // 5. التنظيف الشامل عند إنهاء المكالمة من أي طرف أو فشلها
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
          const idToRemove = callId || activeCall?.callId;
          if (idToRemove) {
            removeIncomingCall(idToRemove);
          }
          resetCallState();
        }
      }
    );
  };

  /**
   * دالة قبول المكالمة (Accept Call)
   */
  const handleAcceptCall = async (callId) => {
    const targetCall = incomingCalls.find((c) => c.callId === callId) || { callId };

    setActiveCall(targetCall);
    removeIncomingCall(callId);

    // تم الإصلاح: تمرير الـ agentEmail المحفوظ كمعامل ثانٍ ليتوافق مع توقيع المحرك المحدث
    await acceptIncomingCall(callId, agentEmail, (uiUpdate) => {
      if (uiUpdate.status) {
        setCallStatus(uiUpdate.status);
      }

      if (uiUpdate.room) {
        setRoom(uiUpdate.room);
      }

      if ([CALL_STATUS.FAILED, CALL_STATUS.DISCONNECTED].includes(uiUpdate.status)) {
        resetCallState();
      }
    });
  };

  /**
   * دالة إنهاء المكالمة النشطة أو رفضها (Hang Up / Reject)
   */
  const handleEndOrRejectCall = async () => {
    // تم الإصلاح: تمرير الـ agentEmail كمعامل أول للمحرك ليتطابق مع بنية السيرفر المحدثة
    await terminateOrRejectCall(agentEmail, (uiUpdate) => {
      if (uiUpdate.status) {
        setCallStatus(uiUpdate.status);
      }
      resetCallState();
    });
  };

  /**
   * دالة التحكم بكتم الصوت (Mute / Unmute)
   */
  const handleToggleMute = async () => {
    if (!room) return;

    const nextMuteState = !isMuted;
    await toggleMicrophone(room, !nextMuteState); // true تعني الميكروفون مفتوح، false تعني مكتوم
    setIsMuted(nextMuteState);
  };

  const addIncomingCall = (call) => {
    setIncomingCalls((prev) => {
      const exists = prev.some((c) => c.callId === call.callId);
      if (exists) return prev;
      return [...prev, call];
    });
  };

  const removeIncomingCall = (callId) => {
    setIncomingCalls((prev) => prev.filter((c) => c.callId !== callId));
  };

  const resetCallState = () => {
    setActiveCall(null);
    setRoom(null);
    setIsMuted(false);
    setCallStatus(CALL_STATUS.IDLE);
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