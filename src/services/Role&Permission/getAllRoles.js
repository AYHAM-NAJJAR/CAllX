import axios from "axios";
import { allRoles, BASE_URL } from "../Api/endpoints";



export const getAllRoles = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${allRoles}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {success:true , roles: response.data};
  } catch (error) {
    console.error("GET Departments Error:", error);

    throw error;
  }
};