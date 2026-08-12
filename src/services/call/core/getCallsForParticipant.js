import axios from "axios";
import { getcallparticipant, SECONDARY_URL } from "../../Api/endpoints";



export const getParticipantCalls = async (token, identity, page = 0, size = 20) => {
  try {
    const response = await axios.get(
      `${SECONDARY_URL}${getcallparticipant}/${identity}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          page: page,
          size: size,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    
    if (error.response) {
      
      console.error("Server Error:", error.response.data);
      throw new Error(error.response.data.message || "Failed to fetch participant calls");
    } else if (error.request) {
     
      console.error("Network Error:", error.request);
      throw new Error("Network error - please check your connection");
    } else {
      
      console.error("Request Error:", error.message);
      throw new Error("Error setting up the request");
    }
  }
};


