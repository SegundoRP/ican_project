'use client';

import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useOrders } from '@/hooks/use-orders';
import { useCondominiums } from '@/hooks/use-condominiums';
import usePermissions from '@/hooks/use-permissions';
import { FaFilter, FaSpinner, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { formatDate, getOrderStatusColor, getOrderStatusDisplayName } from '@/utils/permissions';

export default function OrderListWithFilters({ dictionary }) {
  const { user, canDeliver, canReceive } = usePermissions();

  // States for filters
  const [filters, setFilters] = useState({
    status: '',
    condominium: '',
    dateFrom: '',
    dateTo: '',
    isImmediate: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Build query params
  const queryParams = {};
  if (filters.status) queryParams.status = filters.status;
  if (filters.condominium) queryParams.condominium = filters.condominium;
  if (filters.dateFrom) queryParams.date_from = filters.dateFrom;
  if (filters.dateTo) queryParams.date_to = filters.dateTo;
  if (filters.isImmediate !== '') queryParams.is_immediate = filters.isImmediate;

  // Fetch data
  const { data: ordersData, isLoading } = useOrders(queryParams);
  const { data: condominiums } = useCondominiums();

  // Filter by search term locally
  const filteredOrders = ordersData?.results?.filter(order => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      order.id.toString().includes(searchLower) ||
      order.receiver_name?.toLowerCase().includes(searchLower) ||
      order.deliverer_name?.toLowerCase().includes(searchLower) ||
      order.delivery_notes?.toLowerCase().includes(searchLower)
    );
  }) || [];

  // DataTable columns
  const columns = [
    {
      name: dictionary.TablesOrders.Columns.Order,
      selector: row => `#${row.id}`,
      sortable: true,
      width: '100px'
    },
    {
      name: dictionary.TablesOrders.Columns.Date,
      selector: row => formatDate(row.scheduled_date, true),
      sortable: true,
      width: '180px'
    },
    {
      name: 'Amount',
      selector: row => `$${row.amount}`,
      sortable: true,
      width: '100px'
    },
    {
      name: 'Receiver',
      selector: row => row.receiver_name || row.receiver_email,
      sortable: true,
      hide: canDeliver && !canReceive // Hide if user is only deliverer
    },
    {
      name: dictionary.TablesOrders.Columns.Repartidev,
      selector: row => row.deliverer_name || 'Not assigned',
      sortable: true,
      hide: canReceive && !canDeliver // Hide if user is only receiver
    },
    {
      name: dictionary.TablesOrders.Columns.Status,
      selector: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(row.status)}`}>
          {getOrderStatusDisplayName(row.status)}
        </span>
      ),
      sortable: true,
      width: '130px'
    },
    {
      name: 'Immediate',
      selector: row => row.is_immediate ? (
        <span className="text-red-600 font-medium">Yes</span>
      ) : (
        <span className="text-gray-500">No</span>
      ),
      sortable: true,
      width: '100px'
    },
    {
      name: 'Actions',
      cell: row => (
        <Link href={`/dashboard/orders/${row.id}`}>
          <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
            <FaEye />
            <span>View</span>
          </button>
        </Link>
      ),
      width: '100px'
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
        fontSize: '14px',
        fontWeight: 600,
        backgroundColor: '#EEE',
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
      status: '',
      condominium: '',
      dateFrom: '',
      dateTo: '',
      isImmediate: '',
      search: ''
    });
  };

  return (
    <section>
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder={dictionary.TablesOrders.Search}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

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
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
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
                <option value="1">Pending</option>
                <option value="4">Accepted</option>
                <option value="5">In Progress</option>
                <option value="6">Completed</option>
                <option value="7">Cancelled</option>
              </select>
            </div>

            {/* Condominium Filter */}
            {user?.is_staff && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {dictionary.TablesOrders.Columns.Building}
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.condominium}
                  onChange={(e) => handleFilterChange('condominium', e.target.value)}
                >
                  <option value="">All Buildings</option>
                  {condominiums?.map(condo => (
                    <option key={condo.id} value={condo.id}>
                      {condo.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date From */}
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

            {/* Date To */}
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

            {/* Immediate Delivery */}
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
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-blue-600 text-3xl" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          customStyles={customStyles}
          fixedHeader
          fixedHeaderScrollHeight="600px"
          noDataComponent={
            <div className="py-12 text-center text-gray-500">
              No orders found matching your criteria
            </div>
          }
          progressPending={isLoading}
          progressComponent={
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-blue-600 text-3xl" />
            </div>
          }
        />
      )}
    </section>
  );
}
