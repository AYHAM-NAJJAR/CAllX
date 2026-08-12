import axios from "axios";
import { SECONDARY_URL } from "../../Api/endpoints";

export const fetchCallDetails = async (callId, token) => {
  try {
    const response = await axios.get(`${SECONDARY_URL}/calls/${callId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching call details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch call details');
  }
};