import axios from "axios";
import { BASE_URL, monitorysystemstats} from "../Api/endpoints";



export const GetSystemStatsHealth = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${monitorysystemstats}`, {
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