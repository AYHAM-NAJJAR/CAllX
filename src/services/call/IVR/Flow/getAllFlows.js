import axios from "axios";

import { getflows, SECONDARY_URL } from "../../../Api/endpoints";



export const allFlows = async (token) => {
  try {
    const response = await axios.get(`${SECONDARY_URL}${getflows}`, {
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