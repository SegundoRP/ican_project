'use client';

import { useRouter } from 'next/navigation';
import usePermissions from '@/hooks/use-permissions';
import { useCurrentUser, useEarningsSummary, useToggleAvailability } from '@/hooks/use-users';
import { useMyDeliveries, useAvailableOrders } from '@/hooks/use-orders';
import { Spinner } from '@/components/common';
import EarningsCard from '@/components/dashboard/deliverer/EarningsCard';
import AvailabilityToggle from '@/components/dashboard/deliverer/AvailabilityToggle';
import ActiveDeliveriesCard from '@/components/dashboard/deliverer/ActiveDeliveriesCard';
import QuickStats from '@/components/dashboard/deliverer/QuickStats';
import RecentDeliveries from '@/components/dashboard/deliverer/RecentDeliveries';
import {
  FaExclamationTriangle, FaTruck, FaDollarSign,
  FaChartLine, FaClock, FaMapMarkerAlt
} from 'react-icons/fa';

export default function DelivererDashboardClient({ dictionary }) {
  const router = useRouter();
  const { canDeliver, isAvailable } = usePermissions();
  const { data: currentUser, isLoading: loadingUser } = useCurrentUser();
  const { data: earnings, isLoading: loadingEarnings } = useEarningsSummary();
  const { data: myDeliveries, isLoading: loadingDeliveries } = useMyDeliveries();
  const { data: availableOrders } = useAvailableOrders({ status: 1 });
  const toggleAvailabilityMutation = useToggleAvailability();

  // Check permissions
  if (!loadingUser && !canDeliver) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">
            You need to have a deliverer role to access this page.
          </p>
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      </div>
    );
  }

  if (loadingUser || loadingEarnings || loadingDeliveries) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    todayDeliveries: myDeliveries?.results?.filter(d => {
      const today = new Date().toDateString();
      return new Date(d.created_at).toDateString() === today;
    }).length || 0,
    activeDeliveries: myDeliveries?.results?.filter(d =>
      d.status === 4 || d.status === 5 // ACCEPTED or IN_PROGRESS
    ).length || 0,
    completedDeliveries: myDeliveries?.results?.filter(d =>
      d.status === 6 // COMPLETED
    ).length || 0,
    availableOrders: availableOrders?.count || 0,
    todayEarnings: earnings?.today_earnings || 0,
    weeklyEarnings: earnings?.weekly_earnings || 0,
    monthlyEarnings: earnings?.monthly_earnings || 0,
    totalEarnings: earnings?.total_earnings || 0,
    averageRating: currentUser?.rating || 0,
    totalReviews: currentUser?.total_reviews || 0
  };

  const handleToggleAvailability = async () => {
    try {
      await toggleAvailabilityMutation.mutateAsync('me');
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Deliverer Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {currentUser?.first_name}! Manage your deliveries and earnings.
              </p>
            </div>
            <AvailabilityToggle
              isAvailable={isAvailable}
              onToggle={handleToggleAvailability}
              isLoading={toggleAvailabilityMutation.isLoading}
            />
          </div>
        </div>

        {/* Alert if not available */}
        {!isAvailable && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-800 font-medium">You are currently unavailable</p>
                <p className="text-yellow-700 text-sm">
                  Toggle your availability to start receiving new orders
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <QuickStats stats={stats} />

            {/* Earnings Overview */}
            <EarningsCard earnings={stats} />

            {/* Active Deliveries */}
            <ActiveDeliveriesCard
              deliveries={myDeliveries?.results?.filter(d =>
                d.status === 4 || d.status === 5
              ) || []}
            />

            {/* Recent Deliveries */}
            <RecentDeliveries
              deliveries={myDeliveries?.results?.slice(0, 5) || []}
            />
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard/available-orders')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                >
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-3" />
                    <span>View Available Orders</span>
                  </div>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                    {stats.availableOrders}
                  </span>
                </button>

                <button
                  onClick={() => router.push('/dashboard/deliverer/active')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                >
                  <div className="flex items-center">
                    <FaTruck className="mr-3" />
                    <span>Active Deliveries</span>
                  </div>
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                    {stats.activeDeliveries}
                  </span>
                </button>

                <button
                  onClick={() => router.push('/dashboard/deliverer/earnings')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
                >
                  <div className="flex items-center">
                    <FaDollarSign className="mr-3" />
                    <span>Earnings Details</span>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard/deliverer/history')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center">
                    <FaChartLine className="mr-3" />
                    <span>Delivery History</span>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard/deliverer/availability')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition"
                >
                  <div className="flex items-center">
                    <FaClock className="mr-3" />
                    <span>Availability Settings</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <span className="font-semibold mr-1">{stats.averageRating.toFixed(1)}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(stats.averageRating / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on {stats.totalReviews} reviews
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-semibold">
                      {stats.completedDeliveries > 0
                        ? `${Math.round((stats.completedDeliveries / (stats.completedDeliveries + stats.activeDeliveries)) * 100)}%`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: stats.completedDeliveries > 0
                          ? `${(stats.completedDeliveries / (stats.completedDeliveries + stats.activeDeliveries)) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Deliveries</span>
                    <span className="font-semibold">{myDeliveries?.count || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Stay available during peak hours for more orders</li>
                <li>• Complete deliveries quickly to improve your rating</li>
                <li>• Check for immediate orders for higher earnings</li>
                <li>• Communicate with customers for better reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
