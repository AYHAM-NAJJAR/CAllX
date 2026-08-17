// services/UserManagement/UpdateUser.js

import axios from "axios";
import { SECONDARY_URL, updateflow } from "../../../Api/endpoints";

export const updateFlow = async (flowId, data, rootNodeId, token) => {
  // بناء الـ Payload بشكل صريح ومطابق لبوستمان لتجنب أي خصائص إضافية
  const payload = {
    name: data.name || "default_name",
    description: data.description || "default_desc",
    active: data.active ?? true,
    rootNodeId: parseInt(rootNodeId, 10)
  };

  // طباعة الـ Payload كـ JSON للتأكد منه قبل الإرسال
  console.log("🚀 Payload Sent:", JSON.stringify(payload));
  console.log("rootNodeId value:", payload.rootNodeId);
console.log("rootNodeId type:", typeof payload.rootNodeId);
  try {
    const response = await axios.put(
      `${SECONDARY_URL}${updateflow}${flowId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return {
      success: true,
      data: response.data,
      message: "Flow updated successfully", 
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};