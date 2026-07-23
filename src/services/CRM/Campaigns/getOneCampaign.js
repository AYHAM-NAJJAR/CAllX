import axios from 'axios';
import { BASE_URL, getonecampaign } from '../../Api/endpoints'; // تأكد من المسار الصحيح

export const getOneCampaign = async (token, id) => {
  const response = await axios.get(`${BASE_URL}${getonecampaign}${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};