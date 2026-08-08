import { useQuery } from "@tanstack/react-query";
import { allEmployees } from "../services/UserManagement/getAllEmployees";

// hooks/useemployees.js
export const useEmployees = (token, isForSelect = false, search = "") => {
  return useQuery({
    queryKey: ['allEmployees', isForSelect],
    queryFn: () => allEmployees(token),
    enabled: !!token,
    select: (data) => {
      const employeesArray = Array.isArray(data) ? data : [];
      
      // 👈 منطق البحث المحلي (يدعم العربية والإنجليزية في كل حقول الموظف مثل الاسم، البريد، الدور، إلخ)
      const filteredEmployees = employeesArray.filter((emp) => {
        if (!search || search.trim() === "") return true;
        const query = search.trim().toLowerCase();
        
        return Object.values(emp).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });
      
      if (isForSelect) {
        return filteredEmployees.map((emp) => ({
          value: emp.id,    
          label: `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'No Name'        
        }));
      }
      
      return filteredEmployees;
    },
  });
};