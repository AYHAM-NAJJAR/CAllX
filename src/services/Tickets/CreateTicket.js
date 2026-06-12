import axios from "axios";
import { BASE_URL, createticket } from "../Api/endpoints";


export const createTicket = async (ticketData, imageFile, token) => {
  try {
    
    const payload = new FormData();
    payload.append("data", JSON.stringify(ticketData));

    if (imageFile) {
      payload.append("images", imageFile);
    }

    
    const response = await axios.post(`${BASE_URL}${createticket}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  } catch (error) {
    console.error("Error inside createTicket service:", error.response?.data || error.message);
    throw error; 
  }
};