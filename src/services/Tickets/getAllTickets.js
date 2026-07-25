import axios from "axios";
import { BASE_URL, getAllTickets } from "../Api/endpoints";

export const allTickets = async (
  token,
  page = 0,
  size = 20,
  department = "",
  status = "",
  priority = "",
  sort = "createdAt,desc" // 👈 إضافة الترتيب الافتراضي
) => {
  try {
    const params = {
      page,
      size,
    };

    if (sort) {
      params.sort = sort; // 👈 إرسال معلمة الترتيب للسيرفر
    }

    if (department) {
      params.department = department;
    }

    if (status) {
      params.status = status;
    }

    if (priority) {
      params.priority = priority;
    }

    const response = await axios.get(`${BASE_URL}${getAllTickets}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error("GET Tickets Error:", error);
    throw error;
  }
};