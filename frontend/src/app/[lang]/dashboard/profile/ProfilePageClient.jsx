'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/hooks/use-users';
import ProfileInfo from '@/components/profile/ProfileInfo';
import ProfileEdit from '@/components/profile/ProfileEdit';
import ProfileStats from '@/components/profile/ProfileStats';
import { Spinner } from '@/components/common';
import { FaPencilAlt } from 'react-icons/fa';

export default function ProfilePageClient({ dictionary }) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading, error } = useCurrentUser();

  // Extract profile dictionary
  const dict = dictionary.DashboardPage.ProfilePage;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{dict.Title}</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPencilAlt className="h-4 w-4 mr-2" />
              {dict.EditButton}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Profile Info or Edit Form */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <ProfileEdit
                user={user}
                onCancel={() => setIsEditing(false)}
                onSuccess={() => setIsEditing(false)}
                dictionary={dict}
              />
            ) : (
              <ProfileInfo user={user} dictionary={dict} />
            )}
          </div>

          {/* Sidebar - Statistics */}
          <div className="lg:col-span-1">
            <ProfileStats user={user} dictionary={dict} />
          </div>
        </div>
      </div>
    </div>
  );
}
