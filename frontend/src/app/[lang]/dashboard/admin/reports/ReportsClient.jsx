'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaArrowLeft, FaChartBar, FaTrophy, FaBuilding, FaFileCsv
} from 'react-icons/fa';
import { formatCurrency, formatDate } from '@/utils/permissions';
import { useAllOrders } from '@/hooks/use-orders';
import { useAllUsers } from '@/hooks/use-users';
import { useCondominiums } from '@/hooks/use-condominiums';
import DataTable from 'react-data-table-component';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { Spinner } from '@/components/common';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsClient({ dictionary }) {
  const router = useRouter();
  const [activeReport, setActiveReport] = useState('orders');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedCondominium, setSelectedCondominium] = useState('');

  const { data: orders, isLoading: ordersLoading } = useAllOrders();
  const { data: users, isLoading: usersLoading } = useAllUsers();
  const { data: condominiums, isLoading: condominiumsLoading } = useCondominiums();

  const isLoading = ordersLoading || usersLoading || condominiumsLoading;

  // Filter orders by date range and condominium
  const filteredOrders = orders?.results?.filter(order => {
    const orderDate = new Date(order.created_at);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    if (orderDate < startDate || orderDate > endDate) return false;
    if (selectedCondominium && order.receiver_department?.condominium?.id !== parseInt(selectedCondominium)) {
      return false;
    }
    return true;
  }) || [];

  // Generate Orders Report Data
  const generateOrdersReport = () => {
    const ordersByStatus = {
      pending: filteredOrders.filter(o => o.status === 1).length,
      confirmed: filteredOrders.filter(o => o.status === 2).length,
      assigned: filteredOrders.filter(o => o.status === 3).length,
      accepted: filteredOrders.filter(o => o.status === 4).length,
      inProgress: filteredOrders.filter(o => o.status === 5).length,
      completed: filteredOrders.filter(o => o.status === 6).length,
      cancelled: filteredOrders.filter(o => o.status === 7).length
    };

    const totalRevenue = filteredOrders
      .filter(o => o.status === 6)
      .reduce((sum, o) => sum + parseFloat(o.amount), 0);

    const avgOrderValue = filteredOrders.length > 0
      ? totalRevenue / filteredOrders.filter(o => o.status === 6).length
      : 0;

    // Orders by day
    const ordersByDay = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      ordersByDay[date] = (ordersByDay[date] || 0) + 1;
    });

    return {
      summary: {
        total: filteredOrders.length,
        completed: ordersByStatus.completed,
        cancelled: ordersByStatus.cancelled,
        revenue: totalRevenue,
        avgValue: avgOrderValue,
        completionRate: filteredOrders.length > 0
          ? (ordersByStatus.completed / filteredOrders.length * 100).toFixed(1)
          : 0
      },
      byStatus: ordersByStatus,
      byDay: ordersByDay,
      details: filteredOrders.map(o => ({
        id: o.id,
        date: formatDate(o.created_at),
        customer: o.receiver_name || o.receiver_email,
        deliverer: o.deliverer_name || 'N/A',
        amount: o.amount,
        status: getOrderStatusName(o.status),
        condominium: o.receiver_department?.condominium?.name || 'N/A'
      }))
    };
  };

  // Generate Deliverer Rankings
  const generateDelivererRankings = () => {
    const deliverers = users?.results?.filter(u =>
      u.role === 'Deliverer' || u.role === 'Both'
    ) || [];

    const rankings = deliverers.map(deliverer => {
      const delivererOrders = filteredOrders.filter(o => o.deliverer === deliverer.id);
      const completedOrders = delivererOrders.filter(o => o.status === 6);
      const earnings = completedOrders.reduce((sum, o) => sum + parseFloat(o.amount), 0);

      return {
        id: deliverer.id,
        name: `${deliverer.first_name} ${deliverer.last_name}`,
        email: deliverer.email,
        totalOrders: delivererOrders.length,
        completedOrders: completedOrders.length,
        cancelledOrders: delivererOrders.filter(o => o.status === 7).length,
        earnings,
        completionRate: delivererOrders.length > 0
          ? (completedOrders.length / delivererOrders.length * 100).toFixed(1)
          : 0,
        avgDeliveryTime: calculateAvgDeliveryTime(completedOrders),
        rating: deliverer.average_rating || 0
      };
    }).sort((a, b) => b.completedOrders - a.completedOrders);

    return rankings;
  };

  // Generate Condominium Statistics
  const generateCondominiumStats = () => {
    const stats = condominiums?.results?.map(condo => {
      const condoOrders = filteredOrders.filter(o =>
        o.receiver_department?.condominium?.id === condo.id
      );
      const revenue = condoOrders
        .filter(o => o.status === 6)
        .reduce((sum, o) => sum + parseFloat(o.amount), 0);

      return {
        id: condo.id,
        name: condo.name,
        address: condo.address,
        totalOrders: condoOrders.length,
        completedOrders: condoOrders.filter(o => o.status === 6).length,
        revenue,
        departments: condo.departments_count || 0,
        residents: condo.residents_count || 0,
        avgOrderValue: condoOrders.length > 0 ? revenue / condoOrders.length : 0
      };
    }).sort((a, b) => b.totalOrders - a.totalOrders) || [];

    return stats;
  };

  const calculateAvgDeliveryTime = (orders) => {
    if (orders.length === 0) return 0;

    const times = orders
      .filter(o => o.completed_at && o.created_at)
      .map(o => {
        const created = new Date(o.created_at);
        const completed = new Date(o.completed_at);
        return (completed - created) / (1000 * 60); // minutes
      });

    return times.length > 0
      ? (times.reduce((sum, time) => sum + time, 0) / times.length).toFixed(0)
      : 0;
  };

  const getOrderStatusName = (status) => {
    const statusMap = {
      1: 'Pending',
      2: 'Confirmed',
      3: 'Assigned',
      4: 'Accepted',
      5: 'In Progress',
      6: 'Completed',
      7: 'Cancelled'
    };
    return statusMap[status] || 'Unknown';
  };

  // Export functions
  const exportToCSV = (data, filename) => {
    let csv = '';

    if (activeReport === 'orders') {
      const report = generateOrdersReport();
      csv = [
        ['Orders Report', `${dateRange.start} to ${dateRange.end}`],
        [],
        ['Summary'],
        ['Total Orders', report.summary.total],
        ['Completed', report.summary.completed],
        ['Cancelled', report.summary.cancelled],
        ['Total Revenue', report.summary.revenue],
        ['Average Order Value', report.summary.avgValue],
        ['Completion Rate', `${report.summary.completionRate}%`],
        [],
        ['Order Details'],
        ['ID', 'Date', 'Customer', 'Deliverer', 'Amount', 'Status', 'Condominium'],
        ...report.details.map(o => [
          o.id, o.date, o.customer, o.deliverer, o.amount, o.status, o.condominium
        ])
      ].map(row => row.join(',')).join('\n');
    } else if (activeReport === 'deliverers') {
      const rankings = generateDelivererRankings();
      csv = [
        ['Deliverer Rankings Report', `${dateRange.start} to ${dateRange.end}`],
        [],
        ['Rank', 'Name', 'Email', 'Total Orders', 'Completed', 'Cancelled', 'Earnings', 'Completion Rate', 'Avg Delivery Time', 'Rating'],
        ...rankings.map((d, i) => [
          i + 1, d.name, d.email, d.totalOrders, d.completedOrders,
          d.cancelledOrders, d.earnings, `${d.completionRate}%`,
          `${d.avgDeliveryTime} min`, d.rating
        ])
      ].map(row => row.join(',')).join('\n');
    } else if (activeReport === 'condominiums') {
      const stats = generateCondominiumStats();
      csv = [
        ['Condominium Statistics Report', `${dateRange.start} to ${dateRange.end}`],
        [],
        ['Name', 'Address', 'Total Orders', 'Completed Orders', 'Revenue', 'Departments', 'Residents', 'Avg Order Value'],
        ...stats.map(c => [
          c.name, c.address, c.totalOrders, c.completedOrders,
          c.revenue, c.departments, c.residents, c.avgOrderValue
        ])
      ].map(row => row.join(',')).join('\n');
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const ordersReport = generateOrdersReport();
  const delivererRankings = generateDelivererRankings();
  const condominiumStats = generateCondominiumStats();

  // Chart data for orders report
  const orderChartData = {
    labels: Object.keys(ordersReport.byDay).slice(-7),
    datasets: [{
      label: 'Orders per Day',
      data: Object.values(ordersReport.byDay).slice(-7),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    }]
  };

  const statusChartData = {
    labels: ['Completed', 'Pending', 'Active', 'Cancelled'],
    datasets: [{
      data: [
        ordersReport.byStatus.completed,
        ordersReport.byStatus.pending,
        ordersReport.byStatus.accepted + ordersReport.byStatus.inProgress,
        ordersReport.byStatus.cancelled
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ]
    }]
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-2">Generate detailed reports and insights</p>
            </div>
          </div>
        </div>

        {/* Date Range and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condominium
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCondominium}
                onChange={(e) => setSelectedCondominium(e.target.value)}
              >
                <option value="">All Condominiums</option>
                {condominiums?.results?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => exportToCSV(null, activeReport)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <FaFileCsv className="mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveReport('orders')}
                className={`px-6 py-3 font-medium ${
                  activeReport === 'orders'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaChartBar className="inline mr-2" />
                Orders Report
              </button>
              <button
                onClick={() => setActiveReport('deliverers')}
                className={`px-6 py-3 font-medium ${
                  activeReport === 'deliverers'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaTrophy className="inline mr-2" />
                Deliverer Rankings
              </button>
              <button
                onClick={() => setActiveReport('condominiums')}
                className={`px-6 py-3 font-medium ${
                  activeReport === 'condominiums'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaBuilding className="inline mr-2" />
                Condominium Statistics
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div className="p-6">
            {activeReport === 'orders' && (
              <div>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{ordersReport.summary.total}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{ordersReport.summary.completed}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Cancelled</p>
                    <p className="text-2xl font-bold text-red-600">{ordersReport.summary.cancelled}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(ordersReport.summary.revenue)}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Avg Value</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(ordersReport.summary.avgValue)}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Completion</p>
                    <p className="text-2xl font-bold text-yellow-600">{ordersReport.summary.completionRate}%</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Orders Trend</h3>
                    <div style={{ position: 'relative', height: '250px' }}>
                      <Line
                        key={`orders-trend-${dateRange.start}-${dateRange.end}`}
                        data={orderChartData}
                        options={{ responsive: true, maintainAspectRatio: false }}
                      />
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Status Distribution</h3>
                    <div style={{ position: 'relative', height: '250px' }}>
                      <Pie
                        key={`status-dist-${dateRange.start}-${dateRange.end}`}
                        data={statusChartData}
                        options={{ responsive: true, maintainAspectRatio: false }}
                      />
                    </div>
                  </div>
                </div>

                {/* Details Table */}
                <h3 className="font-semibold mb-3">Order Details</h3>
                <DataTable
                  columns={[
                    { name: 'ID', selector: row => row.id, sortable: true, width: '70px' },
                    { name: 'Date', selector: row => row.date, sortable: true, width: '120px' },
                    { name: 'Customer', selector: row => row.customer, sortable: true },
                    { name: 'Deliverer', selector: row => row.deliverer, sortable: true },
                    { name: 'Amount', selector: row => formatCurrency(row.amount), sortable: true, width: '100px' },
                    { name: 'Status', selector: row => row.status, sortable: true, width: '100px' },
                    { name: 'Condominium', selector: row => row.condominium, sortable: true }
                  ]}
                  data={ordersReport.details}
                  pagination
                  paginationPerPage={10}
                  highlightOnHover
                />
              </div>
            )}

            {activeReport === 'deliverers' && (
              <div>
                <h3 className="font-semibold mb-3">Top Deliverers</h3>
                <DataTable
                  columns={[
                    { name: 'Rank', selector: (row, index) => index + 1, width: '70px' },
                    { name: 'Name', selector: row => row.name, sortable: true },
                    { name: 'Total Orders', selector: row => row.totalOrders, sortable: true, width: '120px' },
                    { name: 'Completed', selector: row => row.completedOrders, sortable: true, width: '100px' },
                    { name: 'Earnings', selector: row => formatCurrency(row.earnings), sortable: true, width: '100px' },
                    {
                      name: 'Completion Rate',
                      selector: row => `${row.completionRate}%`,
                      sortable: true,
                      width: '130px',
                      cell: row => (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${row.completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm">{row.completionRate}%</span>
                        </div>
                      )
                    },
                    { name: 'Avg Time', selector: row => `${row.avgDeliveryTime} min`, sortable: true, width: '100px' },
                    {
                      name: 'Rating',
                      selector: row => row.rating,
                      sortable: true,
                      width: '100px',
                      cell: row => (
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{row.rating.toFixed(1)}</span>
                        </div>
                      )
                    }
                  ]}
                  data={delivererRankings}
                  pagination
                  paginationPerPage={20}
                  highlightOnHover
                />
              </div>
            )}

            {activeReport === 'condominiums' && (
              <div>
                <h3 className="font-semibold mb-3">Condominium Performance</h3>
                <DataTable
                  columns={[
                    { name: 'Condominium', selector: row => row.name, sortable: true },
                    { name: 'Total Orders', selector: row => row.totalOrders, sortable: true, width: '120px' },
                    { name: 'Completed', selector: row => row.completedOrders, sortable: true, width: '100px' },
                    { name: 'Revenue', selector: row => formatCurrency(row.revenue), sortable: true, width: '120px' },
                    { name: 'Departments', selector: row => row.departments, sortable: true, width: '100px' },
                    { name: 'Residents', selector: row => row.residents, sortable: true, width: '100px' },
                    { name: 'Avg Order', selector: row => formatCurrency(row.avgOrderValue), sortable: true, width: '100px' }
                  ]}
                  data={condominiumStats}
                  pagination
                  paginationPerPage={20}
                  highlightOnHover
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
