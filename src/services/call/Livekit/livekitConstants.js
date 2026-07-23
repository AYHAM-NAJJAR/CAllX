export const LIVEKIT_SERVER_URL = "ws://153.75.91.83:7880";

export const CALL_STATUS = {
  // --- حالات الباك إند الأساسية ---
  QUEUED: "QUEUED",
  IVR: "IVR",
  IVR_GATHER: "IVR_GATHER",
  IVR_TRANSFER: "IVR_TRANSFER",
  RINGING: "RINGING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
  ENDED: "ENDED",
  MISSED: "MISSED",

  // --- حالات داخلية للفرونت إند ---
  IDLE: "IDLE",
  CONNECTING_TO_ROOM: "CONNECTING_TO_ROOM",
  CONNECTED: "CONNECTED" // تم الإصلاح: كانت "ACCEPTED" بالخطأ
};

export const DEFAULT_ROOM_OPTIONS = {
  adaptiveStream: true,
  dynacast: true,
  publishDefaults: {
    audioBitrate: 32000
  }
};