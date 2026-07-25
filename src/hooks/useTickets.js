import { useQuery } from "@tanstack/react-query";
import { allTickets } from "../services/Tickets/getAllTickets";

export const useTickets = (
  token,
  page = 0,
  size = 20,
  department = "",
  status = "",
  priority = "",
  sort = "createdAt,desc" // 👈 استلام معامل الترتيب
) => {
  return useQuery({
    // 👈 إضافة sort داخل queryKey لإعادة الجلب عند تغير الترتيب
    queryKey: ["allTickets", page, size, department, status, priority, sort],
    queryFn: () => allTickets(token, page, size, department, status, priority, sort),
    enabled: !!token,
    keepPreviousData: true,

    select: (response) => {
      const rawContent = response?.data?.content ?? response?.content ?? [];

      // إذا كان السيرفر يرتب البيانات بنفسه فلن تحتاج لهذه الدالة، 
      // لكن أبقينا عليها كإجراء احتياطي لضمان الترتيب التنازلي في العرض:
      const sortedContent = [...rawContent].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      if (response?.data) {
        return {
          ...response,
          data: {
            ...response.data,
            content: sortedContent,
          },
        };
      }

      return {
        ...response,
        content: sortedContent,
      };
    },
  });
};