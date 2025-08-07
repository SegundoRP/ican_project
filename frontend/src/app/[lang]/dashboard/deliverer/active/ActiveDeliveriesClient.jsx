'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyDeliveries, useCompleteOrder } from '@/hooks/use-orders';
import { Spinner } from '@/components/common';
import {
  FaArrowLeft, FaTruck, FaCheckCircle, FaClock, FaMapMarkerAlt,
  FaUser, FaPhone, FaStickyNote, FaSpinner, FaRoute
} from 'react-icons/fa';
import { formatDate, formatCurrency } from '@/utils/permissions';
import { toast } from 'react-toastify';

export default function ActiveDeliveriesClient({ dictionary }) {
  const router = useRouter();
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState({});
  const [showNotesModal, setShowNotesModal] = useState(false);

  const { data: deliveries, isLoading, refetch } = useMyDeliveries();
  const completeMutation = useCompleteOrder();

  // Filter only active deliveries (ACCEPTED or IN_PROGRESS)
  const activeDeliveries = deliveries?.results?.filter(d =>
    d.status === 4 || d.status === 5
  ) || [];

  const handleStartDelivery = async (orderId) => {
    // This would update status to IN_PROGRESS
    toast.info('Delivery started - navigate to customer location');
    // In a real app, this would update the order status to IN_PROGRESS
  };

  const handleCompleteDelivery = async (orderId) => {
    if (!window.confirm('Confirm delivery completion?')) return;

    try {
      await completeMutation.mutateAsync(orderId);
      toast.success('Delivery completed successfully!');
      refetch();
    } catch (error) {
      console.error('Error completing delivery:', error);
    }
  };

  const handleAddNote = (orderId) => {
    setSelectedDelivery(orderId);
    setShowNotesModal(true);
  };

  const saveDeliveryNote = () => {
    const note = deliveryNotes[selectedDelivery];
    if (note) {
      // In a real app, this would save the note to the backend
      toast.success('Delivery note added');
    }
    setShowNotesModal(false);
    setSelectedDelivery(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-gray-900">Active Deliveries</h1>
              <p className="text-gray-600 mt-2">
                Manage your current deliveries ({activeDeliveries.length} active)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {activeDeliveries.filter(d => d.status === 4).length} Accepted
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {activeDeliveries.filter(d => d.status === 5).length} In Progress
              </span>
            </div>
          </div>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaTruck className="text-gray-300 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Deliveries</h2>
            <p className="text-gray-600 mb-6">You do not have any active deliveries at the moment</p>
            <button
              onClick={() => router.push('/dashboard/available-orders')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Available Orders
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Card Header */}
                <div className={`p-4 ${delivery.status === 5 ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaTruck className={delivery.status === 5 ? 'text-blue-600' : 'text-yellow-600'} />
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{delivery.id}</h3>
                        <p className="text-sm text-gray-600">
                          {delivery.status === 5 ? 'In Progress' : 'Ready to Start'}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(delivery.amount)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Customer Info */}
                  <div className="mb-4 pb-4 border-b">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <FaUser className="mr-2 text-gray-400" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Name:</span> {delivery.receiver_name || 'Customer'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {delivery.receiver_email}
                      </p>
                      {delivery.receiver_phone && (
                        <p className="text-gray-600 flex items-center">
                          <FaPhone className="mr-2 text-gray-400" />
                          {delivery.receiver_phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div className="mb-4 pb-4 border-b">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-400" />
                      Delivery Location
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Building:</span>{' '}
                        {delivery.receiver_department?.condominium?.name || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Tower:</span> {delivery.receiver_department?.tower || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Floor:</span> {delivery.receiver_department?.floor || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Department:</span>{' '}
                        {delivery.receiver_department?.name || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="mb-4 pb-4 border-b">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <FaClock className="mr-2 text-gray-400" />
                      Time Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Scheduled:</span>{' '}
                        {formatDate(delivery.scheduled_date, true)}
                      </p>
                      {delivery.is_immediate && (
                        <p className="text-red-600 font-medium">⚡ Immediate Delivery Required</p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Notes */}
                  {delivery.delivery_notes && (
                    <div className="mb-4 pb-4 border-b">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <FaStickyNote className="mr-2 text-gray-400" />
                        Delivery Instructions
                      </h4>
                      <p className="text-sm text-gray-600 italic">&quot{delivery.delivery_notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {delivery.status === 4 ? (
                      // ACCEPTED - Show Start Delivery button
                      <button
                        onClick={() => handleStartDelivery(delivery.id)}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                      >
                        <FaRoute className="mr-2" />
                        Start Delivery
                      </button>
                    ) : (
                      // IN_PROGRESS - Show Complete button
                      <button
                        onClick={() => handleCompleteDelivery(delivery.id)}
                        disabled={completeMutation.isLoading}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center"
                      >
                        {completeMutation.isLoading ? (
                          <FaSpinner className="animate-spin mr-2" />
                        ) : (
                          <FaCheckCircle className="mr-2" />
                        )}
                        Complete Delivery
                      </button>
                    )}

                    <button
                      onClick={() => handleAddNote(delivery.id)}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                    >
                      <FaStickyNote className="mr-2" />
                      Add Delivery Note
                    </button>

                    <button
                      onClick={() => router.push(`/dashboard/orders/${delivery.id}`)}
                      className="w-full px-4 py-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Full Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivery Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add Delivery Note</h3>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Add notes about this delivery..."
              value={deliveryNotes[selectedDelivery] || ''}
              onChange={(e) => setDeliveryNotes({
                ...deliveryNotes,
                [selectedDelivery]: e.target.value
              })}
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveDeliveryNote}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
