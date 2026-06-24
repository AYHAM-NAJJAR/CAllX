import axios from "axios";

import {SECONDARY_URL, transfernode } from "../../../Api/endpoints";

export const createTransferNode = async (payload, flowId , token) => {
  try {
    const response = await axios.post(
      `${SECONDARY_URL}${transfernode}${flowId}/nodes`, 
      payload, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data.data, 
        message: response.data.message,
      };
    }

    return {
      success: false,
      message: `Unexpected server response (${response.status})`,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};