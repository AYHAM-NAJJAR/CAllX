import axios from "axios";

import { BASE_URL, ticketstats } from "../Api/endpoints";

// 1. دالة جلب البيانات (API Call)
export const getStats = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${ticketstats}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("GET System Stats Error:", error); // تم تعديل رسالة الخطأ هنا
    throw error;
  }
};