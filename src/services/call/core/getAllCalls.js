import axios from "axios";
import { getallcalls, SECONDARY_URL } from "../../Api/endpoints";



export const getAllCalls = async (token, page = 0, size = 20) => {
  const response = await axios.get(`${SECONDARY_URL}${getallcalls}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      size,
    },
  });

  return response.data;
};