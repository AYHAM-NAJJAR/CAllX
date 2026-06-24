import axios from "axios";
import { connectStomp } from "../../realtime/stomp/stopm";
import { SECONDARY_URL } from "../../Api/endpoints";

const FIXED_CALLER = "";
const FIXED_CALLEE = "+123456789";

export const initiateCall = async (token, onMessage) => {
  try {
    const res = await axios.post(
      `${SECONDARY_URL}/api/calls/initiate`,
      {
        callerIdentity: FIXED_CALLER,
        calleeIdentity: FIXED_CALLEE,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data.data;

    connectStomp(data.token, data.callId, onMessage);

    return data;
  } catch (error) {
    console.error("CALL INIT ERROR:", error);
    throw error;
  }
};