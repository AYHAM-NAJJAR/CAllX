// services/Queues/getAllActiveQueues.js
import axios from "axios";
import { getallqueues, SECONDARY_URL } from "../Api/endpoints";

export const allActiveQueues = async (token) => {
  const response = await axios.get(`${SECONDARY_URL}${getallqueues}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};