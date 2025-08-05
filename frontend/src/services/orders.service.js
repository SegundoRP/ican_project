import apiClient from './api-client';

const ordersService = {
  // Get all orders
  getOrders: async (params = {}) => {
    return apiClient.get('/api/orders/', params);
  },

  // Get single order
  getOrder: async (id) => {
    return apiClient.get(`/api/orders/${id}/`);
  },

  // Create order (receiver only)
  createOrder: async (data) => {
    return apiClient.post('/api/orders/', data);
  },

  // Update order (receiver only)
  updateOrder: async ({ id, data }) => {
    return apiClient.patch(`/api/orders/${id}/`, data);
  },

  // Delete order (receiver only)
  deleteOrder: async (id) => {
    return apiClient.delete(`/api/orders/${id}/`);
  },

  // Order actions
  acceptOrder: async (id) => {
    return apiClient.post(`/api/orders/${id}/accept_order/`);
  },

  rejectOrder: async (id, data = {}) => {
    return apiClient.post(`/api/orders/${id}/reject_order/`, data);
  },

  completeOrder: async (id, data = {}) => {
    return apiClient.post(`/api/orders/${id}/complete_order/`, data);
  },

  cancelOrder: async (id, data = {}) => {
    return apiClient.post(`/api/orders/${id}/cancel_order/`, data);
  },

  // Get user's orders as receiver
  getMyRequests: async (params = {}) => {
    return apiClient.get('/api/orders/my_requests/', params);
  },

  // Get user's orders as deliverer
  getMyDeliveries: async (params = {}) => {
    return apiClient.get('/api/orders/my_deliveries/', params);
  },

  // Check delivery availability
  checkAvailability: async (condominiumId) => {
    return apiClient.get(`/api/orders/check_availability/?condominium=${condominiumId}`);
  },

  // Get order statistics
  getOrderStats: async (params = {}) => {
    return apiClient.get('/api/orders/stats/', params);
  },
};

export default ordersService;