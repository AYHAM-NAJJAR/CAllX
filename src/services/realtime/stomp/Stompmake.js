import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  initializeRoom,
  connectToLiveKit,
  toggleMicrophone,
} from "../../call/Livekit/livekitService";
import { CALL_STATUS } from "../../call/Livekit/livekitConstants";

// ======================================================
// CONFIG
// ======================================================

const BACKEND_URL = "http://153.75.91.83:8080";

// ======================================================
// GLOBAL STATE
// ======================================================

let stompClient = null;
let currentRoom = null;
let currentCallId = null;
let currentCallState = CALL_STATUS.IDLE;
let currentAgentIdentity = null;

/**
 * IMPORTANT:
 * هذا هو الـ callback الحالي للـ FloatingMakeCall.
 *
 * لا تعتمد STOMP على callback الذي وصل وقت تشغيل
 * startAgentOutboundEngine() فقط.
 *
 * عند بدء مكالمة جديدة نقوم بتحديث هذا المتغير
 * بالـ handleUiUpdate الجديد.
 */
let currentUiUpdate = null;

/**
 * يتم استخدامه لمعرفة أن LOCAL_HANGUP طلب من المستخدم
 * لكن النهاية الرسمية لم تصل بعد من السيرفر.
 */
let pendingLocalHangupCallId = null;

// ======================================================
// HELPERS
// ======================================================

const normalizeStatus = (status) => {
  if (!status) return "";

  return String(status)
    .trim()
    .toUpperCase();
};

const safeUiUpdate = (update = {}) => {
  if (typeof currentUiUpdate !== "function") {
    console.warn(
      "⚠️ currentUiUpdate is not available:",
      update
    );

    return;
  }

  try {
    currentUiUpdate(update);
  } catch (error) {
    console.error(
      "❌ Error while calling currentUiUpdate:",
      error
    );
  }
};

const setCurrentUiUpdate = (uiUpdate) => {
  if (typeof uiUpdate === "function") {
    currentUiUpdate = uiUpdate;

    console.log(
      "🔄 Current Floating UI callback updated."
    );
  } else {
    console.warn(
      "⚠️ Attempted to set invalid UI callback."
    );
  }
};

const clearCurrentUiUpdate = () => {
  currentUiUpdate = null;

  console.log(
    "🧹 Current Floating UI callback cleared."
  );
};

const extractPayload = (messageBody) => {
  try {
    const raw = JSON.parse(messageBody);

    const payload =
      raw?.data &&
      typeof raw.data === "object"
        ? {
            ...raw,
            ...raw.data,
          }
        : raw;

    return payload;
  } catch (error) {
    console.error(
      "❌ Invalid WebSocket JSON:",
      error
    );

    return null;
  }
};

// ======================================================
// 1. START OUTBOUND ENGINE
// ======================================================

