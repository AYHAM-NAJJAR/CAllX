import { useQuery } from "@tanstack/react-query";
import { allEmployees } from "../services/UserManagement/getAllEmployees";

// hooks/useemployees.js
export const useEmployees = (token, isForSelect = false) => {
  return useQuery({
    queryKey: ['allEmployees', isForSelect],
    queryFn: () => allEmployees(token),
    enabled: !!token,
    select: (data) => {
      
      const employeesArray = Array.isArray(data) ? data : [];
      
      
      if (isForSelect) {
        return employeesArray.map((emp) => ({
          value: emp.id,    
          label: `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'No Name'        }));
      }
      
      
      return employeesArray;
    },
  });
};