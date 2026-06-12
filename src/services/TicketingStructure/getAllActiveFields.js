import axios from "axios";
import { BASE_URL, getallActiveFields} from "../Api/endpoints";



export const allActiveFields = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${getallActiveFields}`, {
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