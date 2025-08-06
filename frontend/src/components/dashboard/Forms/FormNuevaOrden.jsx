'use client';

import React from 'react';
import { useForm } from "react-hook-form";
import { useCreateOrder } from "@/hooks/use-orders";
import { useServiceTypes } from "@/hooks/use-services";
import { useCurrentUser } from "@/hooks/use-users";
import { FaInfoCircle } from 'react-icons/fa';

export default function FormNuevaOrden({ dict, onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();

  // Queries
  const { data: serviceTypes, isLoading: loadingServiceTypes } = useServiceTypes();
  const { data: currentUser, isLoading: loadingUser } = useCurrentUser();

  // Mutation
  const createOrderMutation = useCreateOrder();

  const onSubmit = async (data) => {
    try {
      // Format data for API
      const orderData = {
        scheduled_date: data.isImmediate
          ? new Date(Date.now() + 30 * 60000).toISOString() // 30 minutes from now
          : `${data.scheduledDate}T${data.scheduledTime || '12:00'}:00Z`,
        is_immediate: data.isImmediate || false,
        delivery_notes: data.deliveryNotes || '',
        amount: parseFloat(data.amount) || parseFloat(serviceTypes?.find(t => t.id === parseInt(data.serviceType))?.price || 0),
        // Note: service field is optional in the backend
        // The backend will handle receiver assignment from the authenticated user
      };

      await createOrderMutation.mutateAsync(orderData);

      // Reset form on success
      reset();

      // Call parent callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error handling is done globally
      console.error('Error creating order:', error);
    }
  };

  // Watch form values
  const isImmediate = watch("isImmediate");
  const selectedServiceType = watch("serviceType");

  // Auto-fill amount when service type is selected
  React.useEffect(() => {
    if (selectedServiceType) {
      const service = serviceTypes?.find(t => t.id === parseInt(selectedServiceType));
      if (service) {
        setValue('amount', service.price);
      }
    }
  }, [selectedServiceType, serviceTypes, setValue]);

  // Check if user has proper setup
  const canCreateOrder = currentUser?.department && currentUser?.department?.condominium;

  return (
    <form
      className="grid p-1 space-y-5 text-sm font-medium text-gray-900"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Service Type */}
      <div className="grid">
        <label htmlFor="serviceType">{dict.TablesOrders.Form.TypeOrder}</label>
        <select
          className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
          id="serviceType"
          {...register("serviceType", { required: true })}
          disabled={loadingServiceTypes}
        >
          <option value="">Select a service type</option>
          {serviceTypes?.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} - ${type.price}
            </option>
          ))}
        </select>
        {errors.serviceType?.type === 'required' &&
          <span className="text-red-600 p-1 text-xs">{dict.TablesOrders.Form.Errors.Required}</span>
        }
      </div>

      {/* Immediate Delivery Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isImmediate"
          className="rounded mr-2"
          {...register("isImmediate")}
        />
        <label htmlFor="isImmediate" className="text-sm">
          Immediate Delivery (within 30 minutes)
        </label>
      </div>

      {/* Scheduled Date and Time (only if not immediate) */}
      {!isImmediate && (
        <>
          <div className="grid">
            <label htmlFor="scheduledDate">{dict.TablesOrders.Form.Date}</label>
            <input
              className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
              type="date"
              id="scheduledDate"
              min={new Date().toISOString().split('T')[0]}
              {...register("scheduledDate", { required: !isImmediate })}
            />
            {errors.scheduledDate?.type === 'required' &&
              <span className="text-red-600 p-1 text-xs">{dict.TablesOrders.Form.Errors.Required}</span>
            }
          </div>

          <div className="grid">
            <label htmlFor="scheduledTime">Delivery Time</label>
            <input
              className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
              type="time"
              id="scheduledTime"
              {...register("scheduledTime", { required: !isImmediate })}
            />
            {errors.scheduledTime?.type === 'required' &&
              <span className="text-red-600 p-1 text-xs">{dict.TablesOrders.Form.Errors.Required}</span>
            }
          </div>
        </>
      )}

      {/* Amount */}
      <div className="grid">
        <label htmlFor="amount">Amount ($)</label>
        <input
          className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
          type="number"
          step="0.01"
          id="amount"
          placeholder="10.00"
          {...register("amount", {
            required: true,
            min: 0.01,
            pattern: /^\d+(\.\d{1,2})?$/
          })}
        />
        {errors.amount?.type === 'required' &&
          <span className="text-red-600 p-1 text-xs">{dict.TablesOrders.Form.Errors.Required}</span>
        }
        {errors.amount?.type === 'min' &&
          <span className="text-red-600 p-1 text-xs">Amount must be greater than 0</span>
        }
        {errors.amount?.type === 'pattern' &&
          <span className="text-red-600 p-1 text-xs">Invalid amount format</span>
        }
      </div>

      {/* Delivery Notes */}
      <div className="grid">
        <label htmlFor="deliveryNotes">Delivery Notes (Optional)</label>
        <textarea
          className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
          id="deliveryNotes"
          rows="3"
          placeholder="Special instructions for delivery..."
          {...register("deliveryNotes")}
        />
      </div>

      {/* Delivery Location Info */}
      <div className="grid p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <FaInfoCircle className="text-blue-600 mt-1" />
          <div>
            <p className="text-sm font-medium text-blue-900">Delivery Location</p>
            {currentUser?.department ? (
              <div className="text-sm text-blue-700 mt-1">
                <p><strong>Building:</strong> {currentUser.department.condominium?.name}</p>
                <p><strong>Department:</strong> Tower {currentUser.department.tower} - Floor {currentUser.department.floor} - {currentUser.department.name}</p>
              </div>
            ) : (
              <p className="text-sm text-red-600 mt-1">
                Please update your profile with your department information before creating orders.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div>
        <input
          className="rounded"
          type="checkbox"
          id="terms"
          {...register("terms", { required: true })}
        />
        <label className="text-sm ml-1" htmlFor="terms">
          {dict.TablesOrders.Form.TC.Accept}
          <a href="/terms" className="text-blue-600 ml-1">{dict.TablesOrders.Form.TC.TC}</a>
        </label>
        {errors.terms?.type === 'required' &&
          <p className="text-red-600 p-1 text-xs">{dict.TablesOrders.Form.Errors.AcceptTC}</p>
        }
      </div>

      {/* Submit Button */}
      <div>
        <button
          className="bg-blue-600 p-3 rounded-lg text-white text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          type="submit"
          disabled={createOrderMutation.isLoading || !canCreateOrder || loadingUser}
          title={!canCreateOrder ? "Please complete your profile first" : ""}
        >
          {createOrderMutation.isLoading ? 'Creating...' : dict.TablesOrders.Form.Button}
        </button>
        {!canCreateOrder && !loadingUser && (
          <p className="text-red-600 text-xs mt-2">
            Please complete your profile with department information before creating orders.
          </p>
        )}
      </div>
    </form>
  );
}
