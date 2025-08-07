'use client';

import { useRouter } from 'next/navigation';
import { FaClock, FaMapMarkerAlt, FaUser, FaArrowRight, FaTruck } from 'react-icons/fa';
import { formatDate, getOrderStatusDisplayName, getOrderStatusColor } from '@/utils/permissions';

export default function ActiveDeliveriesCard({ deliveries }) {
  const router = useRouter();

  if (deliveries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Deliveries</h2>
        <div className="text-center py-8">
          <FaTruck className="text-gray-300 text-4xl mx-auto mb-3" />
          <p className="text-gray-500">No active deliveries</p>
          <button
            onClick={() => router.push('/dashboard/available-orders')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Available Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Active Deliveries</h2>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {deliveries.length} active
          </span>
        </div>

        <div className="space-y-4">
          {deliveries.slice(0, 3).map((delivery) => (
            <div
              key={delivery.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
              onClick={() => router.push(`/dashboard/orders/${delivery.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">Order #{delivery.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(delivery.status)}`}>
                      {getOrderStatusDisplayName(delivery.status)}
                    </span>
                    {delivery.is_immediate && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                        Immediate
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaUser className="mr-2 text-gray-400" />
                      <span>{delivery.receiver_name || 'Customer'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-gray-400" />
                      <span>{formatDate(delivery.scheduled_date, true)}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-400" />
                      <span>Tower {delivery.receiver_department?.tower || 'N/A'}, Floor {delivery.receiver_department?.floor || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-green-600">${delivery.amount}</span>
                    </div>
                  </div>

                  {delivery.delivery_notes && (
                    <p className="mt-2 text-sm text-gray-500 italic">
                      &quot;{delivery.delivery_notes}&quot;
                    </p>
                  )}
                </div>

                <FaArrowRight className="text-gray-400 ml-4 mt-2" />
              </div>
            </div>
          ))}
        </div>

        {deliveries.length > 3 && (
          <button
            onClick={() => router.push('/dashboard/deliverer/active')}
            className="mt-4 w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all {deliveries.length} active deliveries →
          </button>
        )}
      </div>
    </div>
  );
}