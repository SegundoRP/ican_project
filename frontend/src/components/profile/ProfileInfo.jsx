'use client';

import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaUserTag, FaCalendar } from 'react-icons/fa';

export default function ProfileInfo({ user, dictionary }) {
  if (!user) return null;

  // Format role display
  const formatRole = (role) => {
    const roleMap = {
      'RECEIVER': 'Receiver',
      'DELIVERER': 'Deliverer (Repartidev)',
      'RECEIVER_AND_DELIVERER': 'Receiver & Deliverer',
    };
    return roleMap[role] || role;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const infoItems = [
    {
      icon: <FaUser className="text-gray-400" />,
      label: dictionary.PersonalInfo.Name,
      value: user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.email.split('@')[0]
    },
    {
      icon: <FaEnvelope className="text-gray-400" />,
      label: dictionary.PersonalInfo.Email,
      value: user.email
    },
    {
      icon: <FaPhone className="text-gray-400" />,
      label: dictionary.PersonalInfo.Phone,
      value: user.phone || 'Not provided'
    },
    {
      icon: <FaUserTag className="text-gray-400" />,
      label: dictionary.PersonalInfo.Role,
      value: formatRole(user.role),
      highlight: true
    },
    {
      icon: <FaBuilding className="text-gray-400" />,
      label: dictionary.PersonalInfo.Condominium,
      value: user.department?.condominium?.name || 'Not assigned'
    },
    {
      icon: <FaBuilding className="text-gray-400" />,
      label: dictionary.PersonalInfo.Department,
      value: user.department ?
        `Tower ${user.department.tower} - Floor ${user.department.floor} - ${user.department.name}` :
        'Not assigned'
    },
    {
      icon: <FaCalendar className="text-gray-400" />,
      label: 'Member Since',
      value: formatDate(user.date_joined)
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">{dictionary.PersonalInfo.Title}</h2>

      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
            <div className="mt-1">{item.icon}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`font-medium ${item.highlight ? 'text-indigo-600' : 'text-gray-900'}`}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Account Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{dictionary.PersonalInfo.Status}</p>
            <p className="font-medium text-green-600">
              {user.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
          {user.is_email_verified && (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-green-600">{dictionary.PersonalInfo.Verified}</span>
            </div>
          )}
        </div>
      </div>

      {/* Deliverer Status (if applicable) */}
      {(user.role === 'DELIVERER' || user.role === 'RECEIVER_AND_DELIVERER') && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Deliverer Status</p>
              <p className={`font-medium ${user.is_available_for_delivery ? 'text-green-600' : 'text-gray-600'}`}>
                {user.is_available_for_delivery ? dictionary.Availability.Available : dictionary.Availability.NotAvailable}
              </p>
            </div>
            {user.rating && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Rating</p>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-900">{user.rating.toFixed(1)}</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
