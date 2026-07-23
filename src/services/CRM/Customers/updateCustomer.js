import axios from "axios";
import { BASE_URL, updatecustomer } from "../../Api/endpoints";

export const updateCustomer = async (payload, token, customerId) => {
  try {
  
    const url =`${BASE_URL}${updatecustomer}${customerId}`;

    const response = await axios.put(
      url, 
      payload, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: response.data?.message || "Customer updated successfully",
      };
    }

    return {
      success: false,
      message: `Unexpected server response (${response.status})`,
    };
  } catch (error) {
    console.error("Error updating customer:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};