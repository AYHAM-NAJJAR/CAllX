import axios from 'axios';
import { roomshistory, SECONDARY_URL } from '../Api/endpoints';



export const fetchStatsHistory = async () => {
  try {
    const response = await axios.get(`${SECONDARY_URL}${roomshistory}`);

    if (response.data && response.data.success) {
        return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch history');
  } catch (error) {
    console.error('Error fetching stats history:', error);
    throw error;
  }
};