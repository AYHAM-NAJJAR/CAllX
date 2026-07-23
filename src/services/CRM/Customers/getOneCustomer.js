import axios from "axios";

import { BASE_URL, getonecustomer } from "../../Api/endpoints";



export const  getOneCustomer = async (token,customerId) => {
  try {
    const response = await axios.get(`${BASE_URL}${getonecustomer}${customerId}`, {
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