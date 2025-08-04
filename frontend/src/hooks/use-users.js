import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import usersService from '@/services/users.service';
import { toast } from 'react-toastify';

// Query keys
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
  current: () => [...userKeys.all, 'me'],
  availableDeliverers: (filters) => [...userKeys.all, 'available-deliverers', { filters }],
  earnings: (filters) => [...userKeys.all, 'earnings', { filters }],
};

// Hook to get all users (admin)
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersService.getUsers(params),
  });
};

// Hook to get single user
export const useUser = (id) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersService.getUser(id),
    enabled: !!id,
  });
};

// Hook to get current user
export const useCurrentUser = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return useQuery({
    queryKey: userKeys.current(),
    queryFn: usersService.getCurrentUser,
    enabled: isAuthenticated,
  });
};

// Hook to update user (admin)
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.updateUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      toast.success('User updated successfully');
    },
  });
};

// Hook to update current user profile
export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.updateCurrentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
      toast.success('Profile updated successfully');
    },
  });
};

// Hook to delete user (admin)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User deleted successfully');
    },
  });
};

// Hook to change user role
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.changeUserRole,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      if (variables.id === 'me') {
        queryClient.invalidateQueries({ queryKey: userKeys.current() });
      }
      toast.success('User role updated successfully');
    },
  });
};

// Hook to toggle user availability
export const useToggleAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.toggleAvailability,
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.availableDeliverers() });
      if (userId === 'me') {
        queryClient.invalidateQueries({ queryKey: userKeys.current() });
      }
      toast.success(
        data.is_available_for_delivery
          ? 'You are now available for deliveries'
          : 'You are no longer available for deliveries'
      );
    },
  });
};

// Hook to get available deliverers
export const useAvailableDeliverers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.availableDeliverers(params),
    queryFn: () => usersService.getAvailableDeliverers(params),
  });
};

// Hook to get earnings summary
export const useEarningsSummary = (params = {}) => {
  return useQuery({
    queryKey: userKeys.earnings(params),
    queryFn: () => usersService.getEarningsSummary(params),
  });
};

// Hook to update user department
export const useUpdateUserDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.updateUserDepartment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      if (variables.id === 'me') {
        queryClient.invalidateQueries({ queryKey: userKeys.current() });
      }
      toast.success('Department updated successfully');
    },
  });
};

// Hook to search users
export const useSearchUsers = (query, enabled = true) => {
  return useQuery({
    queryKey: [...userKeys.lists(), 'search', query],
    queryFn: () => usersService.searchUsers(query),
    enabled: enabled && !!query,
  });
};
