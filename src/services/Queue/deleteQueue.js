
import axios from "axios";
import { deletequeue, SECONDARY_URL } from "../Api/endpoints";


export const deleteQueue = async (qid, token) => {
  try {
    const response = await axios.delete(
      `${SECONDARY_URL}${deletequeue}${qid}`,
      
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