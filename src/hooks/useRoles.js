import { useQuery } from '@tanstack/react-query';
import { getAllRoles } from '../services/Role&Permission/getAllRoles';


export const useRoles = (token, isForSelect = false) => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => getAllRoles(token),
    enabled: !!token,

    select: (response) => {
      const roles = response?.roles || [];

      if (isForSelect) {
        return roles.map((role) => ({
          value: role.id,
          label: role.name,
        }));
      }

      return roles;
    },
  });
};