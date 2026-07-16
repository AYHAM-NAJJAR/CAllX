import { useQuery } from "@tanstack/react-query";
import {getAllTenants } from "../services/Tenants/getAllTenants";



export const useTenants = (token) => {
  return useQuery({
    queryKey: ['Tenants'],
    queryFn: () => getAllTenants(token),
    enabled: !!token, 
    select: (data) => Array.isArray(data) ? data : [],
  });
};