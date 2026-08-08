import axios from 'axios';
import { createqueue, SECONDARY_URL } from '../Api/endpoints';

export const createQueue = async (queueData,token) => {

  try {
    const response = await axios.post(
      `${SECONDARY_URL}${createqueue}`, 
      {
        queueKey: queueData.queueKey,
        name: queueData.name,
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};