export const startAgentOutboundEngine = (
  token,
  agentIdentity,
  onUiUpdate
) => {
  // ====================================================
  // IMPORTANT:
  // احفظ آخر callback للـ UI
  // ====================================================

  setCurrentUiUpdate(onUiUpdate);

  currentAgentIdentity = agentIdentity;
  currentCallState = CALL_STATUS.IDLE;
  currentCallId = null;
  pendingLocalHangupCallId = null;

  safeUiUpdate({
    status: CALL_STATUS.IDLE,
    isWsConnected: false,
    message: "جاري تهيئة اتصال السيرفر...",
  });

  if (!token) {
    console.error("❌ Missing WebSocket token");

    safeUiUpdate({
      status: CALL_STATUS.IDLE,
      isWsConnected: false,
      message: "رمز الاتصال بالسيرفر غير موجود.",
    });

    return;
  }

  if (!agentIdentity) {
    console.error("❌ Missing agent identity");

    safeUiUpdate({
      status: CALL_STATUS.IDLE,
      isWsConnected: false,
      message: "هوية الوكيل غير موجودة.",
    });

    return;
  }

  // ====================================================
  // Token فقط يتم URL encode
  // ====================================================

  const encodedToken =
    encodeURIComponent(token);

  const connectionURL =
    `${BACKEND_URL}/ws` +
    `?token=${encodedToken}` +
    `&identity=${encodeURIComponent(agentIdentity)}` +
    `&role=AGENT`;

  // ====================================================
  // إيقاف connection قديم
  // ====================================================

  if (stompClient) {
    try {
      stompClient.deactivate();
    } catch (error) {
      console.warn(
        "⚠️ Error deactivating previous STOMP client:",
        error
      );
    }

    stompClient = null;
  }

  // ====================================================
  // STOMP CLIENT
  // ====================================================

  stompClient = new Client({
    webSocketFactory: () => {
      return new SockJS(connectionURL);
    },

    connectHeaders: {
      identity: agentIdentity,
      role: "AGENT",
    },

    reconnectDelay: 5000,

    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    debug: (str) => {
      console.log("[STOMP DEBUG]", str);
    },

    onConnect: () => {
      console.log(
        "✅ STOMP connected successfully for outbound calling"
      );

      safeUiUpdate({
        isWsConnected: true,
        status: CALL_STATUS.IDLE,
        message:
          "المحرك جاهز لإجراء المكالمات الصادرة.",
      });

      /**
       * IMPORTANT:
       * لا تمرر onUiUpdate القديم إلى subscription.
       *
       * subscription نفسها ستستخدم currentUiUpdate
       * وقت وصول الرسالة.
       */
      subscribeAgentChannel(agentIdentity);
    },

    onWebSocketClose: (event) => {
      console.error(
        "❌ WebSocket closed:",
        event?.code,
        event?.reason
      );

      safeUiUpdate({
        isWsConnected: false,
        message: "انقطع اتصال السيرفر.",
      });
    },

    onWebSocketError: (error) => {
      console.error(
        "⚠️ WebSocket error:",
        error
      );

      safeUiUpdate({
        isWsConnected: false,
        message:
          "حدث خطأ في اتصال السيرفر.",
      });
    },

    onStompError: (frame) => {
      console.error(
        "❌ STOMP protocol error:",
        frame?.headers?.message
      );

      safeUiUpdate({
        isWsConnected: false,
        message:
          frame?.headers?.message ||
          "حدث خطأ في بروتوكول الاتصال.",
      });
    },
  });

  stompClient.activate();
};

// ======================================================
// 2. SUBSCRIBE AGENT CHANNEL
// ======================================================

