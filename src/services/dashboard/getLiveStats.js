import axios from "axios";
import { BASE_URL, livestats } from "../Api/endpoints";



export const liveStats = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${livestats}`, {
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