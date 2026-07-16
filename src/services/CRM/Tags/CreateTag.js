import axios from "axios";
import { BASE_URL, createtag } from "../../Api/endpoints";

export const createTag = async (tagName, token, tenantId) => {
 

  try {
    const response = await axios.post(
      `${BASE_URL}${createtag}`,
      {}, 
      {
        params: {
          name: tagName,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": tenantId 
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: "Create Tag Successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: `Unexpected server response (${response.status})`,
    };
  } catch (error) {
    console.error("Create Tag Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Error connecting to server",
    };
  }
};