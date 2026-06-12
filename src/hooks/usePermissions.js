import { useQuery } from "@tanstack/react-query";
import { allPermissions } from "../services/Role&Permission/getAllPermissions";

// hooks/usePermissions.js
export const usePermissions = (token) => {
  return useQuery({
    queryKey: ['allPermissions'],
    queryFn: () => allPermissions(token),
    enabled: !!token,
    select: (response) => {
      // 1. إذا كان الرد هو المصفوفة مباشرة (Response is Array)
      if (Array.isArray(response)) return response;
      
      // 2. إذا كان الرد مغلفاً بواسطة Axios (Response.data is Array)
      if (response?.data && Array.isArray(response.data)) return response.data;
      
      // 3. إذا كان الرد يحتوي على حقل permissions (مثل Response.permissions)
      if (response?.permissions && Array.isArray(response.permissions)) return response.permissions;

      // 4. في أسوأ الظروف، أرجع مصفوفة فارغة لكي لا ينهار الـ Map في الواجهة
      return [];
    },
  });
};