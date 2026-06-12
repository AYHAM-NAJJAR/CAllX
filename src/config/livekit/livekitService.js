import { Room } from 'livekit-client';
import { LIVEKIT_SERVER_URL, DEFAULT_ROOM_OPTIONS } from './livekitConstants';

/**
 * دالة لإنشاء كائن الغرفة وتهيئته بالإعدادات القياسية
 */
export const initializeRoom = () => {
  return new Room(DEFAULT_ROOM_OPTIONS);
};


export const connectToLiveKit = async (room, token) => {
  if (!token) {
    throw new Error('لا يمكن الاتصال بسيرفر LiveKit بدون توكن صلاحية válido');
  }
  
  try {
    await room.connect(LIVEKIT_SERVER_URL, token);
    return room;
  } catch (error) {
    console.error('خطأ أثناء الاتصال بـ LiveKit:', error);
    throw error;
  }
};


export const toggleMicrophone = async (room, isEnabled) => {
  if (room && room.localParticipant) {
    await room.localParticipant.setMicrophoneEnabled(isEnabled);
  }
};