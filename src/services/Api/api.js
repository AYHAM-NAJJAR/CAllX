// api.js
import axios from "axios";
import { BASE_URL } from "./endpoints"; // تأكد من المسار الصحيح

const api = axios.create({
  baseURL: BASE_URL,
});
// api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let statusCode = 503; // الكود الافتراضي للسيرفر المطفي
    let errorMessage = "Service Temporarily Unavailable"; // الرسالة الافتراضية

    if (error.response) {
      statusCode = error.response.status;
      // محاولة جلب الرسالة من السيرفر إذا كانت موجودة
      errorMessage = error.response.data?.message || errorMessage;
    } else {
      // هذه الحالة تعني أن السيرفر مطفي تماماً (Network Error)
      errorMessage = "Server is currently offline";
    }

    // إرسال الكود والرسالة معاً
    window.dispatchEvent(new CustomEvent('service-down', { 
      detail: { code: statusCode, message: errorMessage } 
    }));
    
    return Promise.reject(error);
  }
);

export default api; 