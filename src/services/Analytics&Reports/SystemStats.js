import axios from "axios";
import {BASE_URL, systemstats} from "../Api/endpoints";



export const SystemStats = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${systemstats}`, {
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