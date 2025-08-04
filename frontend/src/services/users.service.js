import apiClient from './api-client';

const usersService = {
  // Get all users (admin only)
  getUsers: async (params = {}) => {
    return apiClient.get('/api/users/', params);
  },

  // Get single user
  getUser: async (id) => {
    return apiClient.get(`/api/users/${id}/`);
  },

  // Get current user profile
  getCurrentUser: async () => {
    return apiClient.get('/api/users/me/');
  },

  // Update user profile
  updateUser: async ({ id, data }) => {
    return apiClient.patch(`/api/users/${id}/`, data);
  },

  // Update current user profile
  updateCurrentUser: async (data) => {
    return apiClient.patch('/api/users/me/', data);
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    return apiClient.delete(`/api/users/${id}/`);
  },

  // Change user role
  changeUserRole: async ({ id, role }) => {
    return apiClient.post(`/api/users/${id}/change_role/`, { role });
  },

  // Toggle user availability (deliverer)
  toggleAvailability: async (id) => {
    return apiClient.post(`/api/users/${id}/toggle_availability/`);
  },

  // Get available deliverers
  getAvailableDeliverers: async (params = {}) => {
    return apiClient.get('/api/users/available_deliverers/', params);
  },

  // Get earnings summary (deliverer)
  getEarningsSummary: async (params = {}) => {
    return apiClient.get('/api/users/earnings_summary/', params);
  },

  // Update user department
  updateUserDepartment: async ({ id, departmentId }) => {
    return apiClient.patch(`/api/users/${id}/`, { department: departmentId });
  },

  // Search users
  searchUsers: async (query) => {
    return apiClient.get('/api/users/', { search: query });
  },
};

export default usersService;