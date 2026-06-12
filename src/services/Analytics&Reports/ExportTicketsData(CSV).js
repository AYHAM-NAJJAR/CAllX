import axios from "axios";
import { BASE_URL, csv} from "../Api/endpoints";



export const exportCSV = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${csv}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // مهم جداً: لتخبر axios أنك تستقبل ملفاً
    });
    return response.data; 
  } catch (error) {
    console.error("Export CSV Error:", error);
    throw error;
  }
};