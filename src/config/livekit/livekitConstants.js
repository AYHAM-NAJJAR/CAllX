


export const CALL_STATUS = {
  IDLE: 'IDLE',
  INITIATING: 'INITIATING',
  RINGING: 'RINGING',
  CONNECTED: 'CONNECTED',
  FAILED: 'FAILED',
  DISCONNECTED: 'DISCONNECTED'
};

// خيارات الغرفة الافتراضية لتحسين الأداء واستهلاك البيانات (Bandwidth)
export const DEFAULT_ROOM_OPTIONS = {
  adaptiveStream: true, // يقلل جودة الفيديو تلقائياً إذا كانت الشاشة صغيرة أو الإنترنت ضعيف
  dynacast: true,       // يوقف إرسال الفيديو إذا لم يكن هناك مستمع له
  publishDefaults: {
    audioBitrate: 32000, // جودة صوت ممتازة ومناسبة جداً لمراكز الاتصال دون استهلاك ضخم
  }
};