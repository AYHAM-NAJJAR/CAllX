// import menu from "../../assets/menu.png";
// import { useOutletContext } from "react-router-dom";
// import { useState } from "react";
// import { useCall } from "../../context/Call/CallContext";
// import { initiateCall } from "../../services/call/core/InitiateCall";

// const CallDashboard = () => {

//   const { toggleSidebar } = useOutletContext();

//   const { incomingCalls, addIncomingCall } = useCall();

//   const [loading, setLoading] = useState(false);

//   const handleCall = async () => {
//   console.log("MAKE CALL CLICKED");

//   setLoading(true);

//   try {
//     const token = localStorage.getItem("Token");

//     const data = await initiateCall(
//       token,
//       (event) => {
//         console.log("REAL EVENT:", event);
//         addIncomingCall(event);
//       }
//     );

//     console.log("CALL READY:", data);
//   } catch (err) {
//     console.error("CALL ERROR:", err);
//   }

//   setLoading(false);
// };

//   return (
//     <div className="p-6">

//       {/* HEADER */}

//       <div className="flex justify-between items-center mb-10">

//         <div className="flex items-center gap-5">

//           <img
//             onClick={toggleSidebar}
//             src={menu}
//             className="w-8 h-8 cursor-pointer"
//             alt="menu"
//           />

//           <h1 className="text-2xl text-white font-bold">
//             Call Center(Main Workspace)
//           </h1>

//         </div>

//         <button
//           onClick={handleCall}
//           className="bg-green-500 px-6 py-2 rounded text-white"
//         >
//           {loading ? "Calling..." : "Make Call"}
//         </button>

//       </div>

//       {/* CALL LIST */}

//       <div className="space-y-3">

//         {incomingCalls.map((c) => (

//           <div
//             key={c.callId}
//             className="p-4 bg-slate-800 rounded"
//           >

//             <div>{c.callerIdentity}</div>
//             <div>{c.phoneNumber}</div>

//           </div>

//         ))}

//       </div>

//     </div>
//   );
// };
// AgentTerminal.js
// AgentTerminal.jsx
// AgentTerminal.js
import React, { useState, useEffect } from 'react';
import { useCall } from '../../context/Call/CallContext';
import { CALL_STATUS } from '../../services/call/Livekit/livekitConstants';

