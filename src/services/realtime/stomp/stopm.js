import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  initializeRoom,
  connectToLiveKit,
  toggleMicrophone,
} from "../../call/Livekit/livekitService";
import { CALL_STATUS } from "../../call/Livekit/livekitConstants";

/* 
let stompClient = null;
الغاية
يمثل اتصال الـ
WebSocket
مع السيرفر.
من خلاله:
نستقبل المكالمات
نرسل قبول المكالمة
نرسل رفض المكالمة
نستقبل تحديثات الحالة
*/
let stompClient = null;
/*
الغاية

تخزين غرفة
LiveKit
 الحالية
*/
let currentRoom = null;
let activeCallSubscription = null;
let currentCallId = null;
let currentCallState = CALL_STATUS.IDLE;

/**
 * 1. تشغيل المحرك والاتصال بالـ WebSocket عبر بروتوكول STOMP over SockJS
 */
export const startAgentInboundEngine = (token, queueId, agentEmail, onUiUpdate) => {
  console.log("=== 🚀 AGENT INBOUND ENGINE STARTED ===");
  currentCallState = CALL_STATUS.IDLE;

  onUiUpdate({
    status: CALL_STATUS.IDLE,
    message: "جاري تهيئة الاتصال..."
  });

  // إعداد رابط SockJS الأساسي مع التوكن كـ Query Parameter حسب المتطلبات
  const connectionURL = `http://153.75.91.83:8080/ws?token=${token}`;

  stompClient = new Client({
    // تم الإصلاح: استخدام webSocketFactory لتشغيل SockJS بدلاً من brokerURL المباشر
    webSocketFactory: () => new SockJS(connectionURL),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => {
      console.log("[STOMP DEBUG]", str);
    },
    onConnect: () => {
      console.log("✅ تم الاتصال بنجاح ببروتوكول STOMP عبر SockJS");

      onUiUpdate({
        isWsConnected: true,
        status: CALL_STATUS.IDLE,
        message: "متصل بالخدمة، في انتظار المكالمات..."
      });

      // 1. تحديث حالة التواجد فور الاتصال لتصبح متاح (Go Live)
      updateAgentPresence(agentEmail, "AVAILABLE", queueId);
      
      // 2. الاشتراك في قناة الوكيل الخاصة لاستقبال الرنين والتوكن
      subscribeAgentChannel(agentEmail, onUiUpdate);
    },
    onWebSocketClose: (event) => {
      console.error("❌ تم إغلاق اتصال الـ WebSocket:", event.code, event.reason);
      onUiUpdate({ isWsConnected: false, message: "انقطع الاتصال بالسيرفر" });
    },
    onWebSocketError: (error) => {
      console.error("⚠️ خطأ في اتصال الـ WebSocket الروتيني:", error);
      onUiUpdate({ isWsConnected: false });
    },
    onStompError: (frame) => {
      console.error("❌ خطأ بروتوكولي في STOMP Layer:", frame.headers['message']);
    }
  });

  stompClient.activate();
};

/**
 * الإجراء الصادر 1: تحديث حالة التواجد للوكيل (Presence Control)
 */
export const updateAgentPresence = (agentEmail, status, queueId) => {
  if (!stompClient || !stompClient.connected) return;

  const payload = {
    agentIdentity: agentEmail,
    status: status, // AVAILABLE أو OFLINE
    queueId: String(queueId)
  };

  stompClient.publish({
    destination: "/app/agent.status",
    body: JSON.stringify(payload)
  });

  console.log(`📡 تم إرسال حالة التواجد [${status}] إلى السيرفر.`);
};

/**
 * القناة المستقبلة الأولى: قناة الوكيل الخاصة (Agent-Specific Queue)
 * هنا يتم استقبال التوكن وتشغيل الصوت حصرياً بناءً على طلب الباك إند
 */
