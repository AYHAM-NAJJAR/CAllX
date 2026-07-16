import axios from "axios";
import { runaudio, SECONDARY_URL } from "../../../Api/endpoints";

export const runAudio = async (audio, token) => {
  try {
    const response = await axios.get(`${SECONDARY_URL}${runaudio}${audio}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", 
    });
    
    
    return response.data; 
  } catch (error) {
    
    console.error("Fetch Audio Error:", error); 
    throw error;
  }
};