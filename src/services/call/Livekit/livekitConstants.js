export const LIVEKIT_SERVER_URL = "ws://153.75.91.83:7880";

export const CALL_STATUS = {
  // --- حالات الباك إند الأساسية (تطابق الـ Enum في Spring Boot) ---
  QUEUED: "QUEUED",             // المكالمة في الانتظار بالدور
  IVR: "IVR",                   // المكالمة حالياً في نظام الرد الآلي
  IVR_GATHER: "IVR_GATHER",     // الرد الآلي يجمع مدخلات من العميل
  IVR_TRANSFER: "IVR_TRANSFER", // الرد الآلي يقوم بتحويل المكالمة
  RINGING: "RINGING",           // الهاتف يرن عند الوكيل (تبدأ نغمة الرنين) [cite: 26]
  ACCEPTED: "ACCEPTED",         // تم قبول المكالمة (استلام توكن الـ LiveKit) [cite: 30]
  REJECTED: "REJECTED",         // تم رفض المكالمة من قبل الوكيل [cite: 38]
  CANCELLED: "CANCELLED",       // تم إلغاء المكالمة من طرف المتصل قبل الرد [cite: 38]
  ENDED: "ENDED",               // انتهت المكالمة بشكل طبيعي [cite: 38]
  MISSED: "MISSED",             // مكالمة فائتة (لم يرد الوكيل خلال المهلة)

  // --- حالات داخلية للفرونت إند لإدارة الـ UI بسلاسة ---
  IDLE: "IDLE",                           // الوضع الافتراضي (انتظار مكالمات)
  CONNECTING_TO_ROOM: "CONNECTING_TO_ROOM" // مرحلة الربط بسيرفر LiveKit بعد الـ ACCEPTED وقبل بث الصوت
};

export const DEFAULT_ROOM_OPTIONS = {
  adaptiveStream: true,
  dynacast: true,
  publishDefaults: {
    audioBitrate: 32000 // معدل بت مثالي وموفر للباندويدث في اتصالات الـ VoIP
  }
};