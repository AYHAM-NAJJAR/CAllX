import { useQuery } from "@tanstack/react-query";
import { AgentsPerformanceMetrics } from "../services/Analytics&Reports/AgentsPerformanceMetrics";

export const useAgentsPerformanceMetrics = (token) => {
  return useQuery({
    queryKey: ['performance'],
    queryFn: () => AgentsPerformanceMetrics(token),
    enabled: !!token, 
    // التعديل هنا: التأكد من أنه Object يحتوي على البيانات أو إرجاع null/object فارغ كحماية
    select: (data) => data && typeof data === 'object' ? data : null, 
  });
};