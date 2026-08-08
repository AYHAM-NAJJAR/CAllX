import { useQuery } from '@tanstack/react-query';
import { getAllRoles } from '../services/Role&Permission/getAllRoles';

export const useRoles = (token, isForSelect = false, search = "") => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => getAllRoles(token),
    enabled: !!token,

    select: (response) => {
      const roles = response?.roles || [];

      // 👈 منطق البحث المحلي (يبحث في كل حقول الدور، يدعم العربية والإنجليزية)
      const filteredRoles = roles.filter((role) => {
        if (!search || search.trim() === "") return true;
        const query = search.trim().toLowerCase();

        return Object.values(role).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });

      if (isForSelect) {
        return filteredRoles.map((role) => ({
          value: role.id,
          label: role.name,
        }));
      }

      return filteredRoles;
    },
  });
};