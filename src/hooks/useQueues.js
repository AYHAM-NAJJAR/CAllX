import { useQuery } from "@tanstack/react-query";
import { allActiveQueues } from "../services/Queue/getAllQueues";

export const useActiveQueues = (token) => {
  return useQuery({
    queryKey: ['activeQueues'],
    queryFn: () => allActiveQueues(token),
    enabled: !!token, // لن يتم التنفيذ إلا في حال وجود الـ token
    
    // دالة الـ select هنا تضمن أن المكونات ستستلم مصفوفة الطوابير (Queues) مباشرة
    select: (response) => {
      return response && Array.isArray(response.data) ? response.data : [];
    },
  });
};