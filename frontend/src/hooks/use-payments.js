import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import paymentsService from '@/services/payments.service';
import { toast } from 'react-toastify';
import { orderKeys } from './use-orders';

// Query keys
export const paymentKeys = {
  all: ['payments'],
  lists: () => [...paymentKeys.all, 'list'],
  list: (filters) => [...paymentKeys.lists(), { filters }],
  details: () => [...paymentKeys.all, 'detail'],
  detail: (id) => [...paymentKeys.details(), id],
  summary: (filters) => [...paymentKeys.all, 'summary', { filters }],
  byOrder: (orderId) => [...paymentKeys.all, 'by-order', orderId],
};

// Hook to get all payments
export const usePayments = (params = {}) => {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => paymentsService.getPayments(params),
  });
};

// Hook to get single payment
export const usePayment = (id) => {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentsService.getPayment(id),
    enabled: !!id,
  });
};

// Hook to create payment
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsService.createPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      if (data.order) {
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.order) });
        queryClient.invalidateQueries({ queryKey: paymentKeys.byOrder(data.order) });
      }
      toast.success('Payment created successfully');
    },
  });
};

// Hook to update payment
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsService.updatePayment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(variables.id) });
      if (data.order) {
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.order) });
        queryClient.invalidateQueries({ queryKey: paymentKeys.byOrder(data.order) });
      }
      toast.success('Payment updated successfully');
    },
  });
};

// Hook to delete payment
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsService.deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      toast.success('Payment deleted successfully');
    },
  });
};

// Hook to verify payment (admin)
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsService.verifyPayment,
    onSuccess: (data, paymentId) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(paymentId) });
      if (data.order) {
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.order) });
      }
      toast.success('Payment verified successfully');
    },
  });
};

// Hook to get payment summary
export const usePaymentSummary = (params = {}) => {
  return useQuery({
    queryKey: paymentKeys.summary(params),
    queryFn: () => paymentsService.getPaymentSummary(params),
  });
};

// Hook to get payments by order
export const usePaymentsByOrder = (orderId) => {
  return useQuery({
    queryKey: paymentKeys.byOrder(orderId),
    queryFn: () => paymentsService.getPaymentsByOrder(orderId),
    enabled: !!orderId,
  });
};