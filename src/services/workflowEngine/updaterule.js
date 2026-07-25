// services/UserManagement/UpdateUser.js

import axios from "axios";
import { BASE_URL, onerule} from "../Api/endpoints";

export const updateRule = async (id, requestPayload, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${onerule}${id}`,
      requestPayload,
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
      message: "Rule updated successfully",
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