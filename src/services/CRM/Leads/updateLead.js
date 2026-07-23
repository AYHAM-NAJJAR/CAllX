import axios from 'axios';
import { BASE_URL, updatelead } from '../../Api/endpoints';

export const updateLead = async (leadId, data, token) => {
  try {
  
    const response = await axios.put(`${BASE_URL}${updatelead}${leadId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    
    console.log(error);
  }
};