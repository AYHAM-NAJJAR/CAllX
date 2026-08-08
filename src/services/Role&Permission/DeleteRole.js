// services/UserManagement/UpdateUser.js

import axios from "axios";
import { BASE_URL, deleterole } from "../Api/endpoints";

export const deleteRole = async (id, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}${deleterole}${id}`,
      
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