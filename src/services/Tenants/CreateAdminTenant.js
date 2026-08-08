import axios from "axios";
import { BASE_URL, createadmintenant} from "../Api/endpoints";



export const CreateAdminTenantF = async (payload, token) => {
    console.log(payload);
  try {
    const response = await axios.post(
      `${BASE_URL}${createadmintenant}`, 
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
        message: "Admmin Tenant Created ",
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