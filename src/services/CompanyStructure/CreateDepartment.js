import axios from "axios";
import { BASE_URL, createDepartment } from "../Api/endpoints";
import api from "../Api/api";

export const createDepartmentService = async (department, token) => {
  try {
    const response = await api.post(
      createDepartment,
      {
        name: department,
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
        message: "Create Department Done",
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