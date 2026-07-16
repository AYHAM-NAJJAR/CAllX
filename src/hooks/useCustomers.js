import { useQuery } from "@tanstack/react-query";

import { GetAllCustomers } from "../services/CRM/Customers/GetAllCustomers";

export const useCustomers = (token) => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => GetAllCustomers(token),
    enabled: !!token, 
    select: (data) => Array.isArray(data) ? data : [],
  });
};