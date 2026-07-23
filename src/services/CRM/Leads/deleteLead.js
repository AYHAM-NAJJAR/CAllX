import axios from 'axios';
import { BASE_URL, deletelead, removetag } from '../../Api/endpoints';


export const deleteLead = async (tagId, token) => {
    
  try {
    const response = await axios.delete(
      `${BASE_URL}${deletelead}${tagId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleteCustomerTag service:", error);
    throw error;
  }
};