import axios from "axios";
import { BASE_URL, getEmp,  } from "../Api/endpoints";



export const  getEmployeeById = async (token,empId) => {
  try {
    const response = await axios.get(`${BASE_URL}${getEmp}${empId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("GET Departments Error:", error);

    throw error;
  }
};