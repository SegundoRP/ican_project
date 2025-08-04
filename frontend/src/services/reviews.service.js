import apiClient from './api-client';

const reviewsService = {
  // Get all reviews
  getReviews: async (params = {}) => {
    return apiClient.get('/api/reviews/', params);
  },

  // Get single review
  getReview: async (id) => {
    return apiClient.get(`/api/reviews/${id}/`);
  },

  // Create review
  createReview: async (data) => {
    return apiClient.post('/api/reviews/', data);
  },

  // Update review
  updateReview: async ({ id, data }) => {
    return apiClient.patch(`/api/reviews/${id}/`, data);
  },

  // Delete review
  deleteReview: async (id) => {
    return apiClient.delete(`/api/reviews/${id}/`);
  },

  // Get reviews by order
  getReviewsByOrder: async (orderId) => {
    return apiClient.get('/api/reviews/', { order: orderId });
  },

  // Get reviews by user (as reviewer)
  getReviewsByUser: async (userId) => {
    return apiClient.get('/api/reviews/', { user: userId });
  },

  // Get reviews for user (as reviewed)
  getReviewsForUser: async (userId) => {
    return apiClient.get('/api/reviews/for_user/', { user_id: userId });
  },

  // Get review statistics for a user
  getUserReviewStats: async (userId) => {
    return apiClient.get(`/api/reviews/stats/${userId}/`);
  },
};

export default reviewsService;