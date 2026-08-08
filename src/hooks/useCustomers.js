import { useQuery } from "@tanstack/react-query";
import { GetAllCustomers } from "../services/CRM/Customers/GetAllCustomers";

export const useCustomers = (token, search = "") => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => GetAllCustomers(token),
    enabled: !!token, 
    select: (data) => {
      const customersArray = Array.isArray(data) ? data : [];

      // 👈 منطق البحث المحلي (يبحث في كل حقول العميل، يدعم العربية والإنجليزية)
      const filteredCustomers = customersArray.filter((customer) => {
        if (!search || search.trim() === "") return true;
        const query = search.trim().toLowerCase();

        return Object.values(customer).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });

      return filteredCustomers;
    },
  });
};