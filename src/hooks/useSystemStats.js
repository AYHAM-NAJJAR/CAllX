import { useQuery } from "@tanstack/react-query";
import { AgentsPerformanceMetrics } from "../services/Analytics&Reports/AgentsPerformanceMetrics";
import { SystemStats } from "../services/Analytics&Reports/SystemStats";

export const useSystemStats = (token) => {
  return useQuery({
    queryKey: ['systemstats'],
    queryFn: () => SystemStats(token),
    enabled: !!token, 
    // التعديل هنا: التأكد من أنه Object يحتوي على البيانات أو إرجاع null/object فارغ كحماية
    select: (data) => data && typeof data === 'object' ? data : null, 
  });
};