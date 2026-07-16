import axios from "axios";

import { BASE_URL,  tags } from "../../Api/endpoints";



export const GetAllTags = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${tags}`, {
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