const subscribeAgentChannel = (
  agentIdentity
) => {
  if (
    !stompClient ||
    !stompClient.connected
  ) {
    console.warn(
      "⚠️ Cannot subscribe. STOMP is not connected."
    );

    return;
  }

  const topic =
    `/topic/agents/${agentIdentity}`;

  console.log(
    "📡 Subscribing to agent channel:",
    topic
  );

  stompClient.subscribe(
    topic,
    async (msg) => {
      // =================================================
      // IMPORTANT:
      // لا تستخدم onUiUpdate من closure هنا.
      //
      // نأخذ callback الحالي وقت وصول event.
      // =================================================

      const uiUpdate =
        currentUiUpdate;

      if (
        typeof uiUpdate !== "function"
      ) {
        console.warn(
          "⚠️ No active Floating UI callback for incoming STOMP event."
        );

        return;
      }

      const payload =
        extractPayload(msg.body);

      // =================================================
      // اطبع الرسالة كاملة
      // =================================================

      console.log(
        "📥 [SERVER EVENT RECEIVED]:",
        msg.body
      );

      if (!payload) {
        console.warn(
          "⚠️ Unable to extract payload from server event."
        );

        return;
      }

      console.log(
        "🚨 [WEBSOCKET EVENT RECEIVED]",
        payload
      );

      // =================================================
      // استخراج callId من أكثر من مكان
      // =================================================

      const incomingCallId =
        payload.callId ||
        payload.callID ||
        payload.call_id ||
        payload.data?.callId ||
        payload.data?.callID ||
        payload.data?.call_id ||
        null;

      const serverStatus =
        normalizeStatus(
          payload.status ||
          payload.callStatus ||
          payload.event ||
          payload.type ||
          payload.data?.status ||
          payload.data?.callStatus ||
          payload.data?.event ||
          payload.data?.type
        );

      console.log(
        "📌 Server status:",
        serverStatus
      );

      console.log(
        "📌 Incoming callId:",
        incomingCallId
      );

      console.log(
        "📌 Current callId:",
        currentCallId
      );

      console.log(
        "📌 Pending local hangup:",
        pendingLocalHangupCallId
      );

      // =================================================
      // حماية من event لمكالمة أخرى
      // =================================================

      if (
        incomingCallId &&
        currentCallId &&
        String(incomingCallId) !==
          String(currentCallId)
      ) {
        console.warn(
          "⚠️ Ignoring event for another call:",
          incomingCallId
        );

        return;
      }

      // =================================================
      // إذا جاء callId من السيرفر وليس موجوداً محلياً
      // =================================================

      if (
        incomingCallId &&
        !currentCallId
      ) {
        currentCallId =
          incomingCallId;

        console.log(
          "🆔 Current callId initialized from server:",
          currentCallId
        );
      }

      // =================================================
      // ACCEPTED
      // =================================================

      switch (serverStatus) {
        case "ACCEPTED": {
          console.log(
            "📞 CUSTOMER ACCEPTED THE CALL"
          );

          currentCallState =
            CALL_STATUS.CONNECTED;

          pendingLocalHangupCallId = null;

          uiUpdate({
            status:
              CALL_STATUS.CONNECTED,

            callId:
              currentCallId,

            event: "ACCEPTED",

            terminal: false,

            message:
              "مكالمة نشطة الآن (العميل متصل).",

            startTimer: true,
          });

          break;
        }

        // =================================================
        // REJECTED
        // =================================================

        case "REJECTED": {
          console.log(
            "🛑 CUSTOMER REJECTED THE CALL"
          );

          await handleCallCleanup(
            CALL_STATUS.REJECTED,
            "تم رفض المكالمة من قبل العميل.",
            {
              event: "REJECTED",
              terminal: true,
              callId:
                currentCallId ||
                incomingCallId,
            }
          );

          break;
        }

        // =================================================
        // CANCELLED
        // =================================================

        case "CANCELLED": {
          console.log(
            "🛑 CALL WAS CANCELLED"
          );

          await handleCallCleanup(
            CALL_STATUS.CANCELLED,
            "تم إلغاء المكالمة.",
            {
              event: "CANCELLED",
              terminal: true,
              callId:
                currentCallId ||
                incomingCallId,
            }
          );

          break;
        }

        // =================================================
        // ENDED
        // =================================================

        case "ENDED": {
          console.log(
            "🏁 CALL WAS ENDED"
          );

          /**
           * هذه هي النقطة الحرجة:
           *
           * currentUiUpdate هو callback الحالي للـ Floating.
           *
           * لذلك ENDED يذهب للـ Floating الصحيح
           * الذي بدأ المكالمة الحالية.
           */

          await handleCallCleanup(
            CALL_STATUS.ENDED,
            "انتهت المكالمة.",
            {
              event: "ENDED",
              terminal: true,
              callId:
                currentCallId ||
                incomingCallId,
            }
          );

          break;
        }

        // =================================================
        // DISCONNECTED / HANGUP
        // =================================================

        case "DISCONNECTED":
        case "HANGUP":
        case "HUNG_UP": {
          console.log(
            "🔌 CALL WAS DISCONNECTED / HUNG UP"
          );

          await handleCallCleanup(
            CALL_STATUS.ENDED,
            "تم إنهاء المكالمة.",
            {
              event:
                serverStatus,
              terminal: true,
              callId:
                currentCallId ||
                incomingCallId,
            }
          );

          break;
        }

        // =================================================
        // UNKNOWN
        // =================================================

        default: {
          console.warn(
            "⚠️ Unknown WebSocket status:",
            serverStatus,
            payload
          );

          break;
        }
      }
    }
  );
};

