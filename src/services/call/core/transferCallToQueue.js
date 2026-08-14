import axios from 'axios';
import { routingcall, SECONDARY_URL } from '../../Api/endpoints';


export const transferCallToQueue = async (callId, transferData, token) => {
  try {
    const response = await axios.post(
      `${SECONDARY_URL}${routingcall}${callId}/transfer/queue`, 
      {
        sourceQueueId: transferData.sourceQueueId,
        targetQueueId: transferData.targetQueueId,
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