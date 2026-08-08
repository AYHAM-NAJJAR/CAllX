import { useQuery } from "@tanstack/react-query";
import { AgentsPerformanceMetrics } from "../services/Analytics&Reports/AgentsPerformanceMetrics";
import { SystemStats } from "../services/Analytics&Reports/SystemStats";
import { getStats } from "../services/Tickets/getStats";
export const useTicketStats = (token) => {
  return useQuery({
    queryKey: ['ticketStats'],
    queryFn: () => getStats(token), // تم ربط دالة axios هنا
    enabled: !!token, 
    // التأكد من أنه Object يحتوي على البيانات أو إرجاع null/object فارغ كحماية
    select: (data) => data && typeof data === 'object' ? data : null, 
  });
};