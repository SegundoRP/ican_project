import apiClient from './api-client';

const paymentsService = {
  // Get all payments
  getPayments: async (params = {}) => {
    return apiClient.get('/api/payments/', params);
  },

  // Get single payment
  getPayment: async (id) => {
    return apiClient.get(`/api/payments/${id}/`);
  },

  // Create payment (receiver only)
  createPayment: async (data) => {
    return apiClient.post('/api/payments/', data);
  },

  // Update payment (receiver only)
  updatePayment: async ({ id, data }) => {
    return apiClient.patch(`/api/payments/${id}/`, data);
  },

  // Delete payment (receiver only)
  deletePayment: async (id) => {
    return apiClient.delete(`/api/payments/${id}/`);
  },

  // Verify payment (admin only)
  verifyPayment: async (id) => {
    return apiClient.post(`/api/payments/${id}/verify_payment/`);
  },

  // Get payment summary
  getPaymentSummary: async (params = {}) => {
    return apiClient.get('/api/payments/summary/', params);
  },

  // Get payments by order
  getPaymentsByOrder: async (orderId) => {
    return apiClient.get('/api/payments/', { order: orderId });
  },
};

export default paymentsService;