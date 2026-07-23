// src/services/CRM/Customers/GetAgents.js
import axios from 'axios'; // أو أي ميثود مخصصة تستخدمها في مشروعك مثل api.get
import { BASE_URL, getagents } from '../../Api/endpoints';

export const getAgents = async (token) => {
  try {
    // افترضت هنا أن الرابط الأساسي مُعرف مسبقاً، يمكنك تعديله ليتناسب مع مكتبة الـ API لديك
    const response = await axios.get(`${BASE_URL}${getagents}?type=AGENT`, {
      headers: {
        Authorization: `Bearer ${token}`, // أو حسب الطريقة التي ترسل بها التوكن في مشروعك
      },
    });
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error;
  }
};