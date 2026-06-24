import axios from "axios";
import { agentsmetrics, BASE_URL} from "../Api/endpoints";



export const AgentsPerformanceMetrics = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${agentsmetrics}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("GET Metrics Error:", error);

    throw error;
  }
};