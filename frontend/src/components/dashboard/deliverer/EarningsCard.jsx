'use client';

import { FaDollarSign, FaArrowUp } from 'react-icons/fa';
import { formatCurrency } from '@/utils/permissions';

export default function EarningsCard({ earnings }) {
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Earnings Overview</h2>
          <FaDollarSign className="text-green-500 text-2xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Today's Earnings */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Today</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(earnings.todayEarnings)}
            </p>
            <div className="flex items-center mt-2">
              {earnings.todayEarnings > 0 ? (
                <>
                  <FaArrowUp className="text-green-500 text-sm mr-1" />
                  <span className="text-green-600 text-sm">Active</span>
                </>
              ) : (
                <span className="text-gray-500 text-sm">No earnings yet</span>
              )}
            </div>
          </div>

          {/* Weekly Earnings */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">This Week</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(earnings.weeklyEarnings)}
            </p>
            <div className="flex items-center mt-2">
              <span className="text-gray-500 text-sm">
                {earnings.weeklyEarnings > earnings.todayEarnings ? 'Good week' : 'Keep going'}
              </span>
            </div>
          </div>

          {/* Monthly Earnings */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(earnings.monthlyEarnings)}
            </p>
            <div className="flex items-center mt-2">
              <span className="text-gray-500 text-sm">
                {new Date().getDate()} days
              </span>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-700 mb-1">Total Earnings</p>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(earnings.totalEarnings)}
            </p>
            <div className="flex items-center mt-2">
              <FaArrowUp className="text-green-500 text-sm mr-1" />
              <span className="text-green-600 text-sm">All time</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Monthly Goal Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(earnings.monthlyEarnings)} / {formatCurrency(500)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((earnings.monthlyEarnings / 500) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {earnings.monthlyEarnings >= 500
              ? '🎉 Goal achieved!'
              : `${formatCurrency(500 - earnings.monthlyEarnings)} to reach your goal`}
          </p>
        </div>
      </div>
    </div>
  );
}
