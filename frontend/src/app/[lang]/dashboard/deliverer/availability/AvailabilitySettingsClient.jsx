'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser, useToggleAvailability } from '@/hooks/use-users';
import usePermissions from '@/hooks/use-permissions';
import { Spinner } from '@/components/common';
import {
  FaArrowLeft, FaClock, FaCalendarAlt, FaBell,
  FaPowerOff, FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function AvailabilitySettingsClient({ dictionary }) {
  const router = useRouter();
  const { isAvailable } = usePermissions();
  const { data: currentUser, isLoading } = useCurrentUser();
  const toggleAvailabilityMutation = useToggleAvailability();

  // Availability schedule state
  const [schedule, setSchedule] = useState({
    monday: { enabled: true, start: '09:00', end: '18:00' },
    tuesday: { enabled: true, start: '09:00', end: '18:00' },
    wednesday: { enabled: true, start: '09:00', end: '18:00' },
    thursday: { enabled: true, start: '09:00', end: '18:00' },
    friday: { enabled: true, start: '09:00', end: '18:00' },
    saturday: { enabled: true, start: '10:00', end: '16:00' },
    sunday: { enabled: false, start: '10:00', end: '16:00' }
  });

  const [preferences, setPreferences] = useState({
    maxOrdersPerDay: 10,
    maxActiveOrders: 3,
    immediateOrders: true,
    scheduledOrders: true,
    minOrderAmount: 5,
    maxDeliveryDistance: 5, // km
    breakTime: true,
    breakStart: '13:00',
    breakEnd: '14:00',
    notifications: {
      newOrders: true,
      orderReminders: true,
      earningsUpdates: true,
      systemAlerts: true
    }
  });

  const handleToggleAvailability = async () => {
    try {
      await toggleAvailabilityMutation.mutateAsync('me');
      toast.success(isAvailable ? 'You are now offline' : 'You are now available for deliveries');
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to the backend
    toast.success('Availability settings saved successfully');
  };

  const applyToAllDays = () => {
    const mondaySchedule = schedule.monday;
    const newSchedule = {};
    Object.keys(schedule).forEach(day => {
      newSchedule[day] = { ...mondaySchedule };
    });
    setSchedule(newSchedule);
    toast.info('Monday schedule applied to all days');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
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
              <h1 className="text-3xl font-bold text-gray-900">Availability Settings</h1>
              <p className="text-gray-600 mt-2">Manage when you are available for deliveries</p>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className={`mb-6 p-4 rounded-lg ${isAvailable ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaPowerOff className={`mr-3 text-2xl ${isAvailable ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-semibold text-gray-900">Current Status</p>
                <p className="text-sm text-gray-600">
                  {isAvailable ? 'You are currently available for deliveries' : 'You are currently offline'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleAvailability}
              disabled={toggleAvailabilityMutation.isLoading}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                isAvailable
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } disabled:bg-gray-400`}
            >
              {toggleAvailabilityMutation.isLoading ? (
                <span className="flex items-center">
                  <Spinner sm className="mr-2" />
                  Updating...
                </span>
              ) : (
                isAvailable ? 'Go Offline' : 'Go Online'
              )}
            </button>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FaCalendarAlt className="mr-2 text-gray-400" />
                Weekly Schedule
              </h2>
              <button
                onClick={applyToAllDays}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Apply Monday to all days
              </button>
            </div>

            <div className="space-y-3">
              {days.map(day => (
                <div key={day} className="flex items-center space-x-4 py-2 border-b last:border-0">
                  <input
                    type="checkbox"
                    checked={schedule[day].enabled}
                    onChange={(e) => handleScheduleChange(day, 'enabled', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="w-24 font-medium capitalize">{day}</span>
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="time"
                      value={schedule[day].start}
                      onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                      disabled={!schedule[day].enabled}
                      className="px-3 py-1 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={schedule[day].end}
                      onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                      disabled={!schedule[day].enabled}
                      className="px-3 py-1 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                  {!schedule[day].enabled && (
                    <span className="text-sm text-gray-500">Day off</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Preferences */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaClock className="mr-2 text-gray-400" />
              Delivery Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Orders Per Day
                </label>
                <input
                  type="number"
                  value={preferences.maxOrdersPerDay}
                  onChange={(e) => handlePreferenceChange('maxOrdersPerDay', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Active Orders
                </label>
                <input
                  type="number"
                  value={preferences.maxActiveOrders}
                  onChange={(e) => handlePreferenceChange('maxActiveOrders', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Order Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={preferences.minOrderAmount}
                  onChange={(e) => handlePreferenceChange('minOrderAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Delivery Distance (km)
                </label>
                <input
                  type="number"
                  value={preferences.maxDeliveryDistance}
                  onChange={(e) => handlePreferenceChange('maxDeliveryDistance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.immediateOrders}
                  onChange={(e) => handlePreferenceChange('immediateOrders', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-700">Accept immediate orders</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.scheduledOrders}
                  onChange={(e) => handlePreferenceChange('scheduledOrders', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-700">Accept scheduled orders</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.breakTime}
                  onChange={(e) => handlePreferenceChange('breakTime', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-700">Daily break time</span>
              </label>

              {preferences.breakTime && (
                <div className="ml-6 flex items-center space-x-2">
                  <input
                    type="time"
                    value={preferences.breakStart}
                    onChange={(e) => handlePreferenceChange('breakStart', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={preferences.breakEnd}
                    onChange={(e) => handlePreferenceChange('breakEnd', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaBell className="mr-2 text-gray-400" />
              Notification Preferences
            </h2>

            <div className="space-y-3">
              {Object.entries(preferences.notifications).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleNotificationChange(key, e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FaCheckCircle className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
