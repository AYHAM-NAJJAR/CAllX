import axios from "axios";
import { BASE_URL, performancemetrics} from "../Api/endpoints";



export const GetPerformanceMetrics = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${performancemetrics}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("GET Departments Error:", error);

    throw error;
  }
};