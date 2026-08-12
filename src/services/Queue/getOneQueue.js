import axios from 'axios';
import { getonequeue, SECONDARY_URL } from '../Api/endpoints';


export const getQueueByDetails = async (queueKey,token) => {
  try {
    
    const response = await axios.get(`${SECONDARY_URL}${getonequeue}${queueKey}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching queue details:", error);
    throw error;
  }
};