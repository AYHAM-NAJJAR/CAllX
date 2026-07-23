import axios from 'axios';
import { BASE_URL, removetag } from '../../Api/endpoints';


export const deleteCustomerTag = async (customerId, tagId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}${removetag}${customerId}/tags/${tagId}`,
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