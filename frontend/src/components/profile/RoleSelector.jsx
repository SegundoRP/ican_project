'use client';

import { FaUser, FaTruck, FaUsersCog } from 'react-icons/fa';

export default function RoleSelector({ register, currentRole, errors }) {
  const roles = [
    {
      value: 'RECEIVER',
      label: 'Receiver Only',
      description: 'Can create and receive orders',
      icon: <FaUser className="text-blue-500" />
    },
    {
      value: 'DELIVERER',
      label: 'Deliverer Only (Repartidev)',
      description: 'Can deliver orders for neighbors',
      icon: <FaTruck className="text-green-500" />
    },
    {
      value: 'RECEIVER_AND_DELIVERER',
      label: 'Both Receiver & Deliverer',
      description: 'Can create, receive and deliver orders',
      icon: <FaUsersCog className="text-purple-500" />
    }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Select Your Role
      </label>

      <div className="grid grid-cols-1 gap-3">
        {roles.map((role) => (
          <label
            key={role.value}
            className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
              currentRole === role.value
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              value={role.value}
              {...register('role', { required: 'Please select a role' })}
              className="sr-only"
            />

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 mt-1">
                {role.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className={`text-sm font-medium ${
                    currentRole === role.value ? 'text-indigo-900' : 'text-gray-900'
                  }`}>
                    {role.label}
                  </h4>
                  {currentRole === role.value && (
                    <span className="ml-2 px-2 py-1 text-xs bg-indigo-600 text-white rounded">
                      Current
                    </span>
                  )}
                </div>
                <p className={`mt-1 text-sm ${
                  currentRole === role.value ? 'text-indigo-700' : 'text-gray-500'
                }`}>
                  {role.description}
                </p>
              </div>

              {currentRole === role.value && (
                <div className="absolute top-4 right-4">
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </label>
        ))}
      </div>

      {errors.role && (
        <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
      )}

      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>Note:</strong> Changing your role affects what features you can access.
          Deliverers can earn money by helping neighbors with their orders.
        </p>
      </div>
    </div>
  );
}
