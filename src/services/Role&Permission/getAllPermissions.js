import axios from "axios";
import { BASE_URL, getAllPermissions } from "../Api/endpoints";



export const allPermissions = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${getAllPermissions}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {success:true , permissions: response.data};
  } catch (error) {
    console.error("GET Departments Error:", error);

    throw error;
  }
};