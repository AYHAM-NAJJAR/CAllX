import axios from "axios";
import { BASE_URL, getoneticket} from "../Api/endpoints";



export const  getTicketByID = async (token,ticketId) => {
  try {
    const response = await axios.get(`${BASE_URL}${getoneticket}${ticketId}`, {
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