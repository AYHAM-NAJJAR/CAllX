import axios from "axios";
import { activate, BASE_URL } from "../Api/endpoints";

export const ActivateField = async (id, token) => {
  console.log("hi");
  try {
    const response = await axios.patch(
      `${BASE_URL}${activate}${id}/activate`,{},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    return {
      success: true,
      message: "Field Activated Successfully", // تعديل الرسالة لتكون أوضح بالتوست
    };
    
  } catch (error) {
  console.log(error);
  console.log(error.response);
  console.log(error.response?.data);

  return {
    success: false,
    message:
      error.response?.data?.message ||
      error.message ||
      "Failed to activate field",
  };
}
};