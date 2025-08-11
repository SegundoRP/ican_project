'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAllUsers, useUpdateUser, useToggleUserActive } from '@/hooks/use-users';
import DataTable from 'react-data-table-component';
import {
  FaArrowLeft, FaFilter, FaUserEdit, FaUserCheck, FaUserTimes,
  FaEye, FaSearch, FaDownload, FaUserPlus, FaSpinner
} from 'react-icons/fa';
import { formatDate } from '@/utils/permissions';
import { toast } from 'react-toastify';
import { Spinner } from '@/components/common';

export default function UserManagementClient({ dictionary }) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    condominium: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    role: '',
    is_active: true
  });

  const { data: users, isLoading, refetch } = useAllUsers();
  const updateUserMutation = useUpdateUser();
  const toggleActiveMutation = useToggleUserActive();

  // Filter users locally
  const filteredUsers = users?.results?.filter(user => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!user.email?.toLowerCase().includes(searchLower) &&
          !user.first_name?.toLowerCase().includes(searchLower) &&
          !user.last_name?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (filters.role && user.role !== filters.role) return false;
    if (filters.status === 'active' && !user.is_active) return false;
    if (filters.status === 'inactive' && user.is_active) return false;
    return true;
  }) || [];

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await toggleActiveMutation.mutateAsync(userId);
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      refetch();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      role: user.role,
      is_active: user.is_active
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUserMutation.mutateAsync({
        userId: selectedUser.id,
        data: editForm
      });
      toast.success('User updated successfully');
      setShowEditModal(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const exportUsers = () => {
    const csv = [
      ['ID', 'Email', 'Name', 'Role', 'Status', 'Department', 'Joined'],
      ...filteredUsers.map(u => [
        u.id,
        u.email,
        `${u.first_name} ${u.last_name}`,
        u.role,
        u.is_active ? 'Active' : 'Inactive',
        u.department?.name || 'N/A',
        formatDate(u.date_joined)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '70px'
    },
    {
      name: 'User',
      selector: row => row.email,
      sortable: true,
      cell: row => (
        <div>
          <p className="font-medium">{row.email}</p>
          <p className="text-sm text-gray-500">
            {row.first_name} {row.last_name}
          </p>
        </div>
      ),
      width: '250px'
    },
    {
      name: 'Role',
      selector: row => row.role,
      sortable: true,
      cell: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.role === 'Deliverer' ? 'bg-blue-100 text-blue-800' :
          row.role === 'Receiver' ? 'bg-green-100 text-green-800' :
          row.role === 'Both' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.role}
        </span>
      ),
      width: '120px'
    },
    {
      name: 'Department',
      selector: row => row.department?.name || 'N/A',
      sortable: true,
      cell: row => row.department ? (
        <div className="text-sm">
          <p>{row.department.name}</p>
          <p className="text-gray-500">
            {row.department.condominium?.name}
          </p>
        </div>
      ) : (
        <span className="text-gray-400">N/A</span>
      ),
      width: '180px'
    },
    {
      name: 'Status',
      selector: row => row.is_active,
      sortable: true,
      cell: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      width: '100px'
    },
    {
      name: 'Available',
      selector: row => row.is_available,
      cell: row => (row.role === 'Deliverer' || row.role === 'Both') ? (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}>
          {row.is_available ? 'Online' : 'Offline'}
        </span>
      ) : (
        <span className="text-gray-400 text-xs">N/A</span>
      ),
      width: '100px'
    },
    {
      name: 'Joined',
      selector: row => row.date_joined,
      sortable: true,
      cell: row => formatDate(row.date_joined),
      width: '120px'
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push(`/dashboard/admin/users/${row.id}`)}
            className="text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleEditUser(row)}
            className="text-yellow-600 hover:text-yellow-800"
            title="Edit User"
          >
            <FaUserEdit />
          </button>
          <button
            onClick={() => handleToggleActive(row.id, row.is_active)}
            className={row.is_active ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"}
            title={row.is_active ? "Deactivate" : "Activate"}
          >
            {row.is_active ? <FaUserTimes /> : <FaUserCheck />}
          </button>
        </div>
      ),
      width: '120px'
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
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        fontSize: '14px',
      },
    },
  };

  // Calculate statistics
  const stats = {
    total: filteredUsers.length,
    active: filteredUsers.filter(u => u.is_active).length,
    deliverers: filteredUsers.filter(u => u.role === 'Deliverer' || u.role === 'Both').length,
    receivers: filteredUsers.filter(u => u.role === 'Receiver' || u.role === 'Both').length,
    online: filteredUsers.filter(u => u.is_available && (u.role === 'Deliverer' || u.role === 'Both')).length
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
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">Manage system users and permissions</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportUsers}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <FaDownload className="mr-2" />
                Export
              </button>
              <button
                onClick={() => router.push('/dashboard/admin/users/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaUserPlus className="mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Deliverers</p>
            <p className="text-2xl font-bold text-blue-600">{stats.deliverers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Receivers</p>
            <p className="text-2xl font-bold text-purple-600">{stats.receivers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Online Now</p>
            <p className="text-2xl font-bold text-green-600">{stats.online}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Search and Filters */}
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  >
                    <option value="">All Roles</option>
                    <option value="Receiver">Receiver</option>
                    <option value="Deliverer">Deliverer</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ search: '', role: '', status: '', condominium: '' })}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredUsers}
            pagination
            paginationPerPage={20}
            paginationRowsPerPageOptions={[20, 50, 100]}
            customStyles={customStyles}
            fixedHeader
            fixedHeaderScrollHeight="600px"
            progressPending={isLoading}
            progressComponent={
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-blue-600 text-3xl" />
              </div>
            }
            noDataComponent={
              <div className="py-12 text-center">
                <p className="text-gray-500">No users found</p>
              </div>
            }
            highlightOnHover
            pointerOnHover
          />
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="Receiver">Receiver</option>
                  <option value="Deliverer">Deliverer</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={updateUserMutation.isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {updateUserMutation.isLoading ? 'Updating...' : 'Update User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
