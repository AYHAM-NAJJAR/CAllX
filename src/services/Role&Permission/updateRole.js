import axios from "axios";
import { BASE_URL, updaterole} from "../Api/endpoints";

export const updateRole = async (roleID, token, updateData) => {
  try {
    const response = await axios.put( // أو patch حسب الـ API لديك
      `${BASE_URL}${updaterole}/${roleID}`,
      updateData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: response.data.message || "Role updated successfully",
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update role",
    };
  }
};