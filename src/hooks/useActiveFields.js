import { useQuery } from "@tanstack/react-query";
import { allActiveFields } from "../services/TicketingStructure/getAllActiveFields"

export const useActiveFields = (token) => {
  return useQuery({
    queryKey: ['activeFields'],
    queryFn: () => allActiveFields(token),
    enabled: !!token, // لن يتم التنفيذ إلا في حال وجود الـ token
    select: (data) => Array.isArray(data) ? data : [], // حماية إضافية للتأكد من التعامل مع Array دائماً
  });
};