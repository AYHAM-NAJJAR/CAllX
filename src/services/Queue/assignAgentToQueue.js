import axios from 'axios';
import { assignagent, SECONDARY_URL } from '../Api/endpoints';


export const assignAgent = async (queueKey, agentData, token) => {
  try {
    

    const response = await axios.post(
      `${SECONDARY_URL}${assignagent}${queueKey}/agents`, 
      {
        agentIdentity: agentData.agentIdentity,
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