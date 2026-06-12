import axios from "axios";
import {BASE_URL, onerule} from "../Api/endpoints";

export const ActivateFlow = async (id, token) => {
  console.log("hi");
  try {
    const response = await axios.patch(
      `${BASE_URL}${onerule}${id}/toggle`,{},
      {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
      }
    );
    
    return {
      success: true,
      message: "Field Activated Successfully",
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