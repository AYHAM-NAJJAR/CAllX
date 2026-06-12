// services/UserManagement/UpdateUser.js

import axios from "axios";
import { BASE_URL, disable} from "../Api/endpoints";

export const SoftDeleteField = async (id, token) => {
  console.log(id);
  try {
    const response = await axios.delete(
      `${BASE_URL}${disable}${id}`,
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Disable Field",
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