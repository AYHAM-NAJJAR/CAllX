import { useQuery } from "@tanstack/react-query";
import { allTickets } from "../services/Tickets/getAllTickets";

export const useTickets = (
  token,
  page = 0,
  size = 20,
  department = "",
  status = "",
  priority = "",
  sort = "createdAt,desc",
  search = "" // 👈 معامل البحث
) => {
  return useQuery({
    queryKey: ["allTickets", page, size, department, status, priority, sort],
    queryFn: () => allTickets(token, page, size, department, status, priority, sort),
    enabled: !!token,
    keepPreviousData: true,

    select: (response) => {
      const rawContent = response?.data?.content ?? response?.content ?? [];

      // بحث بسيط وواضح (مثلاً يبحث في عنوان التذكرة title)
      const filteredContent = rawContent.filter((ticket) => {
        if (!search) return true; // إذا كان حقل البحث فارغاً، اعرض الكل
        return ticket.title?.toLowerCase().includes(search.toLowerCase());
      });

      // الترتيب
      const sortedContent = [...filteredContent].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      if (response?.data) {
        return {
          ...response,
          data: { ...response.data, content: sortedContent },
        };
      }

      return { ...response, content: sortedContent };
    },
  });
};