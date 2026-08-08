import axios from "axios";
import { BASE_URL } from "../Api/endpoints";



export const toggleSettingStatus = async (key, active, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/settings/${key}/toggle-status?active=${active}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Toggle Setting Status Error:", error);
    throw error;
  }
};