
import axios from "axios";
import { BASE_URL, onerule } from "../Api/endpoints";

export const deleteFlow = async (id, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}${onerule}${id}`,
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Delete Work Flow Done",
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