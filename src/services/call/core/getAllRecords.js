import axios from 'axios';
import { SECONDARY_URL } from '../../Api/endpoints';


export const fetchCallRecords = async (callId, token) => {
  try {
    const response = await axios.get(`${SECONDARY_URL}/calls/${callId}/recording`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob', // ضروري جداً لأن الرد عبارة عن ملف صوتي وليس JSON
    });

    // تحويل البيانات المستلمة (Blob) إلى رابط مؤقت يمكن استخدامه في المتصفح
    const audioBlob = new Blob([response.data], { type: response.headers['content-type'] || 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return audioUrl;
  } catch (error) {
    console.error('Error fetching call recording:', error);
    throw new Error(error.response?.data?.message || 'فشل في تحميل تسجيل المكالمة');
  }
};