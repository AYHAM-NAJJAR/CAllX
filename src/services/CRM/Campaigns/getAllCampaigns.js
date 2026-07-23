import axios from 'axios';
import { BASE_URL, getcampaigns } from '../../Api/endpoints';

export const getAllCampaigns = async (token) => {
  const response = await axios.get(`${BASE_URL}${getcampaigns}`, {
    headers: { 
      Authorization: `Bearer ${token}` 
    }
  });
  return response.data;
};