// ======================================================
// 3. INITIATE OUTBOUND CALL
// ======================================================

export const initiateOutboundCall = async (
  phoneNumber,
  agentJwtToken,
  onUiUpdate
) => {
  // ====================================================
  // IMPORTANT:
  // عند بدء كل مكالمة نحدث callback.
  //
  // هذا هو الإصلاح الأساسي.
  // ====================================================

  setCurrentUiUpdate(onUiUpdate);

  if (
    !stompClient ||
    !stompClient.connected
  ) {
    console.error(
      "❌ Cannot initiate call. STOMP is disconnected."
    );

    safeUiUpdate({
      status: CALL_STATUS.IDLE,
      message:
        "فشل: محرك الاتصال غير متصل بالخادم.",
    });

    return;
  }

  if (!phoneNumber) {
    safeUiUpdate({
      status: CALL_STATUS.IDLE,
      message:
        "رقم الهاتف غير موجود.",
    });

    return;
  }

  if (!agentJwtToken) {
    safeUiUpdate({
      status: CALL_STATUS.IDLE,
      message:
        "رمز الوكيل غير موجود.",
    });

    return;
  }

  try {
    // ==================================================
    // Reset old call state
    // ==================================================

    currentCallId = null;
    currentCallState =
      CALL_STATUS.CONNECTING_TO_ROOM;
    pendingLocalHangupCallId = null;

    safeUiUpdate({
      status:
        CALL_STATUS.CONNECTING_TO_ROOM,
      callId: null,
      terminal: false,
      message:
        "جاري طلب الرقم وبدء الاتصال الصادر...",
    });

    // ==================================================
    // HTTP REQUEST
    // ==================================================

    const response = await fetch(
      `${BACKEND_URL}/api/calls/outbound`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${agentJwtToken}`,
        },

        body: JSON.stringify({
          phoneNumber,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `فشل الخادم في الرد: ${response.status}`
      );
    }

    const jsonResponse =
      await response.json();

    console.log(
      "📞 OUTBOUND RESPONSE:",
      jsonResponse
    );

    if (
      !jsonResponse?.success ||
      !jsonResponse?.data
    ) {
      throw new Error(
        jsonResponse?.message ||
          "استجابة غير صالحة من السيرفر."
      );
    }

    const {
      callId,
      token: livekitToken,
    } =
      jsonResponse.data;

    if (!callId) {
      throw new Error(
        "السيرفر لم يرجع callId."
      );
    }

    if (!livekitToken) {
      throw new Error(
        "السيرفر لم يرجع LiveKit token."
      );
    }

    // ==================================================
    // Save current call
    // ==================================================

    currentCallId = callId;

    currentCallState =
      CALL_STATUS.RINGING;

    safeUiUpdate({
      status: CALL_STATUS.RINGING,
      callId,
      event: "RINGING",
      terminal: false,
      message:
        "جاري الاتصال والرنين عند العميل...",
    });

    // ==================================================
    // Connect agent to LiveKit
    // ==================================================

    await connectAgentToAudioRoom(
      livekitToken
    );
  } catch (error) {
    console.error(
      "❌ Error initiating outbound call:",
      error
    );

    currentCallId = null;
    currentCallState =
      CALL_STATUS.IDLE;
    pendingLocalHangupCallId = null;

    safeUiUpdate({
      status: CALL_STATUS.IDLE,
      callId: null,
      terminal: true,
      event: "INITIATE_ERROR",
      message:
        `فشل بدء المكالمة: ${
          error?.message ||
          "Unknown error"
        }`,
      startTimer: false,
    });
  }
};

// ======================================================
// 4. END ACTIVE OUTBOUND CALL
// ======================================================

export const endActiveOutboundCall =
  async (
    agentJwtToken,
    onUiUpdate
  ) => {
    // ==================================================
    // IMPORTANT:
    // حدثّي callback الحالي أيضاً.
    // ==================================================

    setCurrentUiUpdate(onUiUpdate);

    const callIdToEnd =
      currentCallId;

    // ==================================================
    // No current call
    // ==================================================

    if (!callIdToEnd) {
      console.warn(
        "⚠️ No active call to end."
      );

      safeUiUpdate({
        status: CALL_STATUS.IDLE,
        message:
          "لا توجد مكالمة قائمة.",
        event:
          "NO_ACTIVE_CALL",
        terminal: true,
        callId: null,
        startTimer: false,
      });

      return {
        success: false,
        reason:
          "NO_ACTIVE_CALL",
      };
    }

    // ==================================================
    // Prevent duplicate hangup request
    // ==================================================

    if (
      pendingLocalHangupCallId &&
      String(
        pendingLocalHangupCallId
      ) ===
        String(callIdToEnd)
    ) {
      console.warn(
        "⚠️ Local hangup already requested for this call."
      );

      return {
        success: false,
        reason:
          "HANGUP_ALREADY_PENDING",
        callId:
          callIdToEnd,
      };
    }

    pendingLocalHangupCallId =
      callIdToEnd;

    try {
      const endCallEndpoint =
        `${BACKEND_URL}/api/calls/${callIdToEnd}/end`;

      console.log(
        `🛑 Requesting end for call ${callIdToEnd}`
      );

      const response =
        await fetch(
          endCallEndpoint,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${agentJwtToken}`,
            },
          }
        );

      // =================================================
      // SERVER ACCEPTED REQUEST
      // =================================================

      if (response.ok) {
        console.log(
          "✅ Backend accepted end call request."
        );

        /**
         * مهم جداً:
         *
         * لا نرسل terminal:true هنا.
         *
         * لأن 200 من endpoint لا يعني بالضرورة أن
         * event ENDED وصل إلى الـ WebSocket.
         *
         * النهاية الرسمية تأتي من STOMP:
         *
         * ENDED
         *
         * وبعدها handleCallCleanup()
         * يرسل terminal:true.
         */

        safeUiUpdate({
          status: currentCallState,
          callId: callIdToEnd,
          event: "LOCAL_HANGUP",
          terminal: false,
          startTimer: false,
          message:
            "جاري إنهاء المكالمة...",
        });

        return {
          success: true,
          callId:
            callIdToEnd,
          status:
            response.status,
          waitingForServerEvent:
            true,
        };
      }

      // =================================================
      // SERVER REJECTED REQUEST
      // =================================================

      console.warn(
        `⚠️ End call API returned ${response.status}`
      );

      pendingLocalHangupCallId = null;

      await handleCallCleanup(
        CALL_STATUS.ENDED,
        "تعذر تأكيد إنهاء المكالمة من السيرفر، تم إنهاؤها محلياً.",
        {
          event:
            "LOCAL_HANGUP_API_ERROR",
          terminal: true,
          callId:
            callIdToEnd,
        }
      );

      return {
        success: false,
        callId:
          callIdToEnd,
        status:
          response.status,
      };
    } catch (error) {
      console.error(
        "❌ Error ending outbound call:",
        error
      );

      pendingLocalHangupCallId = null;

      /**
       * هنا فقط نعمل fallback محلي نهائي
       * لأن طلب السيرفر نفسه فشل.
       */

      await handleCallCleanup(
        CALL_STATUS.ENDED,
        "تم إنهاء المكالمة محلياً بسبب تعذر الوصول إلى السيرفر.",
        {
          event:
            "LOCAL_HANGUP_ERROR",
          terminal: true,
          callId:
            callIdToEnd,
        }
      );

      return {
        success: false,
        error:
          error?.message,
        callId:
          callIdToEnd,
      };
    }
  };

