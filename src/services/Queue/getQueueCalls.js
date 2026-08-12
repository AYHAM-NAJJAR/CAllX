import axios from 'axios';
import { getonequeue, SECONDARY_URL } from '../Api/endpoints';

export const getQueueCalls = async (queueKey, token) => {
  try {
    const response = await axios.get(`${SECONDARY_URL}${getonequeue}${queueKey}/calls`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch queue calls", error);
    throw error;
  }
};