const AgentTerminal = () => {
  const {
    incomingCalls,
    activeCall,
    callStatus,
    isMuted,
    wsStatus,
    initInboundEngine,
    handleAcceptCall,
    handleEndOrRejectCall,
    handleToggleMute,
  } = useCall();

  // 1. إعدادات الخوادم والصلاحيات
  const savedToken = localStorage.getItem("Token") || '';
  const [springUrl, setSpringUrl] = useState('http://153.75.91.83:8080');
  const [livekitUrl, setLivekitUrl] = useState('ws://153.75.91.83:7880');
  const [token, setToken] = useState(savedToken);
  
  // 2. حالات التحكم المحلية
  const [queueId, setQueueId] = useState('1');
  const [agentIdentity, setAgentIdentity] = useState('ayhamagent@gmail.com'); 
  const [logs, setLogs] = useState(['في انتظار بدء الاتصال بالمحرك...']);

  const addLog = (message) => {
    setLogs(prev => [`> [${new Date().toLocaleTimeString()}] ${message}`, ...prev]); // ترتيب تنازلي لرؤية السجلات الحديثة فوراً
  };

  // مراقبة أحداث المكالمات وتوليد سجلات عربية دقيقة لعمليات التدقيق
  useEffect(() => {
    if (callStatus === CALL_STATUS.RINGING && incomingCalls.length > 0) {
      const latestCall = incomingCalls[incomingCalls.length - 1];
      addLog(`🚨 إشارة رنين واردة! رقم المكالمة: ${latestCall.callId} | المتصل: ${latestCall.callerIdentity || 'غير معروف'}.. في انتظار قرار الوكيل.`);
    } else if (callStatus === CALL_STATUS.CONNECTING_TO_ROOM) {
      addLog(`⚡ جاري التوصيل التلقائي بغرفة الميديا المؤقّتة عبر LiveKit...`);
    } else if (callStatus === CALL_STATUS.CONNECTED) {
      addLog(`✅ تم ربط قنوات الصوت بنجاح. جلسة WebRTC نشطة ومباشرة الآن.`);
    } else if (callStatus === CALL_STATUS.IDLE && logs.length > 1) {
      addLog(`🛑 تم إغلاق المكالمة وتفريغ مسارات الوسائط وجلسات الاستماع.`);
    }
  }, [callStatus, incomingCalls]);

  // مراقبة حالة الـ WebSocket للتأكيد على التواجد التلقائي (Presence)
  useEffect(() => {
    if (wsStatus === 'Connected') {
      addLog('✅ تم تفعيل اتصال STOMP/SockJS بنجاح مع خادم Spring Boot.');
      addLog(`📡 نظام التواجد التلقائي: الوكيل نشط ومتاح حالياً (AVAILABLE) في طابور الخدمة رقم [${queueId}].`);
    } else if (wsStatus === 'Disconnected' && logs.length > 1) {
      addLog('❌ انقطع الاتصال بخادم الإشارات التابع للمنصة.');
    }
  }, [wsStatus, queueId]);

  const handleConnectEngine = () => {
    if (!token) {
      addLog('خطأ: رمز الصلاحية (SSO Token) مطلوب للمصادقة مع السيرفر.');
      return;
    }
    addLog(`جاري طلب الاتصال بخادم الإشارات الموحد على الرابط: ${springUrl}...`);
    initInboundEngine(token, queueId, agentIdentity);
  };

  return (
    // تم التحديث: تفعيل اتجاه RTL للنصوص العربية وتنسيقات الهوامش المتوافقة مع Tailwind
    <div className="min-h-screen bg-gray-900 text-gray-300 p-8 font-sans animate-fade-in" dir="rtl">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700">
        
        {/* العناوين الرئيسية */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold text-cyan-400">لوحة تحكم ومحاكاة محرك الوكيل (Agent Terminal)</h1>
          <span className="text-xs bg-cyan-950 text-cyan-400 px-3 py-1 rounded border border-cyan-800 font-mono">CallX SaaS v1.0</span>
        </div>

        {/* الخطوة 1: الخوادم والصلاحيات */}
        <div className="bg-gray-900 rounded p-4 mb-6 border border-gray-700">
          <h2 className="text-sm font-semibold text-cyan-500 mb-4">الخطوة 1: إعدادات المنافذ ورمز الصلاحية (Authorization)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">رابط خادم الإشارات (Spring Backend)</label>
              <input 
                value={springUrl}
                onChange={(e) => setSpringUrl(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 font-mono text-left" 
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">رابط خادم الميديا والصوت (LiveKit Server)</label>
              <input 
                value={livekitUrl}
                onChange={(e) => setLivekitUrl(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 font-mono text-left" 
                dir="ltr"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">رمز دخول الوكيل الموحد (Agent SSO Access Token - JWT)</label>
            <input 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="قم بلصق رمز الـ JWT المستخرج للوكيل هنا..."
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 placeholder-gray-600 font-mono text-left" 
              dir="ltr"
            />
          </div>
          <button 
            onClick={handleConnectEngine}
            className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-2 px-6 rounded text-sm transition-colors w-full sm:w-auto shadow-lg shadow-cyan-500/20">
            بدء تشغيل محرك الاتصالات للوكيل
          </button>
        </div>

        {/* شريط حالة الـ WebSocket المستقل */}
        <div className="bg-gray-850 border border-gray-750 text-center py-2.5 rounded mb-6 font-medium text-sm flex justify-center items-center gap-2">
          <span>حالة اتصال الـ WebSocket الأساسي:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${wsStatus === 'Connected' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-gray-900 text-gray-400 border border-gray-700'}`}>
            {wsStatus === 'Connected' ? 'متصل بالخدمة (CONNECTED)' : 'غير متصل (DISCONNECTED)'}
          </span>
        </div>

        {/* الخطوة 2: استقبال التدفق الهاتفي المباشر */}
        <div className="bg-gray-900 rounded p-4 mb-6 border border-gray-700">
          <h2 className="text-sm font-semibold text-cyan-500 mb-4">الخطوة 2: إدارة تدفق المكالمات الواردة (Inbound Traffic)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">هوية الوكيل الحالية (مستخرجة تلقائياً من الـ JWT)</label>
              <input 
                disabled
                value={agentIdentity}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-500 cursor-not-allowed font-mono text-left" 
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">رقم طابور الانتظار المستهدف (Queue ID)</label>
              <input 
                value={queueId}
                onChange={(e) => setQueueId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 font-mono text-center" 
              />
            </div>
          </div>

          {/* صندوق التنبيه المنبثق التفاعلي عند الرنين */}
          {callStatus === CALL_STATUS.RINGING && incomingCalls.length > 0 ? (
            <div className="bg-cyan-950/30 p-4 rounded border border-cyan-800/80 animate-pulse mt-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-cyan-400 font-bold flex items-center gap-1.5">
                  <span>🚨 مكالمة واردة من:</span>
                  <span className="text-yellow-400 font-mono">{incomingCalls[0].callerIdentity || "عميل خارجي"}</span>
                </p>
                <span className="text-xs font-mono bg-cyan-900 text-cyan-300 px-2 py-0.5 rounded">ID: {incomingCalls[0].callId.substring(0, 8)}...</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleAcceptCall(incomingCalls[0].callId)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-2 px-4 rounded text-sm transition-colors shadow-lg shadow-emerald-500/10">
                  قبول المكالمة وبدء الصوت (Accept)
                </button>
                <button 
                  onClick={handleEndOrRejectCall}
                  className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded text-sm transition-colors shadow-lg shadow-red-500/10">
                  رفض وتحويل المكالمة (Reject)
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs py-5 text-gray-500 border border-dashed border-gray-700 rounded mt-2">
              لا يوجد حركة اتصالات واردة حالياً. النظام في وضع الاستماع ومراقبة الطوابير...
            </div>
          )}
        </div>

        {/* الخطوة 3: أدوات تحكم المكالمة النشطة */}
        <div className="bg-gray-900 rounded p-4 mb-6 border border-gray-700">
          <h2 className="text-sm font-semibold text-cyan-500 mb-4">الخطوة 3: أزرار تحكم الجلسة الصوتية النشطة (Media Control)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm bg-gray-850 p-3 rounded border border-gray-750">
            <p className="text-gray-400">رقم المكالمة الحالية: <span className="text-yellow-500 font-mono font-semibold">{activeCall ? activeCall.callId : 'لا يوجد'}</span></p>
            <p className="text-gray-400">حالة الميكروفون الحالية: 
              <span className={`mr-2 font-bold ${isMuted ? 'text-red-400' : 'text-emerald-400'}`}>
                {isMuted ? 'مكتوم (MUTED)' : 'مفتوح حي (LIVE)'}
              </span>
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleToggleMute}
              disabled={callStatus !== CALL_STATUS.CONNECTED}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-gray-600">
              {isMuted ? 'تفعيل الميكروفون (Unmute)' : 'كتم الميكروفون (Mute)'}
            </button>
            <button 
              onClick={handleEndOrRejectCall}
              disabled={callStatus !== CALL_STATUS.CONNECTED}
              className="flex-1 bg-red-900/40 hover:bg-red-800 text-red-300 font-bold py-2 px-4 rounded text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-red-800/60">
              إنهاء المكالمة الحالية (Hang Up)
            </button>
          </div>
        </div>

        {/* شاشة السجلات البرمجية الحية (Live Log Terminal) */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-2">شاشة مراقبة السجلات والرسائل الفورية (Live Terminal Logs)</h2>
          <div className="bg-black text-cyan-400 font-mono text-xs p-4 rounded-lg h-44 overflow-y-auto border border-gray-850 text-right space-y-1.5" dir="ltr">
            {logs.map((log, idx) => (
              <div key={idx} className="transition-all duration-150 hover:bg-gray-950 px-1 py-0.5 rounded">{log}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgentTerminal;