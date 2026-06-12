import axios from "axios";
import { BASE_URL, getallInActiveFields} from "../Api/endpoints";



export const allInActiveFields = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${getallInActiveFields}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("GET Departments Error:", error);

    throw error;
  }
};