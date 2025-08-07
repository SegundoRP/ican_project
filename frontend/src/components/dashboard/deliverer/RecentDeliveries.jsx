'use client';

import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { formatDate, formatCurrency } from '@/utils/permissions';

export default function RecentDeliveries({ deliveries }) {
  const router = useRouter();

  const getStatusIcon = (status) => {
    switch(status) {
      case 6: // COMPLETED
        return <FaCheckCircle className="text-green-500" />;
      case 7: // CANCELLED
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 1: return 'Pending';
      case 4: return 'Accepted';
      case 5: return 'In Progress';
      case 6: return 'Completed';
      case 7: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  if (deliveries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Deliveries</h2>
        <div className="text-center py-8">
          <FaClock className="text-gray-300 text-4xl mx-auto mb-3" />
          <p className="text-gray-500">No deliveries yet</p>
          <p className="text-sm text-gray-400 mt-1">Your delivery history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Deliveries</h2>
          <button
            onClick={() => router.push('/dashboard/deliverer/history')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="pb-3">Status</th>
                <th className="pb-3">Order</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deliveries.map((delivery) => (
                <tr
                  key={delivery.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/dashboard/orders/${delivery.id}`)}
                >
                  <td className="py-3">
                    <div className="flex items-center">
                      {getStatusIcon(delivery.status)}
                      <span className="ml-2 text-sm text-gray-600">
                        {getStatusText(delivery.status)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm font-medium text-gray-900">
                      #{delivery.id}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-600">
                      {delivery.receiver_name || 'Customer'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-600">
                      {formatDate(delivery.created_at)}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(delivery.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
