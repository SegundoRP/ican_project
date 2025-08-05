import apiClient from './api-client';

const servicesService = {
  // Get all service types
  getServiceTypes: async () => {
    return apiClient.get('/api/services/types/');
  },

  // Get single service type
  getServiceType: async (id) => {
    return apiClient.get(`/api/services/types/${id}/`);
  },

  // Create service type (admin only)
  createServiceType: async (data) => {
    return apiClient.post('/api/services/types/', data);
  },

  // Update service type (admin only)
  updateServiceType: async ({ id, data }) => {
    return apiClient.patch(`/api/services/types/${id}/`, data);
  },

  // Delete service type (admin only)
  deleteServiceType: async (id) => {
    return apiClient.delete(`/api/services/types/${id}/`);
  },

  // Get all services (for deliverers)
  getServices: async (params = {}) => {
    return apiClient.get('/api/services/', params);
  },

  // Get single service
  getService: async (id) => {
    return apiClient.get(`/api/services/${id}/`);
  },

  // Update service (deliverer only)
  updateService: async ({ id, data }) => {
    return apiClient.patch(`/api/services/${id}/`, data);
  },

  // Delete service (deliverer only)
  deleteService: async (id) => {
    return apiClient.delete(`/api/services/${id}/`);
  },
};

export default servicesService;