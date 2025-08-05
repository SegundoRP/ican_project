'use client';

import { useMyRequests, useMyDeliveries } from '@/hooks/use-orders';
import { useEarningsSummary } from '@/hooks/use-users';
import { FaShoppingCart, FaTruck, FaDollarSign, FaStar, FaChartLine } from 'react-icons/fa';

export default function ProfileStats({ user, dictionary }) {
  // Fetch statistics data
  const { data: myRequests } = useMyRequests();
  const { data: myDeliveries } = useMyDeliveries();
  const { data: earnings } = useEarningsSummary();

  // Calculate statistics
  const stats = {
    receiver: {
      totalOrders: myRequests?.count || 0,
      pendingOrders: myRequests?.results?.filter(o => o.status === 'PENDING').length || 0,
      completedOrders: myRequests?.results?.filter(o => o.status === 'COMPLETED').length || 0,
    },
    deliverer: {
      totalDeliveries: myDeliveries?.count || 0,
      activeDeliveries: myDeliveries?.results?.filter(o => o.status === 'IN_PROGRESS').length || 0,
      completedDeliveries: myDeliveries?.results?.filter(o => o.status === 'COMPLETED').length || 0,
      earnings: earnings?.total_earnings || 0,
      weeklyEarnings: earnings?.weekly_earnings || 0,
      monthlyEarnings: earnings?.monthly_earnings || 0,
    }
  };

  const isReceiver = user?.role === 'RECEIVER' || user?.role === 'RECEIVER_AND_DELIVERER';
  const isDeliverer = user?.role === 'DELIVERER' || user?.role === 'RECEIVER_AND_DELIVERER';

  return (
    <div className="space-y-6">
      {/* Receiver Statistics */}
      {isReceiver && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{dictionary.Stats.ReceiverStats}</h3>
            <FaShoppingCart className="text-blue-500" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">{dictionary.Stats.TotalOrders}</span>
              <span className="font-semibold text-gray-900">{stats.receiver.totalOrders}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">{dictionary.Stats.PendingOrders}</span>
              <span className="font-semibold text-yellow-600">{stats.receiver.pendingOrders}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">{dictionary.Stats.CompletedOrders}</span>
              <span className="font-semibold text-green-600">{stats.receiver.completedOrders}</span>
            </div>
          </div>
        </div>
      )}

      {/* Deliverer Statistics */}
      {isDeliverer && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{dictionary.Stats.DelivererStats}</h3>
            <FaTruck className="text-green-500" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">{dictionary.Stats.TotalDeliveries}</span>
              <span className="font-semibold text-gray-900">{stats.deliverer.totalDeliveries}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Active Deliveries</span>
              <span className="font-semibold text-blue-600">{stats.deliverer.activeDeliveries}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Completed Deliveries</span>
              <span className="font-semibold text-green-600">{stats.deliverer.completedDeliveries}</span>
            </div>

            {/* Earnings Section */}
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Earnings</h4>
                <FaDollarSign className="text-green-600" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">This Week</span>
                  <span className="font-bold text-green-600">
                    ${stats.deliverer.weeklyEarnings.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">This Month</span>
                  <span className="font-bold text-green-600">
                    ${stats.deliverer.monthlyEarnings.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs text-gray-600">Total Earnings</span>
                  <span className="font-bold text-green-700 text-lg">
                    ${stats.deliverer.earnings.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Section */}
      {user?.rating && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{dictionary.Stats.Rating}</h3>
            <FaStar className="text-yellow-500" />
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {user.rating.toFixed(1)}
            </div>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(user.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {user.total_reviews || 0} {dictionary.Stats.Reviews}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

        <div className="space-y-2">
          {isReceiver && (
            <a
              href="/dashboard/ordenes"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {dictionary.Actions.ViewOrders}
            </a>
          )}

          {isDeliverer && (
            <>
              <a
                href="/dashboard/deliveries"
                className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {dictionary.Actions.ViewDeliveries}
              </a>

              <a
                href="/dashboard/available-orders"
                className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Browse Available Orders
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
