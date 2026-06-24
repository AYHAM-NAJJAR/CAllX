import axios from "axios";
import { BASE_URL, pdf } from "../Api/endpoints"; 

export const exportAnalyticsPDF = async (token) => {
  try {
  
    const response = await axios.get(`${BASE_URL}${pdf}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', 
    });
    
    // 2. معالجة الـ Blob وإنشاء رابط التحميل المؤقت في المتصفح
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // 3. إنشاء عنصر HTML وهمي لتفعيل التنزيل التلقائي
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // تسمية ملف الـ PDF بتاريخ اليوم الديناميكي
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Analytics-Report-${today}.pdf`);
    
    // 4. محاكاة النقر على الزر لبدء التحميل ثم تنظيف الذاكرة
    document.body.appendChild(link);
    link.click();
    
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return true; // إرجاع true كمؤشر على نجاح العملية بالكامل
  } catch (error) {
    console.error("Export PDF Error:", error);
    throw error;
  }
};