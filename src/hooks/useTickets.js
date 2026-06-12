import { useQuery } from "@tanstack/react-query";
import { allTickets } from "../services/Tickets/getAllTickets";

export const useTickets = (token) => {
  return useQuery({
    queryKey: ['allTickets'],
    queryFn: () => allTickets(token),
    enabled: !!token, // لن يتم التنفيذ إلا في حال وجود الـ token
    select: (data) => Array.isArray(data) ? data : [], // حماية إضافية للتأكد من التعامل مع Array دائماً
  });
};