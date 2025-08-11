'use client';

import React, { useState } from 'react';
import { useAvailableOrders, useAcceptOrder, useRejectOrder } from '@/hooks/use-orders';
import { useCondominiums } from '@/hooks/use-condominiums';
import { useCurrentUser } from '@/hooks/use-users';
import usePermissions from '@/hooks/use-permissions';
import { useRouter } from 'next/navigation';
import DataTable from 'react-data-table-component';
import {
  FaClock, FaDollarSign, FaMapMarkerAlt, FaCheckCircle,
  FaTimesCircle, FaSpinner, FaExclamationTriangle, FaFilter
} from 'react-icons/fa';
import { formatDate, formatCurrency } from '@/utils/permissions';
import { toast } from 'react-toastify';
import { Spinner } from '@/components/common';

export default function AvailableOrdersClient({ dictionary }) {
  const router = useRouter();
  const { canDeliver, isAvailable } = usePermissions();
  const { data: currentUser } = useCurrentUser();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    condominium: '',
    isImmediate: '',
    minAmount: '',
    maxAmount: ''
  });

  // Check permissions
  if (!canDeliver) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">
            Only users with deliverer role can access this page.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">You are not available</h2>
          <p className="text-gray-600 mb-4">
            Please update your availability status in your profile to see available orders.
          </p>
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  // Build query params
  const queryParams = { status: 1 }; // Only pending orders
  if (filters.condominium) queryParams.condominium = filters.condominium;
  if (filters.isImmediate !== '') queryParams.is_immediate = filters.isImmediate;

  // Fetch data
  const { data: ordersData, isLoading, refetch } = useAvailableOrders(queryParams);
  const { data: condominiums } = useCondominiums();
  const acceptMutation = useAcceptOrder();
  const rejectMutation = useRejectOrder();

  // Filter by amount locally
  const filteredOrders = ordersData?.results?.filter(order => {
    if (filters.minAmount && parseFloat(order.amount) < parseFloat(filters.minAmount)) return false;
    if (filters.maxAmount && parseFloat(order.amount) > parseFloat(filters.maxAmount)) return false;
    return true;
  }) || [];

  // Only show orders from the same condominium as the deliverer
  const sameCondominiumOrders = filteredOrders.filter(order => {
    if (!currentUser?.department?.condominium?.id) return false;
    // This would need backend support to filter by receiver's condominium
    return true; // For now, show all orders
  });

  const handleAccept = async (orderId) => {
    try {
      await acceptMutation.mutateAsync(orderId);
      toast.success('Order accepted successfully!');
      refetch();
      router.push(`/dashboard/orders/${orderId}`);
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleReject = async (orderId) => {
    if (window.confirm('Are you sure you want to reject this order?')) {
      try {
        await rejectMutation.mutateAsync(orderId);
        toast.info('Order rejected');
        refetch();
      } catch (error) {
        console.error('Error rejecting order:', error);
      }
    }
  };

  const columns = [
    {
      name: 'Order #',
      selector: row => `#${row.id}`,
      sortable: true,
      width: '100px'
    },
    {
      name: 'Type',
      selector: row => row.is_immediate ? (
        <span className="text-red-600 font-medium flex items-center">
          <FaClock className="mr-1" /> Immediate
        </span>
      ) : (
        <span className="text-blue-600">Scheduled</span>
      ),
      width: '120px'
    },
    {
      name: 'Delivery Time',
      selector: row => formatDate(row.scheduled_date, true),
      sortable: true,
      width: '180px'
    },
    {
      name: 'Amount',
      selector: row => (
        <span className="font-medium text-green-600">
          {formatCurrency(row.amount)}
        </span>
      ),
      sortable: true,
      width: '100px'
    },
    {
      name: 'Location',
      selector: row => (
        <div className="text-sm">
          <p className="font-medium">Tower {row.receiver_department?.tower || 'N/A'}</p>
          <p className="text-gray-500">Floor {row.receiver_department?.floor || 'N/A'}</p>
        </div>
      ),
      width: '120px'
    },
    {
      name: 'Notes',
      selector: row => row.delivery_notes || 'No notes',
      wrap: true,
      width: '200px'
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleAccept(row.id)}
            disabled={acceptMutation.isLoading && selectedOrder === row.id}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            title="Accept Order"
          >
            {acceptMutation.isLoading && selectedOrder === row.id ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaCheckCircle />
            )}
          </button>
          <button
            onClick={() => handleReject(row.id)}
            disabled={rejectMutation.isLoading && selectedOrder === row.id}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            title="Reject Order"
          >
            {rejectMutation.isLoading && selectedOrder === row.id ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaTimesCircle />
            )}
          </button>
        </div>
      ),
      width: '150px'
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
        fontSize: '14px',
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
      },
    },
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      condominium: '',
      isImmediate: '',
      minAmount: '',
      maxAmount: ''
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Available Orders</h1>
          <p className="text-gray-600 mt-2">
            Accept orders from your neighbors in {currentUser?.department?.condominium?.name || 'your condominium'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available Orders</p>
                <p className="text-2xl font-bold text-gray-900">{sameCondominiumOrders.length}</p>
              </div>
              <FaMapMarkerAlt className="text-blue-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Immediate Orders</p>
                <p className="text-2xl font-bold text-red-600">
                  {sameCondominiumOrders.filter(o => o.is_immediate).length}
                </p>
              </div>
              <FaClock className="text-red-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Potential Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    sameCondominiumOrders.reduce((sum, o) => sum + parseFloat(o.amount), 0)
                  )}
                </p>
              </div>
              <FaDollarSign className="text-green-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Filter Toggle */}
          <div className="p-4 border-b">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <FaFilter className="mr-2" />
              Filters {Object.values(filters).filter(v => v !== '').length > 0 && `(${Object.values(filters).filter(v => v !== '').length})`}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Delivery Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.isImmediate}
                    onChange={(e) => handleFilterChange('isImmediate', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="true">Immediate Only</option>
                    <option value="false">Scheduled Only</option>
                  </select>
                </div>

                {/* Min Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Max Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    placeholder="100.00"
                  />
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition"
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
            data={sameCondominiumOrders}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30]}
            customStyles={customStyles}
            fixedHeader
            fixedHeaderScrollHeight="600px"
            noDataComponent={
              <div className="py-12 text-center">
                <FaMapMarkerAlt className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No available orders at the moment</p>
                <p className="text-gray-400 text-sm mt-2">Check back later for new orders</p>
              </div>
            }
            progressPending={isLoading}
            progressComponent={
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-blue-600 text-3xl" />
              </div>
            }
            onRowClicked={(row) => setSelectedOrder(row.id)}
            highlightOnHover
            pointerOnHover
          />
        </div>
      </div>
    </div>
  );
}
