// services/TicketingStructure/updateField.js

import axios from "axios";
import { BASE_URL, getone } from "../Api/endpoints";

export const updateFieldDefinition = async (token, id, data) => {
    console.log(data,id);
  try {
    const response = await axios.put(
      `${BASE_URL}${getone}/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    // رمي الخطأ الفعلي القادم من الـ Backend ليظهر في الـ Toast
    const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to update field";
    throw new Error(errorMsg);
  }
};