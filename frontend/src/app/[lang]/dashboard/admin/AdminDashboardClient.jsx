'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUsers, FaBuilding, FaShoppingCart, FaMoneyBillWave,
  FaChartBar, FaTruck, FaClock, FaCheckCircle, FaTimesCircle,
  FaArrowUp, FaBell, FaCog
} from 'react-icons/fa';
import { formatCurrency, formatDate } from '@/utils/permissions';
import { useAllOrders, useOrdersStats } from '@/hooks/use-orders';
import { useAllUsers } from '@/hooks/use-users';
import { useCondominiums } from '@/hooks/use-condominiums';
import { Spinner } from '@/components/common';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboardClient({ dictionary }) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState('week');

  const { data: orders, isLoading: ordersLoading } = useAllOrders();
  const { data: users, isLoading: usersLoading } = useAllUsers();
  const { data: condominiums, isLoading: condominiumsLoading } = useCondominiums();
  const { data: stats, isLoading: statsLoading } = useOrdersStats();

  const isLoading = ordersLoading || usersLoading || condominiumsLoading || statsLoading;

  // Calculate key metrics
  const calculateMetrics = () => {
    if (!orders || !users) return null;

    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentOrders = orders.results?.filter(order => {
      const orderDate = new Date(order.created_at);
      if (dateRange === 'day') return orderDate.toDateString() === today.toDateString();
      if (dateRange === 'week') return orderDate >= weekAgo;
      if (dateRange === 'month') return orderDate >= monthAgo;
      return true;
    }) || [];

    const totalRevenue = recentOrders
      .filter(o => o.status === 6) // Completed
      .reduce((sum, o) => sum + parseFloat(o.amount), 0);

    const activeDeliverers = users.results?.filter(u =>
      u.role === 'Deliverer' || u.role === 'Both'
    ).filter(u => u.is_available).length || 0;

    const completionRate = recentOrders.length > 0
      ? (recentOrders.filter(o => o.status === 6).length / recentOrders.length) * 100
      : 0;

    const avgDeliveryTime = recentOrders
      .filter(o => o.status === 6 && o.completed_at)
      .map(o => {
        const created = new Date(o.created_at);
        const completed = new Date(o.completed_at);
        return (completed - created) / (1000 * 60); // minutes
      })
      .reduce((sum, time, _, arr) => sum + time / arr.length, 0);

    return {
      totalOrders: recentOrders.length,
      totalRevenue,
      activeUsers: users.results?.filter(u => u.is_active).length || 0,
      activeDeliverers,
      completionRate,
      avgDeliveryTime: avgDeliveryTime || 0,
      pendingOrders: recentOrders.filter(o => o.status === 1).length,
      activeOrders: recentOrders.filter(o => [4, 5].includes(o.status)).length,
      cancelledOrders: recentOrders.filter(o => o.status === 7).length
    };
  };

  const metrics = calculateMetrics();

  // Prepare chart data
  const prepareChartData = () => {
    if (!orders) return null;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const ordersByDay = last7Days.map((day, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return orders.results?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === date.toDateString();
      }).length || 0;
    });

    const revenueByDay = last7Days.map((day, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return orders.results?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === date.toDateString() && order.status === 6;
      }).reduce((sum, o) => sum + parseFloat(o.amount), 0) || 0;
    });

    return {
      lineChart: {
        labels: last7Days,
        datasets: [
          {
            label: 'Orders',
            data: ordersByDay,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            yAxisID: 'y'
          },
          {
            label: 'Revenue ($)',
            data: revenueByDay,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            yAxisID: 'y1'
          }
        ]
      },
      doughnutChart: {
        labels: ['Completed', 'Active', 'Pending', 'Cancelled'],
        datasets: [{
          data: [
            orders.results?.filter(o => o.status === 6).length || 0,
            orders.results?.filter(o => [4, 5].includes(o.status)).length || 0,
            orders.results?.filter(o => o.status === 1).length || 0,
            orders.results?.filter(o => o.status === 7).length || 0
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ]
        }]
      }
    };
  };

  const chartData = prepareChartData();

  // Recent activity
  const getRecentActivity = () => {
    if (!orders) return [];

    return orders.results
      ?.slice(0, 10)
      .map(order => ({
        id: order.id,
        type: 'order',
        message: `Order #${order.id} - ${getOrderStatusDisplayName(order.status)}`,
        time: order.created_at,
        status: order.status
      })) || [];
  };

  const recentActivity = getRecentActivity();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const getOrderStatusDisplayName = (status) => {
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">System overview and management</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard/admin/reports')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <FaChartBar className="mr-2" />
                Reports
              </button>
              <button
                onClick={() => router.push('/dashboard/admin/settings')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaCog className="mr-2" />
                Settings
              </button>
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="mt-4 flex space-x-2">
            {['day', 'week', 'month', 'all'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range === 'all' ? 'All Time' : `This ${range}`}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.totalOrders || 0}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <FaArrowUp className="mr-1" />
                  12% from last period
                </p>
              </div>
              <FaShoppingCart className="text-3xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics?.totalRevenue || 0)}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <FaArrowUp className="mr-1" />
                  8% from last period
                </p>
              </div>
              <FaMoneyBillWave className="text-3xl text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.activeUsers || 0}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {metrics?.activeDeliverers || 0} deliverers online
                </p>
              </div>
              <FaUsers className="text-3xl text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.completionRate?.toFixed(1) || 0}%
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Avg: {metrics?.avgDeliveryTime?.toFixed(0) || 0} min
                </p>
              </div>
              <FaCheckCircle className="text-3xl text-green-500" />
            </div>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-xl font-bold text-yellow-700">
                  {metrics?.pendingOrders || 0}
                </p>
              </div>
              <FaClock className="text-2xl text-yellow-600" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Active</p>
                <p className="text-xl font-bold text-blue-700">
                  {metrics?.activeOrders || 0}
                </p>
              </div>
              <FaTruck className="text-2xl text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Completed Today</p>
                <p className="text-xl font-bold text-green-700">
                  {orders?.results?.filter(o => {
                    const today = new Date().toDateString();
                    return o.status === 6 && new Date(o.completed_at).toDateString() === today;
                  }).length || 0}
                </p>
              </div>
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Cancelled</p>
                <p className="text-xl font-bold text-red-700">
                  {metrics?.cancelledOrders || 0}
                </p>
              </div>
              <FaTimesCircle className="text-2xl text-red-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Line Chart - Orders & Revenue Trend */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Orders & Revenue Trend
            </h2>
            {chartData && (
              <Line
                data={chartData.lineChart}
                options={{
                  responsive: true,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                }}
              />
            )}
          </div>

          {/* Doughnut Chart - Order Status Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Status Distribution
            </h2>
            {chartData && (
              <Doughnut
                data={chartData.doughnutChart}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push('/dashboard/admin/users')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <FaUsers className="text-2xl text-blue-600 mb-2" />
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-gray-500">{users?.results?.length || 0} users</p>
                </button>

                <button
                  onClick={() => router.push('/dashboard/admin/condominiums')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <FaBuilding className="text-2xl text-purple-600 mb-2" />
                  <p className="font-medium">Condominiums</p>
                  <p className="text-sm text-gray-500">{condominiums?.results?.length || 0} buildings</p>
                </button>

                <button
                  onClick={() => router.push('/dashboard/admin/services')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <FaTruck className="text-2xl text-green-600 mb-2" />
                  <p className="font-medium">Service Types</p>
                  <p className="text-sm text-gray-500">Manage services</p>
                </button>

                <button
                  onClick={() => router.push('/dashboard/admin/reports')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <FaChartBar className="text-2xl text-orange-600 mb-2" />
                  <p className="font-medium">View Reports</p>
                  <p className="text-sm text-gray-500">Analytics & exports</p>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.status === 6 ? 'bg-green-100' :
                      activity.status === 7 ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      <FaBell className={`text-sm ${
                        activity.status === 6 ? 'text-green-600' :
                        activity.status === 7 ? 'text-red-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.time, true)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
