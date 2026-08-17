// import { createContext, useContext, useState, useCallback } from "react";

// import {
//   startAgentOutboundEngine,
//   initiateOutboundCall,
//   endActiveOutboundCall,
// } from "../../services/realtime/stomp/Stompmake";

// import { toggleMicrophone } from "../../services/call/Livekit/livekitService";
// import { CALL_STATUS } from "../../services/call/Livekit/livekitConstants";

// const OutboundCallContext = createContext(null);

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
//    * تحديث موحد لحالة الـ UI القادمة من محرك المكالمات
//    */
//   const handleEngineUpdate = useCallback((uiUpdate = {}) => {
//     const {
//       status,
//       callId,
//       room: livekitRoom,
//       message,
//       isWsConnected,
//       startTimer: timerFlag,
//     } = uiUpdate;

//     console.log(
//       "[Outbound Context Event]",
//       uiUpdate
//     );

//     // WebSocket status
//     if (isWsConnected === true) {
//       setWsStatus("Connected");
//     }

//     if (isWsConnected === false) {
//       setWsStatus("Disconnected");
//     }

//     // Message
//     if (message !== undefined) {
//       setStatusMessage(message);
//     }

//     // Call status
//     if (status !== undefined) {
//       setCallStatus(status);
//     }

//     // Call ID
//     if (callId !== undefined) {
//       setActiveCallId(callId);
//     }

//     // Timer
//     if (timerFlag !== undefined) {
//       setStartTimer(timerFlag);
//     }

//     // LiveKit room
//     if (livekitRoom !== undefined) {
//       setRoom(livekitRoom);
//     }
//   }, []);

//   /**
//    * 1. تشغيل محرك المكالمات الصادرة
//    */
//   const initOutboundEngine = useCallback((token, identity) => {
//     if (!token || !identity) {
//       console.error(
//         "❌ لا يمكن تشغيل محرك المكالمات: token أو identity مفقود"
//       );
//       return;
//     }

//     setAgentIdentity(identity);
//     setAgentToken(token);

//     startAgentOutboundEngine(
//       token,
//       identity,
//       handleEngineUpdate
//     );
//   }, [handleEngineUpdate]);

//   /**
//    * 2. بدء مكالمة صادرة
//    */
//   const handleMakeCall = useCallback(
//     async (phoneNumber, overrideToken = null) => {
//       const jwtToken = overrideToken || agentToken;

//       if (!jwtToken) {
//         console.error(
//           "❌ لا يوجد Token معتمد لإجراء المكالمة الصادرة"
//         );

//         setStatusMessage(
//           "لا يوجد Token معتمد لإجراء المكالمة."
//         );

//         return;
//       }

//       if (!phoneNumber) {
//         console.error(
//           "❌ رقم الهاتف غير موجود"
//         );

//         setStatusMessage(
//           "يرجى إدخال رقم الهاتف."
//         );

//         return;
//       }

//       setCallStatus(CALL_STATUS.CONNECTING_TO_ROOM);
//       setStatusMessage("جاري بدء المكالمة...");

//       try {
//         await initiateOutboundCall(
//           phoneNumber,
//           jwtToken,
//           handleEngineUpdate
//         );
//       } catch (error) {
//         console.error(
//           "❌ خطأ أثناء إنشاء المكالمة:",
//           error
//         );

//         setCallStatus(CALL_STATUS.IDLE);
//         setStatusMessage(
//           error?.message || "فشل إنشاء المكالمة."
//         );
//       }
//     },
//     [agentToken, handleEngineUpdate]
//   );

//   /**
//    * 3. إنهاء المكالمة الحالية
//    */
//   const handleEndCall = useCallback(
//     async (overrideToken = null) => {
//       const jwtToken = overrideToken || agentToken;

//       if (!jwtToken) {
//         console.error(
//           "❌ لا يوجد Token لإنهاء المكالمة"
//         );
//         return;
//       }

//       try {
//         await endActiveOutboundCall(
//           jwtToken,
//           handleEngineUpdate
//         );
//       } catch (error) {
//         console.error(
//           "❌ خطأ أثناء إنهاء المكالمة:",
//           error
//         );
//       } finally {
//         // تأكيد تنظيف UI حتى لو حدث خطأ في API
//         setActiveCallId(null);
//         setRoom(null);
//         setIsMuted(false);
//         setStartTimer(false);
//         setCallStatus(CALL_STATUS.IDLE);
//       }
//     },
//     [agentToken, handleEngineUpdate]
//   );

//   /**
//    * 4. كتم / تشغيل المايكروفون
//    */
//   const handleToggleMute = useCallback(async () => {
//     if (!room) {
//       console.warn(
//         "⚠️ لا توجد غرفة LiveKit نشطة."
//       );
//       return;
//     }

//     try {
//       const nextMuteState = !isMuted;

//       // toggleMicrophone(room, true) = microphone enabled
//       // toggleMicrophone(room, false) = microphone disabled
//       await toggleMicrophone(
//         room,
//         !nextMuteState
//       );

//       setIsMuted(nextMuteState);
//     } catch (error) {
//       console.error(
//         "❌ فشل تغيير حالة المايكروفون:",
//         error
//       );
//     }
//   }, [room, isMuted]);

//   /**
//    * 5. تصفير حالة الواجهة فقط
//    *
//    * ملاحظة:
//    * هذه الدالة لا تنهي المكالمة من السيرفر.
//    * لا تستخدمها بدلاً من handleEndCall.
//    */
//   const resetCallState = useCallback(() => {
//     setActiveCallId(null);
//     setRoom(null);
//     setIsMuted(false);
//     setStartTimer(false);
//     setCallStatus(CALL_STATUS.IDLE);
//     setStatusMessage("");

//     console.log(
//       "UI Reset: All Outbound call states cleared"
//     );
//   }, []);

//   const value = {
//     // Call state
//     activeCallId,
//     room,
//     callStatus,
//     isMuted,

//     // WebSocket
//     wsStatus,

//     // Agent
//     agentIdentity,
//     agentToken,

//     // UI
//     statusMessage,
//     startTimer,

//     // Actions
//     initOutboundEngine,
//     handleMakeCall,
//     handleEndCall,
//     handleToggleMute,
//     resetCallState,
//   };

//   return (
//     <OutboundCallContext.Provider value={value}>
//       {children}
//     </OutboundCallContext.Provider>
//   );
// };

// export const useOutboundCall = () => {
//   const context = useContext(OutboundCallContext);

//   if (!context) {
//     throw new Error(
//       "useOutboundCall must be used inside OutboundCallProvider"
//     );
//   }

//   return context;
// };