import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import condominiumsService from '@/services/condominiums.service';
import { toast } from 'react-toastify';

// Query keys
export const condominiumKeys = {
  all: ['condominiums'],
  lists: () => [...condominiumKeys.all, 'list'],
  list: (filters) => [...condominiumKeys.lists(), { filters }],
  details: () => [...condominiumKeys.all, 'detail'],
  detail: (id) => [...condominiumKeys.details(), id],
  departments: ['departments'],
  departmentsList: (condominiumId) => [...condominiumKeys.departments, 'list', { condominiumId }],
  departmentDetail: (id) => [...condominiumKeys.departments, 'detail', id],
};

// Hook to get all condominiums
export const useCondominiums = () => {
  return useQuery({
    queryKey: condominiumKeys.lists(),
    queryFn: condominiumsService.getCondominiums,
  });
};

// Hook to get single condominium
export const useCondominium = (id) => {
  return useQuery({
    queryKey: condominiumKeys.detail(id),
    queryFn: () => condominiumsService.getCondominium(id),
    enabled: !!id,
  });
};

// Hook to create condominium
export const useCreateCondominium = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: condominiumsService.createCondominium,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: condominiumKeys.lists() });
      toast.success('Condominium created successfully');
    },
  });
};

// Hook to update condominium
export const useUpdateCondominium = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: condominiumsService.updateCondominium,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: condominiumKeys.lists() });
      queryClient.invalidateQueries({ queryKey: condominiumKeys.detail(variables.id) });
      toast.success('Condominium updated successfully');
    },
  });
};

// Hook to delete condominium
export const useDeleteCondominium = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: condominiumsService.deleteCondominium,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: condominiumKeys.lists() });
      toast.success('Condominium deleted successfully');
    },
  });
};

// Hook to get departments
export const useDepartments = (condominiumId = null) => {
  return useQuery({
    queryKey: condominiumKeys.departmentsList(condominiumId),
    queryFn: () => condominiumsService.getDepartments(condominiumId),
  });
};

// Hook to get single department
export const useDepartment = (id) => {
  return useQuery({
    queryKey: condominiumKeys.departmentDetail(id),
    queryFn: () => condominiumsService.getDepartment(id),
    enabled: !!id,
  });
};

// Hook to create department
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: condominiumsService.createDepartment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: condominiumKeys.departments });
      if (data.condominium) {
        queryClient.invalidateQueries({ queryKey: condominiumKeys.detail(data.condominium) });
      }
      toast.success('Department created successfully');
    },
  });
};

// Hook to update department
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: condominiumsService.updateDepartment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: condominiumKeys.departments });
      queryClient.invalidateQueries({ queryKey: condominiumKeys.departmentDetail(variables.id) });
      if (data.condominium) {
        queryClient.invalidateQueries({ queryKey: condominiumKeys.detail(data.condominium) });
      }
      toast.success('Department updated successfully');
    },
  });
};

// Hook to delete department
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: condominiumsService.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: condominiumKeys.departments });
      toast.success('Department deleted successfully');
    },
  });
};