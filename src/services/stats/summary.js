import axios from 'axios';
import { SECONDARY_URL } from '../Api/endpoints';
import { summary } from 'framer-motion/client';



export const fetchSummary = async () => {
  try {
    const response = await axios.get(`${SECONDARY_URL}${summary}`);
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch summary stats');
  } catch (error) {
    console.error('Error fetching stats summary:', error);
    throw error;
  }
};