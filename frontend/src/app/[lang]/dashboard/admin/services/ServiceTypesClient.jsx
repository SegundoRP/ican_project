'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServiceTypes, useCreateServiceType, useUpdateServiceType, useDeleteServiceType } from '@/hooks/use-services';
import DataTable from 'react-data-table-component';
import {
  FaArrowLeft, FaTruck, FaPlus, FaEdit, FaTrash,
  FaToggleOn, FaToggleOff, FaDollarSign, FaSpinner
} from 'react-icons/fa';
import { formatCurrency } from '@/utils/permissions';
import { toast } from 'react-toastify';
import { Spinner } from '@/components/common';

export default function ServiceTypesClient({ dictionary }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    price_per_km: '',
    price_per_minute: '',
    is_active: true,
    max_distance_km: '',
    estimated_time_minutes: ''
  });

  const { data: services, isLoading, refetch } = useServiceTypes();
  const createMutation = useCreateServiceType();
  const updateMutation = useUpdateServiceType();
  const deleteMutation = useDeleteServiceType();

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      base_price: '',
      price_per_km: '',
      price_per_minute: '',
      is_active: true,
      max_distance_km: '',
      estimated_time_minutes: ''
    });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      base_price: service.base_price,
      price_per_km: service.price_per_km || '',
      price_per_minute: service.price_per_minute || '',
      is_active: service.is_active,
      max_distance_km: service.max_distance_km || '',
      estimated_time_minutes: service.estimated_time_minutes || ''
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        base_price: parseFloat(formData.base_price),
        price_per_km: formData.price_per_km ? parseFloat(formData.price_per_km) : null,
        price_per_minute: formData.price_per_minute ? parseFloat(formData.price_per_minute) : null,
        max_distance_km: formData.max_distance_km ? parseInt(formData.max_distance_km) : null,
        estimated_time_minutes: formData.estimated_time_minutes ? parseInt(formData.estimated_time_minutes) : null
      };

      if (editMode && selectedService) {
        await updateMutation.mutateAsync({ id: selectedService.id, data });
        toast.success('Service type updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Service type created successfully');
      }
      setShowModal(false);
      refetch();
    } catch (error) {
      toast.error('Failed to save service type');
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await updateMutation.mutateAsync({
        id: service.id,
        data: { ...service, is_active: !service.is_active }
      });
      toast.success(`Service ${service.is_active ? 'deactivated' : 'activated'} successfully`);
      refetch();
    } catch (error) {
      toast.error('Failed to update service status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service type?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Service type deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete service type');
    }
  };

  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '70px'
    },
    {
      name: 'Service Name',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-sm text-gray-500">{row.description}</p>
        </div>
      ),
      width: '250px'
    },
    {
      name: 'Pricing',
      selector: row => row.base_price,
      sortable: true,
      cell: row => (
        <div className="text-sm">
          <p className="font-medium text-green-600">{formatCurrency(row.base_price)}</p>
          {row.price_per_km && <p className="text-gray-500">${row.price_per_km}/km</p>}
          {row.price_per_minute && <p className="text-gray-500">${row.price_per_minute}/min</p>}
        </div>
      ),
      width: '150px'
    },
    {
      name: 'Limits',
      cell: row => (
        <div className="text-sm">
          {row.max_distance_km && <p>Max: {row.max_distance_km} km</p>}
          {row.estimated_time_minutes && <p>Est: {row.estimated_time_minutes} min</p>}
        </div>
      ),
      width: '120px'
    },
    {
      name: 'Status',
      selector: row => row.is_active,
      sortable: true,
      cell: row => (
        <button
          onClick={() => handleToggleActive(row)}
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
            row.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {row.is_active ? (
            <>
              <FaToggleOn className="mr-1" />
              Active
            </>
          ) : (
            <>
              <FaToggleOff className="mr-1" />
              Inactive
            </>
          )}
        </button>
      ),
      width: '120px'
    },
    {
      name: 'Orders',
      selector: row => row.orders_count || 0,
      sortable: true,
      cell: row => (
        <div className="text-center">
          <p className="font-medium">{row.orders_count || 0}</p>
          <p className="text-xs text-gray-500">orders</p>
        </div>
      ),
      width: '100px'
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-yellow-600 hover:text-yellow-800"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
      width: '100px'
    }
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '60px',
      },
    },
    headCells: {
      style: {
        color: '#000',
        fontSize: '13px',
        fontWeight: 600,
        backgroundColor: '#F3F4F6',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const activeServices = services?.results?.filter(s => s.is_active).length || 0;
  const totalRevenue = services?.results?.reduce((sum, s) =>
    sum + (s.orders_count || 0) * s.base_price, 0
  ) || 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Admin Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Types Management</h1>
              <p className="text-gray-600 mt-2">Configure delivery services and pricing</p>
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Service Type
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{services?.results?.length || 0}</p>
              </div>
              <FaTruck className="text-3xl text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Services</p>
                <p className="text-2xl font-bold text-green-600">{activeServices}</p>
              </div>
              <FaToggleOn className="text-3xl text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-purple-600">
                  {services?.results?.reduce((sum, s) => sum + (s.orders_count || 0), 0) || 0}
                </p>
              </div>
              <FaTruck className="text-3xl text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Est. Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <FaDollarSign className="text-3xl text-green-500" />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow">
          <DataTable
            columns={columns}
            data={services?.results || []}
            pagination
            paginationPerPage={10}
            customStyles={customStyles}
            fixedHeader
            progressPending={isLoading}
            progressComponent={
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-blue-600 text-3xl" />
              </div>
            }
            noDataComponent={
              <div className="py-12 text-center">
                <FaTruck className="text-gray-300 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">No service types found</p>
                <button
                  onClick={handleAdd}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add First Service Type
                </button>
              </div>
            }
            highlightOnHover
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? 'Edit' : 'Add'} Service Type
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Standard Delivery"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  placeholder="Service description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  placeholder="10.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per KM ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.price_per_km}
                  onChange={(e) => setFormData({ ...formData, price_per_km: e.target.value })}
                  placeholder="2.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Minute ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.price_per_minute}
                  onChange={(e) => setFormData({ ...formData, price_per_minute: e.target.value })}
                  placeholder="0.50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Distance (km)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.max_distance_km}
                  onChange={(e) => setFormData({ ...formData, max_distance_km: e.target.value })}
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Time (minutes)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.estimated_time_minutes}
                  onChange={(e) => setFormData({ ...formData, estimated_time_minutes: e.target.value })}
                  placeholder="30"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
              >
                {(createMutation.isLoading || updateMutation.isLoading) ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  editMode ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