const subscribeAgentChannel = (agentEmail, onUiUpdate) => {
  const topic = `/topic/agents/${agentEmail}`;
  console.log("📡 جاري الاشتراك في القناة الخاصة للوكيل:", topic);

  stompClient.subscribe(topic, async (msg) => {
    try {
      const payload = JSON.parse(msg.body);
      console.log("📩 تم استقبال حدث من قناة الوكيل:", payload);

      // أ. التنبيه بمكالمة واردة (RINGING)
      if (payload.status === "RINGING" || payload.status === "ASSIGNED") {
        currentCallId = payload.callId;
        currentCallState = CALL_STATUS.RINGING;

        onUiUpdate({
          status: CALL_STATUS.RINGING,
          callId: payload.callId,
          callerIdentity: payload.callerIdentity,
          message: "مكالمة واردة جديدة..."
        });
        return;
      }

      // ب. استقبال حالة القبول والتوكن (ACCEPTED) مباشرة
      if (payload.status === "ACCEPTED" && payload.token) {
        console.log("✨ تم استقبال توكن LiveKit عبر قناة الوكيل، جاري الربط الصوتي...");
        currentCallState = CALL_STATUS.CONNECTING_TO_ROOM;
        
        onUiUpdate({
          status: CALL_STATUS.CONNECTING_TO_ROOM,
          message: "جاري فتح غرفة الصوت..."
        });

        await connectAgentToAudioRoom(payload.token, onUiUpdate);
      }
    } catch (error) {
      console.error("❌ خطأ أثناء معالجة بيانات قناة الوكيل:", error);
    }
  });
};

/**
 * الإجراء الصادر 2: قبول المكالمة الواردة (Accept Call)
 */
export const acceptIncomingCall = (callId, agentEmail, onUiUpdate) => {
  if (!stompClient || !stompClient.connected) {
    console.error("❌ لا يمكن قبول المكالمة: اتصال STOMP مقطوع");
    return;
  }

  currentCallId = callId;
  currentCallState = CALL_STATUS.ACCEPTED;

  // الاشتراك الديناميكي الفوري في دورة حياة المكالمة الحالية لتتبع الإلغاء والإنهاء
  subscribeToCallLifecycle(callId, onUiUpdate);

  onUiUpdate({ 
    status: CALL_STATUS.ACCEPTED, 
    message: "جاري قبول المكالمة وتأمين الغرفة..." 
  });

  const acceptPayload = {
    callId: callId,
    agentIdentity: agentEmail
  };

  // تم الإصلاح: الإرسال إلى مسار التطبيق الصحيح وبنية البيانات المطلوبة بالباك إند
  stompClient.publish({
    destination: "/app/call.accept",
    body: JSON.stringify(acceptPayload)
  });

  console.log("🚀 تم إرسال أمر قبول المكالمة إلى /app/call.accept");
};

/**
 * القناة المستقبلة الثانية: دورة حياة المكالمة النشطة (Call Lifecycle Watcher)
 * تم التعديل: إزالة منطق التقاط التوكن والاكتفاء فقط بمراقبة إنهاء المكالمة
 */
const subscribeToCallLifecycle = (callId, onUiUpdate) => {
  if (activeCallSubscription) {
    activeCallSubscription.unsubscribe();
  }

  activeCallSubscription = stompClient.subscribe(
    `/topic/calls/${callId}`,
    async (msg) => {
      try {
        const event = JSON.parse(msg.body);
        console.log("📩 حدث دورة حياة المكالمة النشطة:", event);

        // تفريغ اللوحة فور استقبال حالات الإنهاء (ENDED, CANCELLED, REJECTED, MISSED)
        if (["ENDED", "CANCELLED", "REJECTED", "MISSED"].includes(event.status)) {
          console.log(`🏁 تم إنهاء المكالمة من قبل النظام بحالة: ${event.status}`);
          await handleCallCleanup(onUiUpdate, CALL_STATUS.IDLE, `انتهت المكالمة: ${event.status}`);
        }
      } catch (error) {
        console.error("❌ خطأ في معالجة أحداث دورة حياة المكالمة:", error);
      }
    }
  );
};

/**
 * 4. ربط الوكيل بصوت الغرفة الفعلي عبر LiveKit WebRTC Engine
 */
