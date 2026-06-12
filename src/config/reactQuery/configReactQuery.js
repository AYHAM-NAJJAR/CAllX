import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // البيانات تبقى طازجة لـ 5 دقائق
      cacheTime: 1000 * 60 * 30, // تبقى في الكاش لـ 30 دقيقة
      refetchOnWindowFocus: true, // تحديث تلقائي عند العودة للمتصفح
    },
  },
});