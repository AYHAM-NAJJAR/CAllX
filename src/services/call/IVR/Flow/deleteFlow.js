// services/UserManagement/UpdateUser.js

import axios from "axios";
import { deleteflow, SECONDARY_URL } from "../../../Api/endpoints";


export const deleteFlow = async (id, token) => {
  try {
    const response = await axios.delete(
      `${SECONDARY_URL}${deleteflow}${id}`,
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: response.data.message,
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