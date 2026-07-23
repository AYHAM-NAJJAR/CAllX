import axios from "axios";

import { BASE_URL, getonelead } from "../../Api/endpoints";



export const  getOneLead = async (token,leadId) => {
  try {
    const response = await axios.get(`${BASE_URL}${getonelead}${leadId}`, {
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