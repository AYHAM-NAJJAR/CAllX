import axios from "axios";

import { BASE_URL,  getleads } from "../../Api/endpoints";



export const getLeads = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${getleads}`, {
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