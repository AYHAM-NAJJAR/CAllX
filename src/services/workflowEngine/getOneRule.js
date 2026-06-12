import axios from "axios";
import { BASE_URL, onerule } from "../Api/endpoints";

export const getRuleById = async (token, ruleId) => {
  try {
    const response = await axios.get(`${BASE_URL}${onerule}${ruleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("GET Workflow Detail Error:", error);
    throw error;
  }
};