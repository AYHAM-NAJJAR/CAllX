import axios from "axios";

import { BASE_URL, customerprofile } from "../../Api/endpoints";



export const  GetCustomerProfile = async (token,customerId) => {
    
  try {
    const response = await axios.get(`${BASE_URL}${customerprofile}${customerId}/profile`, {
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