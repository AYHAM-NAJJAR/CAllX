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
  
  // 🟢 State جديدة لحفظ بيانات العميل المتصل الحالي وتوفيرها للواجهة
  const [currentCustomer, setCurrentCustomer] = useState(null);

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
          customer, // 🟢 التقاط كائن العميل القادم من الـ Service
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

        if (livekitRoom) {
          setRoom(livekitRoom);
          setCallStatus(CALL_STATUS.CONNECTED); 
        }

        if (status === CALL_STATUS.RINGING) {
          const newCall = { 
            callId, 
            callerIdentity, 
            status,
            customer: customer || null // حفظ بيانات العميل داخل المكالمة الواردة أيضاً
          };
          addIncomingCall(newCall);
          
          if (customer) {
            setCurrentCustomer(customer);
          }
        }

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
    
    // 🟢 نقل بيانات العميل للمكالمة النشطة عند القبول
    if (targetCall.customer) {
      setCurrentCustomer(targetCall.customer);
    }

    removeIncomingCall(callId);
    setCallStatus(CALL_STATUS.CONNECTING_TO_ROOM);

    await acceptIncomingCall(callId, agentEmail, (uiUpdate) => {
      if (uiUpdate.status) {
        setCallStatus(uiUpdate.status);
      }

      if (uiUpdate.room) {
        setRoom(uiUpdate.room);
        setCallStatus(CALL_STATUS.CONNECTED);
      }

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

  const resetCallState = () => {
    setActiveCall(null);
    setRoom(null);
    setIsMuted(false);
    setIncomingCalls([]); 
    setCurrentCustomer(null); // 🟢 مسح بيانات العميل عند انتهاء المكالمة
    setCallStatus(CALL_STATUS.IDLE); 
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
    currentCustomer, // 🟢 تصدير بيانات العميل للاستخدام المباشر في أي واجهة
    initInboundEngine,
    handleAcceptCall,
    handleEndOrRejectCall,
    handleToggleMute,
    resetCallState
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = () => useContext(CallContext);