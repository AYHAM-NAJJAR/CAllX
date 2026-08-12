import axios from 'axios';
import { SECONDARY_URL, updatestatus } from '../Api/endpoints';

export const updateQueueStatus = async (queueKey, status,token) => {
  try {
   

    const response = await axios.patch(
      `${SECONDARY_URL}${updatestatus}${queueKey}/status`,
      {
        active: status
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating queue status:', error.response?.data || error.message);
    throw error;
  }
};