// ======================================================
// 5. CONNECT AGENT TO LIVEKIT
// ======================================================

const connectAgentToAudioRoom =
  async (livekitToken) => {
    try {
      // =================================================
      // Create room
      // =================================================

      currentRoom =
        initializeRoom();

      // =================================================
      // Participant Connected
      // =================================================

      currentRoom.on(
        "participantConnected",
        (participant) => {
          console.log(
            "👤 Remote participant connected:",
            participant.identity
          );
        }
      );

      // =================================================
      // Track Subscribed
      // =================================================

      currentRoom.on(
        "trackSubscribed",
        async (
          track,
          publication,
          participant
        ) => {
          console.log(
            "🎧 Track subscribed:",
            participant.identity,
            track.kind
          );

          if (
            track.kind !== "audio"
          ) {
            return;
          }

          const audioElement =
            track.attach();

          audioElement.autoplay =
            true;

          audioElement.style.display =
            "none";

          document.body.appendChild(
            audioElement
          );

          try {
            await audioElement.play();

            console.log(
              "🔊 Remote audio is playing."
            );
          } catch (error) {
            console.error(
              "❌ Audio playback failed:",
              error
            );
          }
        }
      );

      // =================================================
      // Connect LiveKit
      // =================================================

      await connectToLiveKit(
        currentRoom,
        livekitToken
      );

      // =================================================
      // Enable microphone
      // =================================================

      await toggleMicrophone(
        currentRoom,
        true
      );

      // =================================================
      // LIVEKIT CONNECTED
      //
      // هذا ليس ACCEPTED.
      // ACCEPTED يأتي من STOMP.
      // =================================================

      safeUiUpdate({
        status: CALL_STATUS.RINGING,
        callId: currentCallId,
        room: currentRoom,
        event:
          "LIVEKIT_CONNECTED",
        terminal: false,
        message:
          "تم تجهيز الاتصال الصوتي، بانتظار قبول العميل...",
      });

      // =================================================
      // Debug after 3 seconds
      // =================================================

      setTimeout(() => {
        if (!currentRoom) {
          console.log(
            "🔍 [DEBUG] No active LiveKit room."
          );

          return;
        }

        console.log(
          `🔍 [DEBUG] Current room: ${currentRoom.name}`
        );

        const participantCount =
          currentRoom.remoteParticipants
            .size;

        console.log(
          `🔍 [DEBUG] Remote participants: ${participantCount}`
        );

        if (
          participantCount > 0
        ) {
          currentRoom.remoteParticipants.forEach(
            (participant) => {
              console.log(
                `👤 [DEBUG] Existing participant: ${participant.identity}`
              );

              participant.trackPublications.forEach(
                (publication) => {
                  if (
                    publication.track &&
                    publication.kind ===
                      "audio"
                  ) {
                    console.log(
                      `🔊 [DEBUG] Existing audio track: ${participant.identity}`
                    );

                    const audioElement =
                      publication.track.attach();

                    audioElement.autoplay =
                      true;

                    audioElement.style.display =
                      "none";

                    document.body.appendChild(
                      audioElement
                    );

                    audioElement
                      .play()
                      .catch(
                        (error) => {
                          console.error(
                            "❌ Existing audio playback failed:",
                            error
                          );
                        }
                      );
                  }
                }
              );
            }
          );
        } else {
          console.warn(
            "⚠️ [DEBUG] Room is currently empty."
          );
        }
      }, 3000);
    } catch (error) {
      console.error(
        "❌ LiveKit connection error:",
        error
      );

      await handleCallCleanup(
        CALL_STATUS.IDLE,
        "خطأ في تهيئة الصوت الداخلي للمكالمة.",
        {
          event:
            "LIVEKIT_ERROR",
          terminal: true,
          callId:
            currentCallId,
        }
      );
    }
  };

