import axios from "axios";
import { BASE_URL, createCategory } from "../Api/endpoints";

export const createCategoryService = async (departmentId,categoryName, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${createCategory}${departmentId}/categories`,
      {
        name: categoryName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: response.data.message,
      };
    }

    return {
      success: false,
      message: `Unexpected server response (${response.status})`,
    };
  } catch (error) {
    console.error(error);
  }
};