'use client';

import { FaCheckCircle, FaTimesCircle, FaClock, FaTruck, FaSpinner } from 'react-icons/fa';
import { formatDate } from '@/utils/permissions';

export default function OrderTimeline({ order }) {
  // Define timeline events based on order status
  const getTimelineEvents = () => {
    const events = [
      {
        id: 1,
        title: 'Order Created',
        description: `Order placed by ${order.receiver_name || order.receiver_email}`,
        timestamp: order.created_at,
        icon: FaCheckCircle,
        iconColor: 'text-green-500',
        completed: true
      }
    ];

    // Add assignment event if deliverer exists
    if (order.deliverer) {
      events.push({
        id: 2,
        title: 'Deliverer Assigned',
        description: `Assigned to ${order.deliverer_name || order.deliverer_email}`,
        timestamp: order.created_at, // This would ideally come from a separate field
        icon: FaTruck,
        iconColor: 'text-blue-500',
        completed: true
      });
    }

    // Add status-specific events
    if (order.status >= 4) { // ACCEPTED
      events.push({
        id: 3,
        title: 'Order Accepted',
        description: 'Deliverer accepted the order',
        timestamp: order.updated_at, // This would ideally come from status history
        icon: FaCheckCircle,
        iconColor: 'text-green-500',
        completed: true
      });
    }

    if (order.status === 5) { // IN_PROGRESS
      events.push({
        id: 4,
        title: 'In Progress',
        description: 'Deliverer is on the way',
        timestamp: order.updated_at,
        icon: FaSpinner,
        iconColor: 'text-yellow-500',
        completed: true
      });
    }

    if (order.status === 6) { // COMPLETED
      events.push({
        id: 5,
        title: 'Order Completed',
        description: 'Order delivered successfully',
        timestamp: order.updated_at,
        icon: FaCheckCircle,
        iconColor: 'text-green-500',
        completed: true
      });
    }

    if (order.status === 7) { // CANCELLED
      events.push({
        id: 6,
        title: 'Order Cancelled',
        description: 'Order was cancelled',
        timestamp: order.updated_at,
        icon: FaTimesCircle,
        iconColor: 'text-red-500',
        completed: true
      });
    }

    // Add future event (scheduled delivery)
    if (order.status < 6 && order.status !== 7) {
      events.push({
        id: 7,
        title: 'Scheduled Delivery',
        description: order.is_immediate ? 'Immediate delivery (within 30 minutes)' : 'Scheduled delivery time',
        timestamp: order.scheduled_date,
        icon: FaClock,
        iconColor: 'text-gray-400',
        completed: false
      });
    }

    return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const events = getTimelineEvents();

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      event.completed ? 'bg-white' : 'bg-gray-100'
                    }`}
                  >
                    <event.icon className={`h-5 w-5 ${event.iconColor}`} aria-hidden="true" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className={`text-sm ${event.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-500">{event.description}</p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {formatDate(event.timestamp, true)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