// ======================================================
// 6. CLEANUP
// ======================================================

const handleCallCleanup =
  async (
    targetState,
    message,
    metadata = {}
  ) => {
    console.log(
      "🧹 Starting call cleanup:",
      {
        targetState,
        message,
        metadata,
      }
    );

    // =================================================
    // Save call id BEFORE reset
    // =================================================

    const endedCallId =
      metadata.callId ||
      currentCallId;

    // =================================================
    // Capture current UI callback BEFORE doing anything
    //
    // حتى لو تم تغيير reference لاحقاً،
    // event الحالي سيصل إلى Floating الصحيح.
    // =================================================

    const uiUpdate =
      currentUiUpdate;

    // =================================================
    // Update internal state
    // =================================================

    currentCallState =
      targetState;

    // =================================================
    // Reset pending hangup state
    // =================================================

    if (
      !pendingLocalHangupCallId ||
      !endedCallId ||
      String(
        pendingLocalHangupCallId
      ) ===
        String(endedCallId)
    ) {
      pendingLocalHangupCallId =
        null;
    }

    // =================================================
    // Disconnect LiveKit
    // =================================================

    if (currentRoom) {
      try {
        currentRoom.disconnect();

        console.log(
          "🔌 LiveKit disconnected successfully."
        );
      } catch (error) {
        console.error(
          "❌ Error disconnecting LiveKit:",
          error
        );
      }

      currentRoom = null;
    }

    // =================================================
    // Terminal UI update
    // =================================================

    /**
     * لا نستخدم safeUiUpdate هنا مباشرة.
     *
     * نستخدم callback الذي كان حالياً عند لحظة
     * استقبال event.
     *
     * هذا يمنع race condition إذا حصل reset
     * مباشرة بعد event.
     */

    if (
      typeof uiUpdate === "function"
    ) {
      try {
        uiUpdate({
          status: targetState,

          event:
            metadata.event ||
            normalizeStatus(
              targetState
            ),

          terminal:
            metadata.terminal !==
            false,

          callId:
            endedCallId,

          room: null,

          message,

          startTimer: false,
        });
      } catch (error) {
        console.error(
          "❌ Error sending cleanup event to Floating:",
          error
        );
      }
    } else {
      console.warn(
        "⚠️ No UI callback available during cleanup:",
        {
          targetState,
          endedCallId,
        }
      );
    }

    // =================================================
    // IMPORTANT:
    // reset currentCallId AFTER sending UI event
    // =================================================

    currentCallId = null;

    console.log(
      `🏁 Cleanup completed. Final state: ${targetState}`
    );
  };

