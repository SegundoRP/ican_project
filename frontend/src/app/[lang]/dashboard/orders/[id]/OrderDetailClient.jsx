'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder, useAcceptOrder, useRejectOrder, useCompleteOrder, useCancelOrder } from '@/hooks/use-orders';
import usePermissions from '@/hooks/use-permissions';
import { Spinner } from '@/components/common';
import {
  FaArrowLeft, FaClock, FaDollarSign,
  FaUser, FaTruck, FaStickyNote, FaSpinner, FaExclamationTriangle
} from 'react-icons/fa';
import { formatDate, getOrderStatusColor, getOrderStatusDisplayName } from '@/utils/permissions';
import OrderTimeline from '@/components/dashboard/orders/OrderTimeline';
import { toast } from 'react-toastify';

export default function OrderDetailClient({ orderId, dictionary }) {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Permissions
  const { user, canCancelOrder } = usePermissions();

  // Queries
  const { data: order, isLoading, error, refetch } = useOrder(orderId);

  // Mutations
  const acceptMutation = useAcceptOrder();
  const rejectMutation = useRejectOrder();
  const completeMutation = useCompleteOrder();
  const cancelMutation = useCancelOrder();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you are looking for does not exist or you do not have permission to view it.</p>
          <button
            onClick={() => router.push('/dashboard/ordenes')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const isReceiver = order.receiver?.id === user?.id;
  const isDeliverer = order.deliverer?.id === user?.id;

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync(orderId);
      toast.success('Order accepted successfully');
      refetch();
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to reject this order? It will be reassigned to another deliverer.')) {
      try {
        await rejectMutation.mutateAsync(orderId);
        toast.info('Order rejected and reassigned');
        refetch();
      } catch (error) {
        console.error('Error rejecting order:', error);
      }
    }
  };

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(orderId);
      toast.success('Order marked as completed');
      refetch();
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(orderId);
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      refetch();
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/ordenes')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Back to Orders
          </button>

          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
              {getOrderStatusDisplayName(order.status)}
            </span>
            {order.is_immediate && (
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                Immediate
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order #{order.id}</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <FaClock className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Delivery</p>
                    <p className="font-medium">{formatDate(order.scheduled_date, true)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaDollarSign className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium text-lg">${order.amount}</p>
                  </div>
                </div>

                {order.service_info && (
                  <div className="flex items-start">
                    <FaTruck className="text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Service Type</p>
                      <p className="font-medium">{order.service_info.type_of_service}</p>
                    </div>
                  </div>
                )}

                {order.delivery_notes && (
                  <div className="flex items-start">
                    <FaStickyNote className="text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Delivery Notes</p>
                      <p className="text-gray-700">{order.delivery_notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Order Timeline</h3>
              <OrderTimeline order={order} />
            </div>

            {/* Action Buttons */}
            {isDeliverer && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>

                {order.status === 1 && ( // PENDING
                  <div className="flex space-x-4">
                    <button
                      onClick={handleAccept}
                      disabled={acceptMutation.isLoading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {acceptMutation.isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Accept Order'}
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={rejectMutation.isLoading}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {rejectMutation.isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Reject Order'}
                    </button>
                  </div>
                )}

                {order.status === 4 && ( // ACCEPTED
                  <button
                    onClick={handleComplete}
                    disabled={completeMutation.isLoading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {completeMutation.isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Mark as Completed'}
                  </button>
                )}
              </div>
            )}

            {isReceiver && canCancelOrder(order) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Participants</h3>

              {/* Receiver */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center mb-2">
                  <FaUser className="text-blue-500 mr-2" />
                  <span className="font-medium">Receiver</span>
                </div>
                <p className="text-gray-900">{order.receiver_name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{order.receiver_email}</p>
              </div>

              {/* Deliverer */}
              <div>
                <div className="flex items-center mb-2">
                  <FaTruck className="text-green-500 mr-2" />
                  <span className="font-medium">Deliverer</span>
                </div>
                {order.deliverer ? (
                  <>
                    <p className="text-gray-900">{order.deliverer_name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{order.deliverer_email}</p>
                  </>
                ) : (
                  <p className="text-gray-500 italic">Not assigned yet</p>
                )}
              </div>
            </div>

            {/* Order Metadata */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Order Details</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(order.created_at, true)}</p>
                </div>

                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(order.updated_at, true)}</p>
                </div>

                <div>
                  <p className="text-gray-500">Order ID</p>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded">{order.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {cancelMutation.isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
