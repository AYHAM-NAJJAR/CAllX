import { useQuery } from "@tanstack/react-query";
import { GetAllTags } from "../services/CRM/Tags/getAllTags";

export const useTags = (token) => {
  return useQuery({
    queryKey: ['Tags'],
    queryFn: () => GetAllTags(token),
    enabled: !!token, 
    select: (data) => Array.isArray(data) ? data : [],
  });
};

