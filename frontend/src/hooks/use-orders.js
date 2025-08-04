import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ordersService from '@/services/orders.service';
import { toast } from 'react-toastify';

// Query keys
export const orderKeys = {
  all: ['orders'],
  lists: () => [...orderKeys.all, 'list'],
  list: (filters) => [...orderKeys.lists(), { filters }],
  details: () => [...orderKeys.all, 'detail'],
  detail: (id) => [...orderKeys.details(), id],
  myRequests: (filters) => [...orderKeys.all, 'my-requests', { filters }],
  myDeliveries: (filters) => [...orderKeys.all, 'my-deliveries', { filters }],
  availability: (condominiumId) => [...orderKeys.all, 'availability', condominiumId],
  stats: (filters) => [...orderKeys.all, 'stats', { filters }],
};

// Hook to get all orders
export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersService.getOrders(params),
  });
};

// Hook to get single order
export const useOrder = (id) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersService.getOrder(id),
    enabled: !!id,
  });
};

// Hook to create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.myRequests() });
      toast.success('Order created successfully');
    },
  });
};

// Hook to update order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersService.updateOrder,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.myRequests() });
      toast.success('Order updated successfully');
    },
  });
};

// Hook to delete order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersService.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.myRequests() });
      toast.success('Order deleted successfully');
    },
  });
};

// Hook to accept order
export const useAcceptOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersService.acceptOrder,
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.myDeliveries() });
      toast.success('Order accepted successfully');
    },
  });
};

// Hook to reject order
export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => ordersService.rejectOrder(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.myDeliveries() });
      toast.success('Order rejected');
    },
  });
};

// Hook to complete order
export const useCompleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => ordersService.completeOrder(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.myDeliveries() });
      toast.success('Order marked as completed');
    },
  });
};

// Hook to cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => ordersService.cancelOrder(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.myRequests() });
      toast.success('Order cancelled');
    },
  });
};

// Hook to get my requests (as receiver)
export const useMyRequests = (params = {}) => {
  return useQuery({
    queryKey: orderKeys.myRequests(params),
    queryFn: () => ordersService.getMyRequests(params),
  });
};

// Hook to get my deliveries (as deliverer)
export const useMyDeliveries = (params = {}) => {
  return useQuery({
    queryKey: orderKeys.myDeliveries(params),
    queryFn: () => ordersService.getMyDeliveries(params),
  });
};

// Hook to check delivery availability
export const useCheckAvailability = (condominiumId) => {
  return useQuery({
    queryKey: orderKeys.availability(condominiumId),
    queryFn: () => ordersService.checkAvailability(condominiumId),
    enabled: !!condominiumId,
  });
};

// Hook to get order statistics
export const useOrderStats = (params = {}) => {
  return useQuery({
    queryKey: orderKeys.stats(params),
    queryFn: () => ordersService.getOrderStats(params),
  });
};