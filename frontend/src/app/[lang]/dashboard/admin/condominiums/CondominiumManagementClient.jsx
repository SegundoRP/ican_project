'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useCondominiums,
  useCreateCondominium,
  useUpdateCondominium,
  useDeleteCondominium,
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment
} from '@/hooks/use-condominiums';
import {
  FaArrowLeft, FaBuilding, FaPlus, FaEdit, FaTrash,
  FaMapMarkerAlt, FaDoorOpen, FaUsers, FaSpinner, FaSearch
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Spinner } from '@/components/common';

export default function CondominiumManagementClient({ dictionary }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('condominiums');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCondominium, setSelectedCondominium] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [condominiumForm, setCondominiumForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'USA'
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    tower: '',
    floor: '',
    condominium: ''
  });

  // Queries and mutations
  const { data: condominiums, isLoading: condominiumsLoading, refetch: refetchCondominiums } = useCondominiums();
  const { data: departments, isLoading: departmentsLoading, refetch: refetchDepartments } = useDepartments(selectedCondominium);

  const createCondominiumMutation = useCreateCondominium();
  const updateCondominiumMutation = useUpdateCondominium();
  const deleteCondominiumMutation = useDeleteCondominium();

  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();
  const deleteDepartmentMutation = useDeleteDepartment();

  const isLoading = condominiumsLoading || departmentsLoading;

  // Filter data based on search
  const filteredCondominiums = condominiums?.results?.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredDepartments = departments?.results?.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.tower.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.floor.toString().includes(searchTerm)
  ) || [];

  // Handlers for Condominiums
  const handleAddCondominium = () => {
    setCondominiumForm({
      name: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'USA'
    });
    setShowAddModal(true);
  };

  const handleEditCondominium = (condominium) => {
    setSelectedItem(condominium);
    setCondominiumForm({
      name: condominium.name,
      address: condominium.address,
      city: condominium.city,
      state: condominium.state,
      postal_code: condominium.postal_code,
      country: condominium.country
    });
    setShowEditModal(true);
  };

  const handleSaveCondominium = async () => {
    try {
      if (showEditModal && selectedItem) {
        await updateCondominiumMutation.mutateAsync({
          id: selectedItem.id,
          data: condominiumForm
        });
        toast.success('Condominium updated successfully');
      } else {
        await createCondominiumMutation.mutateAsync(condominiumForm);
        toast.success('Condominium created successfully');
      }
      setShowAddModal(false);
      setShowEditModal(false);
      refetchCondominiums();
    } catch (error) {
      toast.error('Failed to save condominium');
    }
  };

  const handleDeleteCondominium = async (id) => {
    if (!window.confirm('Are you sure you want to delete this condominium?')) return;

    try {
      await deleteCondominiumMutation.mutateAsync(id);
      toast.success('Condominium deleted successfully');
      refetchCondominiums();
    } catch (error) {
      toast.error('Failed to delete condominium');
    }
  };

  // Handlers for Departments
  const handleAddDepartment = () => {
    if (!selectedCondominium) {
      toast.warning('Please select a condominium first');
      return;
    }
    setDepartmentForm({
      name: '',
      tower: '',
      floor: '',
      condominium: selectedCondominium
    });
    setShowAddModal(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedItem(department);
    setDepartmentForm({
      name: department.name,
      tower: department.tower,
      floor: department.floor,
      condominium: department.condominium
    });
    setShowEditModal(true);
  };

  const handleSaveDepartment = async () => {
    try {
      if (showEditModal && selectedItem) {
        await updateDepartmentMutation.mutateAsync({
          id: selectedItem.id,
          data: departmentForm
        });
        toast.success('Department updated successfully');
      } else {
        await createDepartmentMutation.mutateAsync(departmentForm);
        toast.success('Department created successfully');
      }
      setShowAddModal(false);
      setShowEditModal(false);
      refetchDepartments();
    } catch (error) {
      toast.error('Failed to save department');
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;

    try {
      await deleteDepartmentMutation.mutateAsync(id);
      toast.success('Department deleted successfully');
      refetchDepartments();
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
              <p className="text-gray-600 mt-2">Manage condominiums and departments</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('condominiums')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'condominiums'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaBuilding className="inline mr-2" />
                Condominiums ({filteredCondominiums.length})
              </button>
              <button
                onClick={() => setActiveTab('departments')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'departments'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaDoorOpen className="inline mr-2" />
                Departments
              </button>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={activeTab === 'condominiums' ? handleAddCondominium : handleAddDepartment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaPlus className="mr-2" />
                Add {activeTab === 'condominiums' ? 'Condominium' : 'Department'}
              </button>
            </div>

            {/* Condominium selector for departments tab */}
            {activeTab === 'departments' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Condominium
                </label>
                <select
                  className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCondominium || ''}
                  onChange={(e) => setSelectedCondominium(e.target.value)}
                >
                  <option value="">Select a condominium...</option>
                  {condominiums?.results?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'condominiums' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCondominiums.map(condominium => (
                  <div key={condominium.id} className="bg-white border rounded-lg p-4 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-3">
                      <FaBuilding className="text-2xl text-blue-600" />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCondominium(condominium)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteCondominium(condominium.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{condominium.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        {condominium.address}
                      </p>
                      <p>{condominium.city}, {condominium.state} {condominium.postal_code}</p>
                      <p className="flex items-center">
                        <FaDoorOpen className="mr-2 text-gray-400" />
                        {condominium.departments_count || 0} departments
                      </p>
                      <p className="flex items-center">
                        <FaUsers className="mr-2 text-gray-400" />
                        {condominium.residents_count || 0} residents
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {!selectedCondominium ? (
                  <div className="text-center py-12">
                    <FaBuilding className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-500">Please select a condominium to view departments</p>
                  </div>
                ) : filteredDepartments.length === 0 ? (
                  <div className="text-center py-12">
                    <FaDoorOpen className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-500">No departments found</p>
                    <button
                      onClick={handleAddDepartment}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add First Department
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDepartments.map(department => (
                      <div key={department.id} className="bg-white border rounded-lg p-4 hover:shadow-lg transition">
                        <div className="flex items-start justify-between mb-3">
                          <FaDoorOpen className="text-2xl text-purple-600" />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditDepartment(department)}
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment(department.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{department.name}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Tower: {department.tower}</p>
                          <p>Floor: {department.floor}</p>
                          <p className="flex items-center">
                            <FaUsers className="mr-2 text-gray-400" />
                            {department.residents_count || 0} residents
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal for Condominiums */}
      {(showAddModal || showEditModal) && activeTab === 'condominiums' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {showEditModal ? 'Edit' : 'Add'} Condominium
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={condominiumForm.name}
                  onChange={(e) => setCondominiumForm({ ...condominiumForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={condominiumForm.address}
                  onChange={(e) => setCondominiumForm({ ...condominiumForm, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={condominiumForm.city}
                    onChange={(e) => setCondominiumForm({ ...condominiumForm, city: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={condominiumForm.state}
                    onChange={(e) => setCondominiumForm({ ...condominiumForm, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={condominiumForm.postal_code}
                    onChange={(e) => setCondominiumForm({ ...condominiumForm, postal_code: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={condominiumForm.country}
                    onChange={(e) => setCondominiumForm({ ...condominiumForm, country: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCondominium}
                disabled={createCondominiumMutation.isLoading || updateCondominiumMutation.isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
              >
                {(createCondominiumMutation.isLoading || updateCondominiumMutation.isLoading) ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  showEditModal ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal for Departments */}
      {(showAddModal || showEditModal) && activeTab === 'departments' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {showEditModal ? 'Edit' : 'Add'} Department
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={departmentForm.name}
                  onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                  placeholder="e.g., Apt 301"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tower *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={departmentForm.tower}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, tower: e.target.value })}
                    placeholder="e.g., A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor *
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={departmentForm.floor}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, floor: e.target.value })}
                    placeholder="e.g., 3"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDepartment}
                disabled={createDepartmentMutation.isLoading || updateDepartmentMutation.isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
              >
                {(createDepartmentMutation.isLoading || updateDepartmentMutation.isLoading) ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  showEditModal ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
