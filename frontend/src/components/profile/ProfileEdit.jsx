'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useUpdateCurrentUser, useChangeUserRole, useToggleAvailability } from '@/hooks/use-users';
import { useCondominiums, useDepartments } from '@/hooks/use-condominiums';
import RoleSelector from './RoleSelector';
import CondominiumSelector from './CondominiumSelector';
import DepartmentSelector from './DepartmentSelector';
import { toast } from 'react-toastify';

export default function ProfileEdit({ user, onCancel, onSuccess, dictionary }) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
      role: user?.role || 'RECEIVER',
      condominium: user?.department?.condominium?.id || '',
      department: user?.department?.id || '',
      is_available_for_delivery: user?.is_available_for_delivery || false
    }
  });

  const [selectedCondominium, setSelectedCondominium] = useState(
    user?.department?.condominium?.id || null
  );

  // Mutations
  const updateUserMutation = useUpdateCurrentUser();
  const changeRoleMutation = useChangeUserRole();
  const toggleAvailabilityMutation = useToggleAvailability();

  // Queries
  const { data: condominiums, isLoading: loadingCondominiums } = useCondominiums();
  const { data: departments, isLoading: loadingDepartments } = useDepartments(selectedCondominium);

  // Watch for condominium changes
  const condominiumId = watch('condominium');
  const currentRole = watch('role');

  useEffect(() => {
    if (condominiumId) {
      setSelectedCondominium(condominiumId);
      // Reset department when condominium changes
      if (condominiumId !== user?.department?.condominium?.id) {
        setValue('department', '');
      }
    }
  }, [condominiumId, setValue, user]);

  const onSubmit = async (data) => {
    try {
      // Prepare update data
      const updateData = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        department: data.department ? parseInt(data.department) : null
      };

      // Update user profile
      await updateUserMutation.mutateAsync(updateData);

      // Update role if changed
      if (data.role !== user.role) {
        await changeRoleMutation.mutateAsync({
          id: 'me',
          role: data.role
        });
      }

      // Toggle availability if changed
      if ((user.role === 'DELIVERER' || user.role === 'RECEIVER_AND_DELIVERER') &&
          data.is_available_for_delivery !== user.is_available_for_delivery) {
        await toggleAvailabilityMutation.mutateAsync('me');
      }

      toast.success('Profile updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const isLoading = updateUserMutation.isLoading ||
                   changeRoleMutation.isLoading ||
                   toggleAvailabilityMutation.isLoading;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">{dictionary.EditButton}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              {...register('first_name', {
                required: 'First name is required',
                minLength: { value: 2, message: 'First name must be at least 2 characters' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              {...register('last_name', {
                required: 'Last name is required',
                minLength: { value: 2, message: 'Last name must be at least 2 characters' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone', {
              pattern: {
                value: /^[0-9]{9}$/,
                message: 'Phone must be 9 digits'
              }
            })}
            placeholder="999999999"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Role Selection */}
        <RoleSelector
          register={register}
          currentRole={currentRole}
          errors={errors}
        />

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Location</h3>

          <CondominiumSelector
            register={register}
            condominiums={condominiums}
            loading={loadingCondominiums}
            errors={errors}
            required={true}
          />

          {selectedCondominium && (
            <DepartmentSelector
              register={register}
              departments={departments}
              loading={loadingDepartments}
              errors={errors}
              required={true}
            />
          )}
        </div>

        {/* Availability Toggle (for deliverers) */}
        {(currentRole === 'DELIVERER' || currentRole === 'RECEIVER_AND_DELIVERER') && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
                  Available for Deliveries
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Toggle this to accept delivery requests
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="is_available"
                  {...register('is_available_for_delivery')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            {dictionary.CancelButton}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {isLoading ? 'Saving...' : dictionary.SaveButton}
          </button>
        </div>
      </form>
    </div>
  );
}
