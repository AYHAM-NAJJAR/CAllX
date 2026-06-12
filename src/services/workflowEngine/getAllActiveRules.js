import axios from "axios";
import { BASE_URL, rule } from "../Api/endpoints";




export const allRules = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${rule}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
    
  } catch (error) {
    console.error("GET Departments Error:", error);

    throw error;
  }
};