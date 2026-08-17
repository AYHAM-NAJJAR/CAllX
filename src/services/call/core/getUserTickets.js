import axios from "axios";
import { BASE_URL } from "../../Api/endpoints";

const getUserTickets = async (userId, token) => {
  if (!userId) {
    return [];
  }

  console.log("Hi im user ID:", userId);

  try {
    const response = await axios.get(
      `${BASE_URL}/admin/tickets`,
      {
        params: {
          userID: userId,
        },
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      }
    );

    console.log("Full API Response:", response.data);

    return response.data?.data?.content || [];
  } catch (error) {
    console.error("getUserTickets failed:", error);
    throw error;
  }
};

export default getUserTickets;