const connectAgentToAudioRoom = async (livekitToken, onUiUpdate) => {
  try {
    currentRoom = initializeRoom();

    // سجل الأحداث أولاً
    currentRoom.on("participantConnected", (participant) => {
      console.log("👤 participantConnected:", participant.identity);
    });

    currentRoom.on("trackSubscribed", async (track, publication, participant) => {
      console.log(
        "🎧 trackSubscribed:",
        participant.identity,
        track.kind
      );

      if (track.kind === "audio") {
        const audioElement = track.attach();

        audioElement.autoplay = true;
        audioElement.style.display = "none";

        document.body.appendChild(audioElement);

        try {
          await audioElement.play();
          console.log("🔊 AUDIO PLAYING");
        } catch (err) {
          console.error("❌ PLAY ERROR", err);
        }
      }
    });

    await connectToLiveKit(currentRoom, livekitToken);
    await toggleMicrophone(currentRoom, true);

    // فحص المشاركين الموجودين مسبقاً
    setTimeout(() => {
      currentRoom.remoteParticipants.forEach((participant) => {
        console.log("REMOTE:", participant.identity);

        participant.trackPublications.forEach((pub) => {
          console.log(
            "PUB:",
            pub.kind,
            pub.isSubscribed,
            !!pub.track
          );

          // إذا كان التراك موجوداً مسبقاً
          if (pub.track && pub.kind === "audio") {
            const audioElement = pub.track.attach();

            audioElement.autoplay = true;
            audioElement.style.display = "none";

            document.body.appendChild(audioElement);

            audioElement.play().catch(console.error);
          }
        });
      });
    }, 2000);

    currentCallState = "CONNECTED";

    onUiUpdate({
      status: currentCallState,
      callId: currentCallId,
      room: currentRoom,
      message: "المكالمة نشطة الآن وموصولة صوتياً"
    });

  } catch (error) {
    console.error(error);
  }
};
/**
 * الإجراءات الصادرة 3 و 4: الرفض (Reject) أو إنهاء المكالمة النشطة (Hang Up)
 */
export const terminateOrRejectCall = async (agentEmail, onUiUpdate) => {
  if (!stompClient || !stompClient.connected || !currentCallId) {
    await handleCallCleanup(onUiUpdate, CALL_STATUS.IDLE, "تم قطع الاتصال وتفريغ الحالات");
    return;
  }

  const payload = {
    callId: currentCallId,
    agentIdentity: agentEmail
  };

  // فرز الوجهة بناءً على حالة المكالمة الحالية (هل كانت ترن أم موصولة بالفعل؟)
  if (currentCallState === CALL_STATUS.CONNECTED) {
    // إجراء الإنهاء (Hang Up)
    stompClient.publish({
      destination: "/app/call.terminate",
      body: JSON.stringify(payload)
    });
    console.log("🛑 تم إرسال طلب إنهاء المكالمة النشطة إلى /app/call.terminate");
  } else {
    // إجراء الرفض (Reject Call)
    stompClient.publish({
      destination: "/app/call.reject",
      body: JSON.stringify(payload)
    });
    console.log("🛑 تم إرسال طلب رفض المكالمة الواردة إلى /app/call.reject");
  }

  // تنظيف الحالات محلياً وإعادة تهيئة اللوحة فوراً للوضع الافتراضي
  await handleCallCleanup(onUiUpdate, CALL_STATUS.IDLE, "تم إغلاق المحادثة");
};

/**
 * دالة التنظيف وإعادة التهيئة الموحدة (Cleanup Strategy)
 */
const handleCallCleanup = async (onUiUpdate, targetState, message) => {
  currentCallState = targetState;
  currentCallId = null;

  // 1. إلغاء اشتراك دورة حياة المكالمة الحالية
  if (activeCallSubscription) {
    activeCallSubscription.unsubscribe();
    activeCallSubscription = null;
  }

  // 2. تم الإصلاح: قطع اتصال غرفة LiveKit بطريقة برمجية صحيحة وآمنة
  if (currentRoom) {
    try {
      currentRoom.disconnect();
      console.log("🔌 تم فصل اتصال غرفة الصوت وجلسة WebRTC بنجاح.");
    } catch (e) {
      console.error("خطأ أثناء محاولة فصل LiveKit Room:", e);
    }
    currentRoom = null;
  }

  onUiUpdate({
    status: currentCallState,
    room: null,
    message: message
  });

  console.log(`🏁 تمت إعادة تهيئة اللوحة بنجاح. الحالة الحالية: ${currentCallState}`);
};