'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminProfile } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { MdArrowBack, MdEmail, MdPerson, MdWork, MdPhone } from 'react-icons/md';

interface Admin {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getAdminProfile();
        const adminData = response?.admin || response?.data || response;
        setAdmin(adminData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      super_admin: 'Super Admin',
      site_editor: 'Site Editor',
      section_editor: 'Section Editor',
      author: 'Author',
    };
    return roleLabels[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-blue-50 text-[var(--theme-dark)]',
      site_editor: 'bg-blue-50 text-[var(--theme-blue)]',
      section_editor: 'bg-green-50 text-[var(--success-green)]',
      author: 'bg-gray-100 text-gray-700',
    };

    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-red-600">{error || 'Profile not found'}</div>
        <Button onClick={() => router.push('/admin/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[90%] mx-auto">
        {/* Header Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <MdArrowBack className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push('/admin/profile/edit')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-theme-red to-[#c81d25] 
                 flex items-center justify-center text-white font-normal 
                 shadow-md hover:shadow-lg transition-all duration-200 
                 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {admin.firstName.charAt(0).toUpperCase()}
                {admin.lastName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {admin.firstName} {admin.lastName}
                </h1>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(
                    admin.role
                  )}`}
                >
                  {getRoleLabel(admin.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-[#f8fafc] rounded-lg">
              <div className="p-3 bg-white rounded-lg">
                <MdEmail className="w-6 h-6 text-theme-blue" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Email</h3>
                <p className="text-gray-900 break-all">{admin.email}</p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-3 bg-white rounded-lg">
                <MdPhone className="w-6 h-6 text-[var(--success-green)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Phone Number</h3>
                <p className="text-gray-900">{admin.phoneNumber || 'Not provided'}</p>
              </div>
            </div>

            {/* First Name */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-3 bg-white rounded-lg">
                <MdPerson className="w-6 h-6 text-[var(--theme-dark)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">First Name</h3>
                <p className="text-gray-900">{admin.firstName}</p>
              </div>
            </div>

            {/* Last Name */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-3 bg-white rounded-lg">
                <MdPerson className="w-6 h-6 text-[var(--theme-dark)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Last Name</h3>
                <p className="text-gray-900">{admin.lastName}</p>
              </div>
            </div>

            {/* Role Details */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-3 bg-white rounded-lg">
                <MdWork className="w-6 h-6 text-[var(--theme-blue)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Role</h3>
                <p className="text-gray-900">{getRoleLabel(admin.role)}</p>
              </div>
            </div>

            {/* User ID */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-3 bg-white rounded-lg">
                <MdPerson className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">User ID</h3>
                <p className="text-gray-900 font-mono text-sm">{admin._id || admin.id}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          {(admin.createdAt || admin.updatedAt) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {admin.createdAt && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                      Created At
                    </h3>
                    <p className="text-gray-900">
                      {new Date(admin.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
                {admin.updatedAt && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                      Last Updated
                    </h3>
                    <p className="text-gray-900">
                      {new Date(admin.updatedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
