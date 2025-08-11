'use client';

import { FaPowerOff, FaSpinner } from 'react-icons/fa';

export default function AvailabilityToggle({ isAvailable, onToggle, isLoading }) {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-600">Availability</span>
      <button
        onClick={onToggle}
        disabled={isLoading}
        className={`
          relative inline-flex h-12 w-24 items-center rounded-full transition-colors
          ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}
          ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform
            ${isAvailable ? 'translate-x-12' : 'translate-x-1'}
          `}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin h-full w-full p-2 text-gray-500" />
          ) : (
            <FaPowerOff className={`h-full w-full p-2 ${isAvailable ? 'text-green-500' : 'text-gray-400'}`} />
          )}
        </span>
        <span className="absolute left-2 text-xs font-medium text-white">
          {isAvailable ? 'ON' : ''}
        </span>
        <span className="absolute right-2 text-xs font-medium text-white">
          {!isAvailable ? 'OFF' : ''}
        </span>
      </button>
      <div className="text-sm">
        {isAvailable ? (
          <span className="text-green-600 font-medium">Receiving orders</span>
        ) : (
          <span className="text-gray-500">Not receiving orders</span>
        )}
      </div>
    </div>
  );
}
