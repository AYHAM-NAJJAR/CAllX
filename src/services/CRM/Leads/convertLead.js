import axios from "axios";
import { BASE_URL, convertlead } from "../../Api/endpoints";

export const convertLead = async (leadId ,data, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${convertlead}${leadId}/convert`,
      data, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};