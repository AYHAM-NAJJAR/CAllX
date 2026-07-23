// services/UserManagement/UpdateUser.js

import axios from "axios";

import { BASE_URL, deletecustomer} from "../../Api/endpoints";

export const deleteCustomer = async (id, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}${deletecustomer}${id}`,
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    return {
      success: true,
      message: "Delete Customer Done",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update user",
    };
  }
};