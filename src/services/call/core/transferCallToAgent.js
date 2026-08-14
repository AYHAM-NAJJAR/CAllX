import axios from 'axios';
import { routingcall, SECONDARY_URL } from '../../Api/endpoints';


export const transferCallToAgent = async (callId, targetAgentIdentity, token) => {
  console.log(callId, targetAgentIdentity, token);
  try {
    const response = await axios.post(
      `${SECONDARY_URL}${routingcall}${callId}/transfer/agent`, 
      {
        targetAgentIdentity: targetAgentIdentity,
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