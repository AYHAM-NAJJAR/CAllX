import axios from "axios";
import { BASE_URL, createticket } from "../Api/endpoints";

export const createTicket = async (ticketData, imageFile, token) => {
  console.log(ticketData);
  try {
    const payload = new FormData();
    
    // 1. إضافة الـ data وتحويلها إلى Blob بنوع application/json (مطابق لـ Postman)
    payload.append(
      "data",
      new Blob([JSON.stringify(ticketData)], { type: "application/json" })
    );

    // 2. إضافة الصورة إذا وجدت
    if (imageFile) {
      payload.append("images", imageFile);
    }

    // 3. الإرسال دون تحديد Content-Type يدوياً لكي يقوم Axios بوضعه تلقائياً مع الـ Boundary
    const response = await axios.post(`${BASE_URL}${createticket}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error inside createTicket service:", error.response?.data || error.message);
    throw error; 
  }
};