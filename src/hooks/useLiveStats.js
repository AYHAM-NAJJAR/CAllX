// hooks/useLiveStats.js
import { useQuery } from "@tanstack/react-query";
import { liveStats } from "../services/dashboard/getLiveStats";

export const useLiveStats = (token) => {
  return useQuery({
    queryKey: ['liveStats'],
    queryFn: () => liveStats(token),
    enabled: !!token,
 
    select: (data) => {
      
      const roomsArray = data?.rooms ? Object.values(data.rooms) : [];
      
      return {
        ...data,
        rooms: roomsArray
      };
    },

    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
};