import axios from "axios";
import { BASE_URL, getallFields} from "../Api/endpoints";



export const allFields = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${getallFields}`, {
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