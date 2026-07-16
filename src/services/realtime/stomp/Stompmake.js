import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  initializeRoom,
  connectToLiveKit,
  toggleMicrophone,
} from "../../call/Livekit/livekitService";
import { CALL_STATUS } from "../../call/Livekit/livekitConstants";

// عنوان السيرفر الأساسي الموحد لجميع الطلبات
const BACKEND_URL = "http://153.75.91.83:8080";

let stompClient = null;
let currentRoom = null;
let currentCallId = null;
let currentCallState = CALL_STATUS.IDLE;

/**
 * 1. تشغيل المحرك والاتصال بالـ WebSocket
 * حسب التوثيق: نمرر token و identity و role في رابط الاتصال (Query Params) وفي الـ connectHeaders
 */
export const startAgentOutboundEngine = (token, agentIdentity, onUiUpdate) => {
  console.log("=== 🚀 AGENT OUTBOUND ENGINE STARTED ===");
  currentCallState = CALL_STATUS.IDLE;

  onUiUpdate({
    status: CALL_STATUS.IDLE,
    message: "جاري تهيئة اتصال السيرفر..."
  });

  // ترميز الـ Token لضمان سلامة الـ URL-encoded الخاص برابط الاتصال
  const encodedToken = encodeURIComponent(token);
  const connectionURL = `${BACKEND_URL}/ws?token=${encodedToken}&identity=${agentIdentity}&role=AGENT`;

  stompClient = new Client({
    webSocketFactory: () => new SockJS(connectionURL),
    // ترويسات اتصال STOMP المطلوبة حرفياً في الوثيقة
    connectHeaders: {
      identity: agentIdentity,
      role: "AGENT"
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => {
      console.log("[STOMP DEBUG]", str);
    },
    onConnect: () => {
      console.log("✅ تم الاتصال بنجاح ببروتوكول STOMP للاتصال الصادر");

      onUiUpdate({
        isWsConnected: true,
        status: CALL_STATUS.IDLE,
        message: "المحرك جاهز لإجراء المكالمات الصادرة."
      });
      
      // الاشتراك الفوري في القناة الرسمية لتتبع حالات المكالمات
      subscribeAgentChannel(agentIdentity, onUiUpdate);
    },
    onWebSocketClose: (event) => {
      console.error("❌ تم إغلاق اتصال الـ WebSocket:", event.code, event.reason);
      onUiUpdate({ isWsConnected: false, message: "انقطع الاتصال بالسيرفر" });
    },
    onWebSocketError: (error) => {
      console.error("⚠️ خطأ في اتصال الـ WebSocket:", error);
      onUiUpdate({ isWsConnected: false });
    },
    onStompError: (frame) => {
      console.error("❌ خطأ بروتوكولي في STOMP Layer:", frame.headers['message']);
    }
  });

  stompClient.activate();
};

/**
 * 2. الاشتراك في قناة الوكيل الخاصة واستقبال الأحداث (ACCEPTED, REJECTED, CANCELLED, ENDED)
 */
const subscribeAgentChannel = (agentIdentity, onUiUpdate) => {
  const topic = `/topic/agents/${agentIdentity}`;
  console.log("📡 جاري الاشتراك في قناة تتبع الحالات:", topic);

  stompClient.subscribe(topic, async (msg) => {
    try {
      const payload = JSON.parse(msg.body);
      console.log("🚨 [WEBSOCKET EVENT RECEIVED] التحديث المستلم من السيرفر:", payload);

      const serverStatus = payload.status ? payload.status.toUpperCase() : "";

      switch (serverStatus) {
        case "ACCEPTED":
          console.log("📞 العميل قبل المكالمة! جاري تحويل الواجهة وتشغيل العداد...");
          currentCallState = CALL_STATUS.CONNECTED; 
          onUiUpdate({
            status: CALL_STATUS.CONNECTED, 
            message: "مكالمة نشطة الآن (العميل متصل)",
            startTimer: true // إشارة للمكون لتشغيل مؤقت الدقائق والتصاعدي
          });
          break;

        case "REJECTED":
          console.log("🛑 رفض العميل المكالمة أو عدم الرد");
          await handleCallCleanup(onUiUpdate, CALL_STATUS.IDLE, "تم رفض المكالمة من قبل العميل.");
          break;

        case "CANCELLED":
          console.log("🛑 تم إلغاء المكالمة أثناء مرحلة الإعداد");
          await handleCallCleanup(onUiUpdate, CALL_STATUS.IDLE, "تم إلغاء المكالمة.");
          break;

        case "ENDED":
          console.log("🏁 انتهت المكالمة النشطة الجارية");
          await handleCallCleanup(onUiUpdate, CALL_STATUS.IDLE, "انتهت المكالمة.");
          break;

        default:
          console.warn("⚠️ حالة غير معروفة مستلمة من السيرفر:", payload.status);
      }
    } catch (error) {
      console.error("❌ خطأ أثناء معالجة حدث الـ WebSocket التابع للوكيل:", error);
    }
  });
};

/**
 * 3. إجراء HTTP REST: بدء مكالمة صادرة جديدة (POST /api/calls/outbound)
 */
export const initiateOutboundCall = async (phoneNumber, agentJwtToken, onUiUpdate) => {
  if (!stompClient || !stompClient.connected) {
    console.error("❌ لا يمكن بدء اتصال: محرك الـ WebSocket غير متصل حالياً.");
    onUiUpdate({ message: "فشل: محرك الاتصال غير متصل بالخادم." });
    return;
  }

  try {
    onUiUpdate({
      status: CALL_STATUS.CONNECTING_TO_ROOM,
      message: "جاري طلب الرقم وبدء الاتصال الصادر..."
    });

    const response = await fetch(`${BACKEND_URL}/api/calls/outbound`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${agentJwtToken}`
      },
      body: JSON.stringify({ phoneNumber: phoneNumber })
    });

    if (!response.ok) {
      throw new Error(`فشل الخادم في الرد: ${response.status}`);
    }

    const jsonResponse = await response.json();
    console.log("❤️❤️", jsonResponse);

    if (jsonResponse.success && jsonResponse.data) {
      // استخراج معطيات المعرّف الفريد والتوكن من كتلة الـ data
      const { callId, token: livekitToken } = jsonResponse.data;

      currentCallId = callId;
      currentCallState = CALL_STATUS.RINGING;

      onUiUpdate({
        status: CALL_STATUS.RINGING,
        callId: callId,
        message: "جاري الاتصال والرنين عند العميل..."
      });

      // الانضمام المسبق الفوري لغرفة الصوت والـ WebRTC لحين رفع العميل للخط
      await connectAgentToAudioRoom(livekitToken, onUiUpdate);
    } else {
      throw new Error(jsonResponse.message || "استجابة غير صالحة من السيرفر");
    }

  } catch (error) {
    console.error("❌ خطأ أثناء بدء المكالمة الصادرة:", error);
    onUiUpdate({
      status: CALL_STATUS.IDLE,
      message: `فشل بدء المكالمة: ${error.message}`
    });
  }
};

/**
 * 4. إجراء HTTP REST: إنهاء المكالمة النشطة الجارية (POST /api/calls/{callId}/end)
 */
export const endActiveOutboundCall = async (agentJwtToken, onUiUpdate) => {
  if (!currentCallId) {
    console.warn("⚠️ لا توجد مكالمة نشطة لإنهائها محلياً.");
    await handleCallCleanup(onUiUpdate, CALL_STATUS.IDLE, "لا توجد مكالمة قائمة.");
    return;
  }

  try {
    // بناء الرابط الديناميكي الموحد طبقاً للوثيقة الرسمية
    const endCallEndpoint = `${BACKEND_URL}/api/calls/${currentCallId}/end`;
    console.log(`🛑 جاري إرسال طلب إنهاء المكالمة للمعرف: ${currentCallId} إلى الرابط: ${endCallEndpoint}`);
    
    const response = await fetch(endCallEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${agentJwtToken}`
      }
    });

    if (!response.ok) {
      console.warn(`⚠️ السيرفر رد بحالة: ${response.status}، سيتم إجراء التنظيف المحلي.`);
    } else {
      console.log("✅ أكد السيرفر إنهاء الجلسة واستقبال الطلب.");
    }

  } catch (error) {
    console.error("❌ خطأ أثناء محاولة إنهاء المكالمة عبر الـ API:", error);
  } finally {
    // التنظيف المحلي الشامل والـ Disconnect لحماية الذاكرة والـ UI في كل الأحوال
    await handleCallCleanup(onUiUpdate, CALL_STATUS.IDLE, "تم إنهاء الجلسة وفصل الخط.");
  }
};

