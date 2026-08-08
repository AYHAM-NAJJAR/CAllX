// // OutboundCallContext.js
// import { createContext, useContext, useState } from "react";
// import {
//   startAgentOutboundEngine,
//   initiateOutboundCall,
//   endActiveOutboundCall
// } from "../../services/realtime/stomp/Stompmake"; // قم بتعديل مسار ملف المحرك حسب مشروعك

// import { toggleMicrophone } from "../../services/call/Livekit/livekitService";
// import { CALL_STATUS } from "../../services/call/Livekit/livekitConstants";

// const OutboundCallContext = createContext();

// export const OutboundCallProvider = ({ children }) => {
//   const [activeCallId, setActiveCallId] = useState(null);
//   const [room, setRoom] = useState(null);
//   const [callStatus, setCallStatus] = useState(CALL_STATUS.IDLE);
//   const [isMuted, setIsMuted] = useState(false);
//   const [wsStatus, setWsStatus] = useState("Disconnected");
//   const [agentIdentity, setAgentIdentity] = useState("");
//   const [agentToken, setAgentToken] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");
//   const [startTimer, setStartTimer] = useState(false);

//   /**
//    * 1. تشغيل محرك الاتصال الصادر عبر WebSocket
//    */
//   const initOutboundEngine = (token, identity) => {
//     setAgentIdentity(identity);
//     setAgentToken(token);

//     startAgentOutboundEngine(token, identity, (uiUpdate) => {
//       const {
//         status,
//         callId,
//         room: livekitRoom,
//         message,
//         isWsConnected,
//         startTimer: timerFlag
//       } = uiUpdate;

//       console.log(`[Outbound Context Event]: ${message} -> Status: ${status}`);

//       // تحديث حالة الـ WebSocket
//       if (isWsConnected === true) setWsStatus("Connected");
//       if (isWsConnected === false) setWsStatus("Disconnected");

//       // تحديث البيانات المستلمة
//       if (message) setStatusMessage(message);
//       if (status) setCallStatus(status);
//       if (callId) setActiveCallId(callId);
//       if (timerFlag !== undefined) setStartTimer(timerFlag);

//       // ربط غرفة LiveKit بالـ State عند تجهيز الصوت
//       if (livekitRoom) {
//         setRoom(livekitRoom);
//       }

//       // تنظيف الواجهة تلقائياً إذا أُغلقت المكالمة أو رفضها العميل
//       if (
//         [
//           CALL_STATUS.IDLE,
//           CALL_STATUS.DISCONNECTED,
//           CALL_STATUS.FAILED,
//           CALL_STATUS.ENDED,
//           CALL_STATUS.REJECTED,
//           CALL_STATUS.CANCELLED
//         ].includes(status) &&
//         !livekitRoom
//       ) {
//         resetCallState();
//       }
//     });
//   };

//   /**
//    * 2. بدء الاتصال برقم هاتف معين (Outbound Call)
//    */
//   const handleMakeCall = async (phoneNumber, overrideToken = null) => {
//     const jwtToken = overrideToken || agentToken;
//     if (!jwtToken) {
//       console.error("❌ لا يوجد Token معتمد لإجراء المكالمة الصادرة");
//       return;
//     }

//     setCallStatus(CALL_STATUS.CONNECTING_TO_ROOM);

//     await initiateOutboundCall(phoneNumber, jwtToken, (uiUpdate) => {
//       const { status, callId, room: livekitRoom, message } = uiUpdate;

//       if (message) setStatusMessage(message);
//       if (status) setCallStatus(status);
//       if (callId) setActiveCallId(callId);

//       if (livekitRoom) {
//         setRoom(livekitRoom);
//       }

//       if ([CALL_STATUS.FAILED, CALL_STATUS.DISCONNECTED].includes(status)) {
//         resetCallState();
//       }
//     });
//   };

//   /**
//    * 3. إنهاء المكالمة الصادرة النشطة
//    */
//   const handleEndCall = async (overrideToken = null) => {
//     const jwtToken = overrideToken || agentToken;

//     await endActiveOutboundCall(jwtToken, (uiUpdate) => {
//       if (uiUpdate.message) setStatusMessage(uiUpdate.message);
//       if (uiUpdate.status) setCallStatus(uiUpdate.status);
//       resetCallState();
//     });
//   };

//   /**
//    * 4. كتم / إعادة تشغيل المايكرفون
//    */
//   const handleToggleMute = async () => {
//     if (!room) return;

//     const nextMuteState = !isMuted;
//     await toggleMicrophone(room, !nextMuteState);
//     setIsMuted(nextMuteState);
//   };

//   /**
//    * 5. تصفير وإعادة ضبط حالة الواجهة
//    */
//   const resetCallState = () => {
//     setActiveCallId(null);
//     setRoom(null);
//     setIsMuted(false);
//     setStartTimer(false);
//     setCallStatus(CALL_STATUS.IDLE);
//     console.log("UI Reset: All Outbound call states cleared");
//   };

//   const value = {
//     activeCallId,
//     room,
//     callStatus,
//     isMuted,
//     wsStatus,
//     agentIdentity,
//     agentToken,
//     statusMessage,
//     startTimer,
//     initOutboundEngine,
//     handleMakeCall,
//     handleEndCall,
//     handleToggleMute,
//     resetCallState
//   };

//   return (
//     <OutboundCallContext.Provider value={value}>
//       {children}
//     </OutboundCallContext.Provider>
//   );
// };

// export const useOutboundCall = () => useContext(OutboundCallContext);