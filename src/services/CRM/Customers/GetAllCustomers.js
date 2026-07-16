import axios from "axios";

import { BASE_URL, getcustomers } from "../../Api/endpoints";



export const GetAllCustomers = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${getcustomers}`, {
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