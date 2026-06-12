import axios from "axios";
import { BASE_URL, getAllDepartments } from "../Api/endpoints";



export const allDepartments = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}${getAllDepartments}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {success:true , departments: response.data.data};
  } catch (error) {
    console.error("GET Departments Error:", error);

    throw error;
  }
};