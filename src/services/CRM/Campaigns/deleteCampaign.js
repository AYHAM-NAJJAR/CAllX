// services/UserManagement/UpdateUser.js

import axios from "axios";

import { BASE_URL, deletecampaign } from "../../Api/endpoints";

export const deleteCampaign = async (id, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}${deletecampaign}${id}`,
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    return {
      success: true,
      message: "Delete Campaign Done",
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