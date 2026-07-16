// services/UserManagement/UpdateUser.js

import axios from "axios";

import { BASE_URL, deletetags } from "../../Api/endpoints";

export const deleteTag = async (id, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}${deletetags}${id}`,
      
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
      message: "Delete Tag Done",
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