import axios from "axios";

import { allactive, BASE_URL } from "../Api/endpoints";



export const getAllSettings = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${allactive}`, {
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