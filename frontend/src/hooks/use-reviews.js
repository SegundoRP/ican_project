import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reviewsService from '@/services/reviews.service';
import { toast } from 'react-toastify';
import { orderKeys } from './use-orders';

// Query keys
export const reviewKeys = {
  all: ['reviews'],
  lists: () => [...reviewKeys.all, 'list'],
  list: (filters) => [...reviewKeys.lists(), { filters }],
  details: () => [...reviewKeys.all, 'detail'],
  detail: (id) => [...reviewKeys.details(), id],
  byOrder: (orderId) => [...reviewKeys.all, 'by-order', orderId],
  byUser: (userId) => [...reviewKeys.all, 'by-user', userId],
  forUser: (userId) => [...reviewKeys.all, 'for-user', userId],
  stats: (userId) => [...reviewKeys.all, 'stats', userId],
};

// Hook to get all reviews
export const useReviews = (params = {}) => {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => reviewsService.getReviews(params),
  });
};

// Hook to get single review
export const useReview = (id) => {
  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: () => reviewsService.getReview(id),
    enabled: !!id,
  });
};

// Hook to create review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsService.createReview,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      if (data.order) {
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.order) });
        queryClient.invalidateQueries({ queryKey: reviewKeys.byOrder(data.order) });
      }
      if (data.user) {
        queryClient.invalidateQueries({ queryKey: reviewKeys.byUser(data.user) });
      }
      toast.success('Review submitted successfully');
    },
  });
};

// Hook to update review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsService.updateReview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(variables.id) });
      if (data.order) {
        queryClient.invalidateQueries({ queryKey: reviewKeys.byOrder(data.order) });
      }
      if (data.user) {
        queryClient.invalidateQueries({ queryKey: reviewKeys.byUser(data.user) });
      }
      toast.success('Review updated successfully');
    },
  });
};

// Hook to delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      toast.success('Review deleted successfully');
    },
  });
};

// Hook to get reviews by order
export const useReviewsByOrder = (orderId) => {
  return useQuery({
    queryKey: reviewKeys.byOrder(orderId),
    queryFn: () => reviewsService.getReviewsByOrder(orderId),
    enabled: !!orderId,
  });
};

// Hook to get reviews by user (as reviewer)
export const useReviewsByUser = (userId) => {
  return useQuery({
    queryKey: reviewKeys.byUser(userId),
    queryFn: () => reviewsService.getReviewsByUser(userId),
    enabled: !!userId,
  });
};

// Hook to get reviews for user (as reviewed)
export const useReviewsForUser = (userId) => {
  return useQuery({
    queryKey: reviewKeys.forUser(userId),
    queryFn: () => reviewsService.getReviewsForUser(userId),
    enabled: !!userId,
  });
};

// Hook to get user review statistics
export const useUserReviewStats = (userId) => {
  return useQuery({
    queryKey: reviewKeys.stats(userId),
    queryFn: () => reviewsService.getUserReviewStats(userId),
    enabled: !!userId,
  });
};