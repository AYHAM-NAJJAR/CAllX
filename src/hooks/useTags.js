import { useQuery } from "@tanstack/react-query";
import { GetAllTags } from "../services/CRM/Tags/getAllTags";

export const useTags = (token, search = "") => {
  return useQuery({
    queryKey: ['Tags'],
    queryFn: () => GetAllTags(token),
    enabled: !!token, 
    select: (data) => {
      const tagsArray = Array.isArray(data) ? data : [];

      // منطق البحث المحلي في جميع حقول التغ (يدعم العربية والإنجليزية)
      const filteredTags = tagsArray.filter((tag) => {
        if (!search || search.trim() === "") return true;
        const query = search.trim().toLowerCase();

        return Object.values(tag).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });

      return filteredTags;
    },
  });
};