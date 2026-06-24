import axios from "axios";
import { BASE_URL, csv } from "../Api/endpoints";

export const exportCSV = async (token) => {
  try {
    // 1. جلب بيانات الملف كـ blob من السيرفر
    const response = await axios.get(`${BASE_URL}${csv}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // مهم جداً: لتخبر axios أنك تستقبل ملفاً
    });
    
    // 2. معالجة الـ Blob وإنشاء رابط التحميل المؤقت في المتصفح (مع تحديد نوع الـ MIME لملفات CSV)
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // 3. إنشاء عنصر HTML وهمي لتفعيل التنزيل التلقائي
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // تسمية ملف الـ CSV بتاريخ اليوم الديناميكي
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Tickets-report-${today}.csv`);
    
    // 4. محاكاة النقر على الزر لبدء التحميل ثم تنظيف الذاكرة
    document.body.appendChild(link);
    link.click();
    
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return true; // إرجاع true كمؤشر على نجاح العملية بالكامل
  } catch (error) {
    console.error("Export CSV Error:", error);
    throw error;
  }
};