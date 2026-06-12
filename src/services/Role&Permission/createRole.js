import axios from "axios";
import { BASE_URL, createRole } from "../Api/endpoints";

export const createRoleService = async (role, permissions ,token) => {
  try {
    console.log({
  name: role,
  permissionIds: permissions,
});
    const response = await axios.post(
      `${BASE_URL}${createRole}`,
      {
        name: role,
        permissionIds:permissions
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
        message: `Create ${role} Successfully`,
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