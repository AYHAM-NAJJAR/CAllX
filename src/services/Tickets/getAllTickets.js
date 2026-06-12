import axios from "axios";
import { BASE_URL, getAllTickets} from "../Api/endpoints";



export const allTickets = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${getAllTickets}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data.content;
  } catch (error) {
    console.error("GET Departments Error:", error);

    throw error;
  }
};