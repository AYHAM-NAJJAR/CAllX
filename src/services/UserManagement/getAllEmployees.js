import axios from "axios";
import { BASE_URL, getEmps } from "../Api/endpoints";



export const allEmployees = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${getEmps}`, {
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