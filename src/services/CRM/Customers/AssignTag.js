import axios from "axios";
import { assigntag, BASE_URL } from "../../Api/endpoints";

export const AssignTag = async (tagId, token, customerId) => {
  console.log("Parameters received:", { tagId, token, customerId });
  try {
    const response = await axios.post(
      `${BASE_URL}${assigntag}${customerId}/tags/${tagId}`, 
      {}, // 1. البارامتر الثاني: جسم الطلب (Body) نتركه فارغاً 
      {   // 2. البارامتر الثالث: الإعدادات والترويسات (Headers)
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: "Assign Tag Successfully",
      };
    }

    return {
      success: false,
      message: `Unexpected server response (${response.status})`,
    };
  } catch (error) {
    console.error("Error assigning tag:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};