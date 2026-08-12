import axios from 'axios';
import { SECONDARY_URL } from '../Api/endpoints';

export const deleteQueueCall = async (queueKey, callId, token) => {
  try {
    const response = await axios.delete(`${SECONDARY_URL}${queueKey}/calls/${callId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete queue call", error);
    throw error;
  }
};