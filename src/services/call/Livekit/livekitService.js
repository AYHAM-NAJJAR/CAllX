import { Room } from 'livekit-client';
import { LIVEKIT_SERVER_URL, DEFAULT_ROOM_OPTIONS } from './livekitConstants';

/**
 * دالة لإنشاء كائن الغرفة (Room Instance) وتهيئته بالإعدادات القياسية
 */
export const initializeRoom = () => {
  return new Room(DEFAULT_ROOM_OPTIONS);
};

/**
 * دالة الاتصال بسيرفر LiveKit باستخدام الرابط المعياري والتوكن المستلم
 */
export const connectToLiveKit = async (room, token) => {
  if (!token) {
    throw new Error('لا يمكن الاتصال بسيرفر LiveKit بدون توكن صلاحية مؤقت.');
  }
  
  try {
    // تم إصلاح الخطأ: استخدام الثابت المستورد لضمان قراءة بروتوكول ws:// والرابط الصحيح
    await room.connect(LIVEKIT_SERVER_URL, token);
    console.log('تم الاتصال بنجاح بسيرفر الصوت لـ LiveKit داخل الغرفة:', room.name);
    
    // تفعيل الميكروفون تلقائياً فور الاتصال الناجح لبدء البث المباشر
    await toggleMicrophone(room, true);
    
    return room;
  } catch (error) {
    console.error('خطأ فادح أثناء الاتصال بـ LiveKit Media Server:', error);
    throw error;
  }
};

/**
 * دالة التحكم بحالة الميكروفون (كتم / تفعيل) للوكيل
 */
export const toggleMicrophone = async (room, isEnabled) => {
  if (room && room.localParticipant) {
    try {
      await room.localParticipant.setMicrophoneEnabled(isEnabled);
      console.log(`تم ${isEnabled ? 'تفعيل' : 'كتم'} الميكروفون بنجاح للوكيل.`);
    } catch (error) {
      console.error('فشل التحكم في حالة الميكروفون:', error);
    }
  }
};