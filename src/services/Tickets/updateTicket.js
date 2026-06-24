// services/UserManagement/UpdateUser.js

import axios from "axios";
import { BASE_URL, updateticket } from "../Api/endpoints";

export const updateTicket = async (id, data, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${updateticket}${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
      message: "User updated successfully",
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