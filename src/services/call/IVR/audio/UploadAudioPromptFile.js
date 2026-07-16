
import axios from 'axios';
import { SECONDARY_URL, uploadaudio } from '../../../Api/endpoints';

export async function uploadAudioService(file, token) {

  console.log(file);
  const formData = new FormData();
  formData.append('file', file); // الـ key المطلوب من الـ Backend هو file

  try {
    const response = await axios.post(`${SECONDARY_URL}${uploadaudio}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        
      },
    });

    
    const result = response.data.data.audioUrl;
    
    // جلب الـ URL بناءً على الهيكل المتوقع من الـ API لديك
    return result;

  } catch (error) {
    console.error('❌ Error uploading audio file via Axios:', error?.response?.data || error.message);
    return null;
  }
}