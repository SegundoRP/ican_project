'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';
import { useCondominiums, useDepartments } from '@/hooks/use-condominiums';
import RoleSelector from '@/components/profile/RoleSelector';
import CondominiumSelector from '@/components/profile/CondominiumSelector';
import DepartmentSelector from '@/components/profile/DepartmentSelector';
import { Spinner } from '@/components/common';
import { useForm } from 'react-hook-form';

export default function RegisterForm({ dictionary }) {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const { register: formRegister, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      re_password: '',
      role: 'RECEIVER',
      condominium: '',
      department: ''
    }
  });

  const [selectedCondominium, setSelectedCondominium] = useState(null);

  // Queries for condominiums and departments
  const { data: condominiums, isLoading: loadingCondominiums } = useCondominiums();
  const { data: departments, isLoading: loadingDepartments } = useDepartments(selectedCondominium);

  // Watch for condominium changes
  const condominiumId = watch('condominium');
  const currentRole = watch('role');

  useEffect(() => {
    if (condominiumId) {
      setSelectedCondominium(condominiumId);
      // Reset department when condominium changes
      setValue('department', '');
    }
  }, [condominiumId, setValue]);

  const onSubmit = async (data) => {
    // Validate passwords match
    if (data.password !== data.re_password) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // Prepare registration data
      const registrationData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        re_password: data.re_password,
        role: data.role,
        department: data.department ? parseInt(data.department) : null
      };

      await register(registrationData).unwrap();
      toast.success('Please check your email to verify your account');
      router.push('/auth/login');
    } catch (error) {
      console.error(error);
      const errorMessage = error?.data?.detail ||
                          error?.data?.email?.[0] ||
                          error?.data?.password?.[0] ||
                          'Failed to register account';
      toast.error(errorMessage);
    }
  };

  const dictionaryRegister = dictionary;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              {dictionaryRegister.Form.Name}
            </label>
            <input
              type="text"
              id="first_name"
              {...formRegister('first_name', {
                required: 'First name is required',
                minLength: { value: 2, message: 'First name must be at least 2 characters' }
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              {dictionaryRegister.Form.LastName}
            </label>
            <input
              type="text"
              id="last_name"
              {...formRegister('last_name', {
                required: 'Last name is required',
                minLength: { value: 2, message: 'Last name must be at least 2 characters' }
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {dictionaryRegister.Form.Email}
          </label>
          <input
            type="email"
            id="email"
            {...formRegister('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Password Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Security</h3>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {dictionaryRegister.Form.Password}
          </label>
          <input
            type="password"
            id="password"
            {...formRegister('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="re_password" className="block text-sm font-medium text-gray-700">
            {dictionaryRegister.Form.ConfirmPassword}
          </label>
          <input
            type="password"
            id="re_password"
            {...formRegister('re_password', {
              required: 'Please confirm your password',
              validate: (value, formValues) =>
                value === formValues.password || 'Passwords do not match'
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.re_password && (
            <p className="text-red-500 text-xs mt-1">{errors.re_password.message}</p>
          )}
        </div>
      </div>

      {/* Role Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Your Role</h3>
        <RoleSelector
          register={formRegister}
          currentRole={currentRole}
          errors={errors}
        />
      </div>

      {/* Location Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Your Location</h3>

        <CondominiumSelector
          register={formRegister}
          condominiums={condominiums}
          loading={loadingCondominiums}
          errors={errors}
          required={true}
        />

        {selectedCondominium && (
          <DepartmentSelector
            register={formRegister}
            departments={departments}
            loading={loadingDepartments}
            errors={errors}
            required={true}
          />
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? <Spinner sm /> : dictionaryRegister.Form.Button}
        </button>
      </div>

      {/* Terms and Privacy Notice */}
      <p className="text-xs text-gray-500 text-center">
        By registering, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}
