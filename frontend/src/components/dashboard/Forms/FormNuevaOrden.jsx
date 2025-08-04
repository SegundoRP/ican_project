'use client';

import { useForm } from "react-hook-form";
import { useCreateOrder } from "@/hooks/use-orders";
import { useServiceTypes } from "@/hooks/use-services";
import { useCondominiums } from "@/hooks/use-condominiums";

export default function FormNuevaOrden({ dict, onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  // Queries
  const { data: serviceTypes, isLoading: loadingServiceTypes } = useServiceTypes();
  const { data: condominiums, isLoading: loadingCondominiums } = useCondominiums();

  // Mutation
  const createOrderMutation = useCreateOrder();

  const onSubmit = async (data) => {
    try {
      // Format data for API
      const orderData = {
        service_type: parseInt(data.serviceType),
        scheduled_date: `${data.scheduledDate}T${data.scheduledTime || '12:00'}:00Z`,
        is_immediate: data.isImmediate || false,
        delivery_notes: data.deliveryNotes || '',
        amount: parseFloat(data.amount),
        // Department will be handled by the receiver's profile
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

  // Check if immediate delivery checkbox is checked
  const isImmediate = watch("isImmediate");

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

      {/* Condominium Info (Read-only - from user profile) */}
      <div className="grid">
        <label htmlFor="condominium">{dict.TablesOrders.Form.Building}</label>
        <select
          className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
          id="condominium"
          {...register("condominium")}
          disabled={loadingCondominiums}
        >
          <option value="">Select condominium</option>
          {condominiums?.map((condo) => (
            <option key={condo.id} value={condo.id}>
              {condo.name} - {condo.address}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Note: Orders will be delivered to your registered department
        </p>
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
          className="bg-blue-600 p-3 rounded-lg text-white text-sm font-semibold disabled:bg-gray-400"
          type="submit"
          disabled={createOrderMutation.isLoading}
        >
          {createOrderMutation.isLoading ? 'Creating...' : dict.TablesOrders.Form.Button}
        </button>
      </div>
    </form>
  );
}