/**
 * 5. ربط الوكيل بصوت الغرفة عبر LiveKit WebRTC Engine
 */
const connectAgentToAudioRoom = async (livekitToken, onUiUpdate) => {
  try {
    
    currentRoom = initializeRoom();

    currentRoom.on("participantConnected", (participant) => {
      console.log("👤 انضم الطرف الآخر للغرفة البصرية:", participant);
    });

    currentRoom.on("trackSubscribed", async (track, publication, participant) => {
      console.log("🎧 تم استقبال تراك صوتي من:", participant.identity, track.kind);

      if (track.kind === "audio") {
        const audioElement = track.attach();
        audioElement.autoplay = true;
        audioElement.style.display = "none";
        document.body.appendChild(audioElement);

        try {
          await audioElement.play();
          console.log("🔊 البث الصوتي للطرف الآخر يعمل الآن بنجاح");
        } catch (err) {
          console.error("❌ خطأ في تشغيل عنصر الصوت المتصل:", err);
        }
      }
    });

    // الاتصال الفعلي بالـ LiveKit وتفعيل المايكروفون للوكيل
    await connectToLiveKit(currentRoom, livekitToken);
    await toggleMicrophone(currentRoom, true);

   // فحص دوري وسريع للمشتركين المتواجدين مسبقاً وفهم حالة الغرفة
setTimeout(() => {
  if (!currentRoom) {
    console.log("🔍 [DEBUG] لا توجد غرفة نشطة حالياً.");
    return;
  }

  // 1. طباعة اسم الغرفة الحالي لمطابقته مع العميل
  console.log(`🔍 [DEBUG] اسم الغرفة الحالي عند الوكيل: ${currentRoom.name}`);
  
  // 2. طباعة عدد المشتركين المتواجدين بالفعل
  const participantCount = currentRoom.remoteParticipants.size;
  console.log(`🔍 [DEBUG] عدد المشتركين الآخرين في الغرفة الآن: ${participantCount}`);

  if (participantCount > 0) {
    currentRoom.remoteParticipants.forEach((participant) => {
      console.log(`👤 [DEBUG] مشترك متواجد مسبقاً في الغرفة: ${participant.identity}`);
      
      participant.trackPublications.forEach((pub) => {
        if (pub.track && pub.kind === "audio") {
          console.log(`🔊 [DEBUG] تم العثور على تراك صوتي جاهز للمشترك: ${participant.identity}`);
          const audioElement = pub.track.attach();
          audioElement.autoplay = true;
          audioElement.style.display = "none";
          document.body.appendChild(audioElement);
          audioElement.play().catch(err => console.error("❌ خطأ تشغيل الصوت:", err));
        }
      });
    });
  } else {
    console.warn("⚠️ [DEBUG] الغرفة لا تزال فارغة تماماً! العميل لم يدخل هنا.");
  }
}, 3000); // رفعنا المدة إلى 3 ثوانٍ لمنح العميل وقتاً كافياً للدخول
    currentCallState = "ACCEPTED";
    // نحدث الواجهة بتأمين الاتصال الصوتي الداخلي مع إبقاء حالة الرنين قائمة انتظاراً للـ WebSocket
    onUiUpdate({
      status: currentCallState, 
      callId: currentCallId,
      room: currentRoom,
      message: "العميل الان على تواصل معك "
    });

  } catch (error) {
    console.error("❌ خطأ أثناء الاتصال بـ LiveKit:", error);
    onUiUpdate({ message: "خطأ في تهيئة الصوت الداخلي للمكالمة." });
  }
};

