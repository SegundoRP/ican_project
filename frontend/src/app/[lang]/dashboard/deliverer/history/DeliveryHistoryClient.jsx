'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyDeliveries } from '@/hooks/use-orders';
import DataTable from 'react-data-table-component';
import {
  FaArrowLeft, FaFilter, FaDownload, FaEye, FaSpinner, FaCalendarAlt
} from 'react-icons/fa';
import { formatDate, formatCurrency, getOrderStatusDisplayName, getOrderStatusColor } from '@/utils/permissions';

export default function DeliveryHistoryClient({ dictionary }) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Build query params
  const queryParams = {};
  if (filters.status) queryParams.status = filters.status;
  if (filters.dateFrom) queryParams.date_from = filters.dateFrom;
  if (filters.dateTo) queryParams.date_to = filters.dateTo;

  const { data: deliveries, isLoading } = useMyDeliveries(queryParams);

  // Filter by search locally
  const filteredDeliveries = deliveries?.results?.filter(delivery => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      delivery.id.toString().includes(searchLower) ||
      delivery.receiver_name?.toLowerCase().includes(searchLower) ||
      delivery.receiver_email?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const columns = [
    {
      name: 'Order ID',
      selector: row => `#${row.id}`,
      sortable: true,
      width: '100px'
    },
    {
      name: 'Date',
      selector: row => formatDate(row.created_at),
      sortable: true,
      width: '120px'
    },
    {
      name: 'Time',
      selector: row => new Date(row.scheduled_date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      sortable: true,
      width: '100px'
    },
    {
      name: 'Customer',
      selector: row => row.receiver_name || row.receiver_email,
      sortable: true,
      width: '180px'
    },
    {
      name: 'Location',
      selector: row => row.receiver_department ?
        `T${row.receiver_department.tower}-F${row.receiver_department.floor}` :
        'N/A',
      width: '100px'
    },
    {
      name: 'Amount',
      selector: row => formatCurrency(row.amount),
      sortable: true,
      width: '100px',
      cell: row => (
        <span className="font-medium text-green-600">
          {formatCurrency(row.amount)}
        </span>
      )
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      width: '130px',
      cell: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(row.status)}`}>
          {getOrderStatusDisplayName(row.status)}
        </span>
      )
    },
    {
      name: 'Type',
      selector: row => row.is_immediate,
      width: '100px',
      cell: row => row.is_immediate ? (
        <span className="text-red-600 font-medium text-xs">Immediate</span>
      ) : (
        <span className="text-blue-600 text-xs">Scheduled</span>
      )
    },
    {
      name: 'Actions',
      width: '100px',
      cell: row => (
        <button
          onClick={() => router.push(`/dashboard/orders/${row.id}`)}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaEye />
        </button>
      )
    }
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '52px',
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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };

  const exportData = () => {
    const csv = [
      ['Order ID', 'Date', 'Customer', 'Amount', 'Status'],
      ...filteredDeliveries.map(d => [
        d.id,
        formatDate(d.created_at),
        d.receiver_name || d.receiver_email,
        d.amount,
        getOrderStatusDisplayName(d.status)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Calculate stats
  const stats = {
    total: filteredDeliveries.length,
    completed: filteredDeliveries.filter(d => d.status === 6).length,
    cancelled: filteredDeliveries.filter(d => d.status === 7).length,
    totalEarnings: filteredDeliveries
      .filter(d => d.status === 6)
      .reduce((sum, d) => sum + parseFloat(d.amount), 0)
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/deliverer')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Delivery History</h1>
              <p className="text-gray-600 mt-2">View all your past deliveries</p>
            </div>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FaDownload className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total Deliveries</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total Earnings</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalEarnings)}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Search and Filters */}
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <input
                type="text"
                placeholder="Search by order ID or customer..."
                className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />

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
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="4">Accepted</option>
                    <option value="5">In Progress</option>
                    <option value="6">Completed</option>
                    <option value="7">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date From
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date To
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredDeliveries}
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
                <FaCalendarAlt className="text-gray-300 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">No deliveries found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Your delivery history will appear here
                </p>
              </div>
            }
            highlightOnHover
            pointerOnHover
          />
        </div>
      </div>
    </div>
  );
}
