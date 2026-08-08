import { useQuery } from "@tanstack/react-query";
import { getAllCalls } from "../services/call/core/getAllCalls";

export const useCalls = (token, page = 0, size = 20) => {
  return useQuery({
    queryKey: ["calls", page, size],
    queryFn: () => getAllCalls(token, page, size),
    enabled: !!token,
    // استخراج مصفوفة المكالمات والمعلومات الأساسية للصفحات بأمان
    select: (data) => {
      if (!data?.success || !data?.data) return null;

      return {
        calls: data.data.content || [],
        pagination: {
          pageNumber: data.data.number,
          pageSize: data.data.size,
          totalPages: data.data.totalPages,
          totalElements: data.data.totalElements,
          isLast: data.data.last,
          isFirst: data.data.first,
        },
      };
    },
  });
};