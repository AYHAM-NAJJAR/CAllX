import axios from "axios";

import { alltenants, BASE_URL } from "../Api/endpoints";



export const getAllTenants = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${alltenants}`, {
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