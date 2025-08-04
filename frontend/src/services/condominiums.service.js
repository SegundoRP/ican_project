import apiClient from './api-client';

const condominiumsService = {
  // Get all condominiums
  getCondominiums: async () => {
    return apiClient.get('/api/condominiums/');
  },

  // Get single condominium with departments
  getCondominium: async (id) => {
    return apiClient.get(`/api/condominiums/${id}/`);
  },

  // Create condominium (admin only)
  createCondominium: async (data) => {
    return apiClient.post('/api/condominiums/', data);
  },

  // Update condominium (admin only)
  updateCondominium: async ({ id, data }) => {
    return apiClient.patch(`/api/condominiums/${id}/`, data);
  },

  // Delete condominium (admin only)
  deleteCondominium: async (id) => {
    return apiClient.delete(`/api/condominiums/${id}/`);
  },

  // Get all departments
  getDepartments: async (condominiumId = null) => {
    const params = condominiumId ? { condominium: condominiumId } : {};
    return apiClient.get('/api/condominiums/departments/', params);
  },

  // Get single department
  getDepartment: async (id) => {
    return apiClient.get(`/api/condominiums/departments/${id}/`);
  },

  // Create department (admin only)
  createDepartment: async (data) => {
    return apiClient.post('/api/condominiums/departments/', data);
  },

  // Update department (admin only)
  updateDepartment: async ({ id, data }) => {
    return apiClient.patch(`/api/condominiums/departments/${id}/`, data);
  },

  // Delete department (admin only)
  deleteDepartment: async (id) => {
    return apiClient.delete(`/api/condominiums/departments/${id}/`);
  },
};

export default condominiumsService;