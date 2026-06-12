import axios from "axios";
import { BASE_URL, rule} from "../Api/endpoints"; // ملاحظة: تأكد إن كان الـ endpoint لإنشاء مستخدم أو قسم


export const createWorkflowRule = async (requestPayload, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${rule}`, 
      requestPayload, 
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
        message: "Create Workflow Done",
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