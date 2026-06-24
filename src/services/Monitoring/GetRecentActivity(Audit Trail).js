import axios from "axios";
import { auditing, BASE_URL} from "../Api/endpoints";


export const Auditing = async (token, limit) => {
  
  const url = `${BASE_URL}${auditing}?limit=${limit}`;
    
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("GET Audit Logs Error:", error);
    throw error;
  }
};