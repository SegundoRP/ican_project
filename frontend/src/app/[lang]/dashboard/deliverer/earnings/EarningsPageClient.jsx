'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEarningsSummary } from '@/hooks/use-users';
import { useMyDeliveries } from '@/hooks/use-orders';
import { Spinner } from '@/components/common';
import {
  FaArrowLeft, FaDollarSign, FaChartLine, FaCalendarAlt,
  FaDownload, FaTruck
} from 'react-icons/fa';
import { formatCurrency, formatDate } from '@/utils/permissions';
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
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
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

export default function EarningsPageClient({ dictionary }) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState('week'); // week, month, year, custom

  const { data: earnings, isLoading: loadingEarnings } = useEarningsSummary();
  const { data: deliveries, isLoading: loadingDeliveries } = useMyDeliveries();

  if (loadingEarnings || loadingDeliveries) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Filter completed deliveries for earnings
  const completedDeliveries = deliveries?.results?.filter(d => d.status === 6) || [];

  // Calculate earnings by date
  const getEarningsByDate = () => {
    const earningsByDate = {};
    completedDeliveries.forEach(delivery => {
      const date = new Date(delivery.updated_at).toLocaleDateString();
      if (!earningsByDate[date]) {
        earningsByDate[date] = 0;
      }
      earningsByDate[date] += parseFloat(delivery.amount);
    });
    return earningsByDate;
  };

  const earningsByDate = getEarningsByDate();

  // Prepare chart data
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString();
  }).reverse();

  const lineChartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Daily Earnings',
        data: last7Days.map(date => earningsByDate[date] || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Earnings by hour chart
  const getEarningsByHour = () => {
    const hours = Array(24).fill(0);
    completedDeliveries.forEach(delivery => {
      const hour = new Date(delivery.updated_at).getHours();
      hours[hour] += parseFloat(delivery.amount);
    });
    return hours;
  };

  const hourlyEarnings = getEarningsByHour();

  const barChartData = {
    labels: Array.from({length: 24}, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Earnings by Hour',
        data: hourlyEarnings,
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }
    ]
  };

  // Earnings breakdown
  const doughnutData = {
    labels: ['Completed Orders', 'Tips', 'Bonuses'],
    datasets: [
      {
        data: [
          earnings?.total_earnings || 0,
          earnings?.total_tips || 0,
          earnings?.total_bonuses || 0
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
              <p className="text-gray-600 mt-2">Track your earnings and performance</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <FaDownload className="mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <FaDollarSign className="text-green-500 text-2xl" />
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Today</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(earnings?.today_earnings || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Earnings of today</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <FaCalendarAlt className="text-blue-500 text-2xl" />
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Week</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(earnings?.weekly_earnings || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">This Week</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <FaChartLine className="text-purple-500 text-2xl" />
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(earnings?.monthly_earnings || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">This Month</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FaDollarSign className="text-white text-2xl" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded">All Time</span>
            </div>
            <p className="text-2xl font-bold">
              {formatCurrency(earnings?.total_earnings || 0)}
            </p>
            <p className="text-sm opacity-90 mt-1">Total Earnings</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Earnings Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Earnings Trend</h3>
            <div style={{ position: 'relative', height: '256px' }}>
              <Line
                key={`earnings-line-${dateRange}`}
                data={lineChartData}
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>

          {/* Hourly Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Earnings by Hour</h3>
            <div style={{ position: 'relative', height: '256px' }}>
              <Bar
                key={`earnings-bar-${dateRange}`}
                data={barChartData}
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Earnings</h3>
              <div className="flex items-center space-x-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {completedDeliveries.slice(0, 10).map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <span className="font-medium text-gray-900">#{delivery.id}</span>
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {formatDate(delivery.updated_at)}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {new Date(delivery.updated_at).toLocaleTimeString()}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {delivery.receiver_name || 'Customer'}
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-green-600">
                          {formatCurrency(delivery.amount)}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {completedDeliveries.length === 0 && (
              <div className="text-center py-8">
                <FaTruck className="text-gray-300 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">No earnings yet</p>
                <p className="text-sm text-gray-400 mt-1">Complete deliveries to see your earnings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
