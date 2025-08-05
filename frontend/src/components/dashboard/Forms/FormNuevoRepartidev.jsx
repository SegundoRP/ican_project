'use client';

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useChangeUserRole, useUpdateCurrentUser, useCurrentUser } from "@/hooks/use-users";
import { useCondominiums, useDepartments } from "@/hooks/use-condominiums";
import { toast } from "react-toastify";

export default function FormNuevoRepartidev({ dictionary, onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
  const [selectedCondominium, setSelectedCondominium] = useState(null);

  // Queries
  const { data: currentUser, isLoading: loadingUser } = useCurrentUser();
  const { data: condominiums, isLoading: loadingCondominiums } = useCondominiums();
  const { data: departments, isLoading: loadingDepartments } = useDepartments(selectedCondominium);

  // Mutations
  const changeRoleMutation = useChangeUserRole();
  const updateUserMutation = useUpdateCurrentUser();

  // Watch condominium selection to load departments
  const condominiumId = watch("condominium");

  useEffect(() => {
    if (condominiumId) {
      setSelectedCondominium(condominiumId);
    }
  }, [condominiumId]);

  // Pre-fill form with current user data
  useEffect(() => {
    if (currentUser) {
      setValue("phone", currentUser.phone || '');
      if (currentUser.department) {
        setValue("condominium", currentUser.department.condominium);
        setSelectedCondominium(currentUser.department.condominium);
        setValue("department", currentUser.department.id);
      }
    }
  }, [currentUser, setValue]);

  const onSubmit = async (data) => {
    try {
      // First, update user profile with department info if needed
      const profileData = {
        phone: data.phone,
        department: parseInt(data.department),
      };

      await updateUserMutation.mutateAsync(profileData);

      // Then change role to include deliverer
      let newRole;
      if (currentUser?.role === 'RECEIVER') {
        newRole = 'RECEIVER_AND_DELIVERER';
      } else {
        newRole = 'DELIVERER';
      }

      await changeRoleMutation.mutateAsync({
        id: 'me',
        role: newRole
      });

      toast.success('You are now registered as a Repartidev!');

      // Reset form on success
      reset();

      // Call parent callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error handling is done globally
      console.error('Error updating profile:', error);
    }
  };

  // Check if user is already a deliverer
  const isAlreadyDeliverer = currentUser?.role === 'DELIVERER' ||
                            currentUser?.role === 'RECEIVER_AND_DELIVERER';

  if (isAlreadyDeliverer) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-green-800 font-semibold mb-2">
          You are already registered as a Repartidev!
        </h3>
        <p className="text-green-600 text-sm">
          You can start accepting delivery orders from your neighbors.
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid p-1 space-y-5 text-sm font-medium text-gray-900"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          Become a Repartidev and help your neighbors by delivering their orders!
        </p>
      </div>

      {/* Phone */}
      <div className="grid">
        <label htmlFor="phone">{dictionary.Form.Phone}</label>
        <input
          className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
          type="tel"
          id="phone"
          placeholder="997514992"
          {...register("phone", {
            required: true,
            pattern: /^[0-9]{9}$/,
            maxLength: 9,
            minLength: 9
          })}
        />
        {errors.phone?.type === 'required' &&
          <span className="text-red-600 p-1 text-xs">{dictionary.Form.Errors.Required}</span>
        }
        {errors.phone?.type === 'pattern' &&
          <span className="text-red-600 p-1 text-xs">Invalid phone format</span>
        }
        {errors.phone?.type === 'maxLength' &&
          <span className="text-red-600 p-1 text-xs">{dictionary.Form.Errors.MaxLengthPhone}</span>
        }
        {errors.phone?.type === 'minLength' &&
          <span className="text-red-600 p-1 text-xs">{dictionary.Form.Errors.MinLengthPhone}</span>
        }
      </div>

      {/* Condominium */}
      <div className="grid">
        <label htmlFor="condominium">{dictionary.Form.Building}</label>
        <select
          className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
          id="condominium"
          {...register("condominium", { required: true })}
          disabled={loadingCondominiums}
        >
          <option value="">Select your condominium</option>
          {condominiums?.map((condo) => (
            <option key={condo.id} value={condo.id}>
              {condo.name} - {condo.address}
            </option>
          ))}
        </select>
        {errors.condominium?.type === 'required' &&
          <span className="text-red-600 p-1 text-xs">{dictionary.Form.Errors.Required}</span>
        }
      </div>

      {/* Department */}
      {selectedCondominium && (
        <div className="grid">
          <label htmlFor="department">Department</label>
          <select
            className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
            id="department"
            {...register("department", { required: true })}
            disabled={loadingDepartments}
          >
            <option value="">Select your department</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                Tower {dept.tower} - Floor {dept.floor} - {dept.name}
              </option>
            ))}
          </select>
          {errors.department?.type === 'required' &&
            <span className="text-red-600 p-1 text-xs">{dictionary.Form.Errors.Required}</span>
          }
        </div>
      )}

      {/* Availability Note */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          <strong>Note:</strong> After registration, you can manage your availability
          schedule in your profile settings.
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
          {dictionary.Form.TC.Accept}
          <a href="/terms" className="text-blue-600 ml-1">{dictionary.Form.TC.TC}</a>
        </label>
        {errors.terms?.type === 'required' &&
          <p className="text-red-600 p-1 text-xs">{dictionary.Form.Errors.AcceptTC}</p>
        }
      </div>

      {/* Submit Button */}
      <div>
        <button
          className="bg-blue-600 p-3 rounded-lg text-white text-sm font-semibold disabled:bg-gray-400"
          type="submit"
          disabled={changeRoleMutation.isLoading || updateUserMutation.isLoading}
        >
          {(changeRoleMutation.isLoading || updateUserMutation.isLoading)
            ? 'Processing...'
            : 'Become a Repartidev'
          }
        </button>
      </div>
    </form>
  );
}
