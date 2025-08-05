import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import servicesService from '@/services/services.service';
import { toast } from 'react-toastify';

// Query keys
export const serviceKeys = {
  all: ['services'],
  types: () => [...serviceKeys.all, 'types'],
  typesList: () => [...serviceKeys.types(), 'list'],
  typeDetail: (id) => [...serviceKeys.types(), 'detail', id],
  services: () => [...serviceKeys.all, 'services'],
  servicesList: (filters) => [...serviceKeys.services(), 'list', { filters }],
  serviceDetail: (id) => [...serviceKeys.services(), 'detail', id],
};

// Hook to get all service types
export const useServiceTypes = () => {
  return useQuery({
    queryKey: serviceKeys.typesList(),
    queryFn: servicesService.getServiceTypes,
  });
};

// Hook to get single service type
export const useServiceType = (id) => {
  return useQuery({
    queryKey: serviceKeys.typeDetail(id),
    queryFn: () => servicesService.getServiceType(id),
    enabled: !!id,
  });
};

// Hook to create service type (admin)
export const useCreateServiceType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servicesService.createServiceType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.typesList() });
      toast.success('Service type created successfully');
    },
  });
};

// Hook to update service type (admin)
export const useUpdateServiceType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servicesService.updateServiceType,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.typesList() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.typeDetail(variables.id) });
      toast.success('Service type updated successfully');
    },
  });
};

// Hook to delete service type (admin)
export const useDeleteServiceType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servicesService.deleteServiceType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.typesList() });
      toast.success('Service type deleted successfully');
    },
  });
};

// Hook to get deliverer's services
export const useServices = (params = {}) => {
  return useQuery({
    queryKey: serviceKeys.servicesList(params),
    queryFn: () => servicesService.getServices(params),
  });
};

// Hook to get single service
export const useService = (id) => {
  return useQuery({
    queryKey: serviceKeys.serviceDetail(id),
    queryFn: () => servicesService.getService(id),
    enabled: !!id,
  });
};

// Hook to update service (deliverer)
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servicesService.updateService,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.servicesList() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.serviceDetail(variables.id) });
      toast.success('Service updated successfully');
    },
  });
};

// Hook to delete service (deliverer)
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servicesService.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.servicesList() });
      toast.success('Service deleted successfully');
    },
  });
};