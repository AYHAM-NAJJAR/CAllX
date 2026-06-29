import axios from "axios";
import { BASE_URL, updatetenant } from "../Api/endpoints";

export const updateTenant = async (tenantId, token, Status) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${updatetenant}${tenantId}/status?active=${Status}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Tenant updated successfully",
      data: response.data // يمكنك إرجاع الداتا من السيرفر إذا احتجتها
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update tenant",
    };
  }
};