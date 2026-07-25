import axios from "axios";
import { BASE_URL, getone} from "../Api/endpoints";



export const  fetchTicketFieldDefinitionById = async (token,fieldId) => {
  try {
    const response = await axios.get(`${BASE_URL}${getone}${fieldId}`, {
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