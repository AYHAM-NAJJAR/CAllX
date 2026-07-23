import axios from 'axios';
import { BASE_URL, updatecustomernotes } from '../../Api/endpoints';

export const updateCustomerNotes = async (customerId, notes, token) => {
    console.log(customerId,notes);
  const url = `${BASE_URL}${updatecustomernotes}${customerId}/notes`;
  
  const response = await axios.put(
    url,
    { notes:notes },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  return response.data;
};