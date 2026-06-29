import axios from "axios";
import { SECONDARY_URL, updatenode } from "../../../Api/endpoints";

export const updateNode = async (nodeId, payload, token) => {
  console.log("we need update node : ", nodeId);
  try {
    const response = await axios.put(
      `${SECONDARY_URL}${updatenode}${nodeId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Update Node Error:", error);
    throw error;
  }
};