/**
 * 6. دالة التنظيف الموحدة وإعادة ضبط المصنع للوحة التحكم (Cleanup Strategy)
 * تصفير المعرفات وحذف الرموز المخزنة وإغلاق الغرف الصوتية
 */
const handleCallCleanup = async (onUiUpdate, targetState, message) => {
  currentCallState = targetState;
  currentCallId = null;

  // فصل اتصال غرفة LiveKit وجلسة الـ WebRTC بشكل آمن لحذف الرموز المؤقتة
  if (currentRoom) {
    try {
      currentRoom.disconnect();
      console.log("🔌 تم فصل اتصال غرفة LiveKit وجلسة WebRTC بنجاح.");
    } catch (e) {
      console.error("خطأ أثناء محاولة فصل LiveKit Room:", e);
    }
    currentRoom = null;
  }

  // إعادة تفعيل الأزرار وتصفير البيانات بالكامل بالواجهة لإتاحة مكالمات جديدة
  onUiUpdate({
    status: currentCallState,
    room: null,
    callId: null,
    message: message,
    startTimer: false // إيقاف وتصفير العداد التنازلي/التصاعدي
  });

  console.log(`🏁 تمت إعادة تهيئة لوحة التحكم بالكامل. الحالة الحالية للمحرك: ${currentCallState}`);
};