// ======================================================
// 7. STOP OUTBOUND ENGINE
// ======================================================

export const stopAgentOutboundEngine =
  async (
    onUiUpdate
  ) => {
    console.log(
      "🛑 Stopping outbound engine..."
    );

    // =================================================
    // Update current callback
    // =================================================

    if (
      typeof onUiUpdate ===
      "function"
    ) {
      setCurrentUiUpdate(
        onUiUpdate
      );
    }

    // =================================================
    // Cleanup active call
    // =================================================

    if (
      currentCallId ||
      currentRoom
    ) {
      await handleCallCleanup(
        CALL_STATUS.IDLE,
        "تم إغلاق محرك المكالمات.",
        {
          event:
            "ENGINE_STOPPED",
          terminal: true,
        }
      );
    }

    // =================================================
    // Disconnect STOMP
    // =================================================

    if (stompClient) {
      try {
        await stompClient.deactivate();

        console.log(
          "🔌 STOMP disconnected."
        );
      } catch (error) {
        console.error(
          "❌ Error disconnecting STOMP:",
          error
        );
      }

      stompClient = null;
    }

    // =================================================
    // Reset engine state
    // =================================================

    currentAgentIdentity =
      null;

    currentCallId = null;

    currentCallState =
      CALL_STATUS.IDLE;

    pendingLocalHangupCallId =
      null;

    clearCurrentUiUpdate();
  };