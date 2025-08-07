'use client';

import { FaTruck, FaClock, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

export default function QuickStats({ stats }) {
  const statCards = [
    {
      title: "Today's Deliveries",
      value: stats.todayDeliveries,
      icon: FaTruck,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Active Deliveries',
      value: stats.activeDeliveries,
      icon: FaClock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      iconColor: 'text-yellow-500'
    },
    {
      title: 'Completed',
      value: stats.completedDeliveries,
      icon: FaCheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      iconColor: 'text-green-500'
    },
    {
      title: 'Available Orders',
      value: stats.availableOrders,
      icon: FaMapMarkerAlt,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      iconColor: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`${stat.iconColor} text-xl`} />
            </div>
            {stat.value > 0 && stat.title.includes('Available') && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                New
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-xs text-gray-600 mt-1">{stat.title}</p>
        </div>
      ))}
    </div>
  );
}