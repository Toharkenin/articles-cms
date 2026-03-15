'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAdminById, updateAdmin } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function EditAuthorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getAdminById(id);
        const adminData = response?.admin || response?.data || response;
        setAdmin(adminData);

        // Initialize form fields
        setFirstName(adminData.firstName || '');
        setLastName(adminData.lastName || '');
        setPhoneNumber(adminData.phoneNumber || '');
        setRole(adminData.role || '');
      } catch (error) {
        console.error('Error fetching admin:', error);
        setError('Failed to load author. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmin();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await updateAdmin(id, firstName, lastName, phoneNumber, role);

      if (response?.success || response?.admin) {
        setSuccessMessage('Author updated successfully!');
        setTimeout(() => {
          router.push(`/admin/authors/${id}/view`);
        }, 1500);
      } else if (response?.error) {
        setError(response.error);
      } else {
        setError('Failed to update author. Please try again.');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      setError('Failed to update author. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
        <div className="text-lg">Loading author details...</div>
      </div>
    );
  }

  if (error && !admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-red-600">{error}</div>
        <Button onClick={() => router.push('/admin/authors')}>Back to Authors</Button>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-red-600">Author not found</div>
        <Button onClick={() => router.push('/admin/authors')}>Back to Authors</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[90%] mx-auto">
        {/* Header Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/admin/authors')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <MdArrowBack className="w-5 h-5" />
            <span>Back to Authors</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-full bg-linear-to-br from-theme-red to-[#c81d25] 
                 flex items-center justify-center text-white font-normal 
                 shadow-md hover:shadow-lg transition-all duration-200 
                 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {admin.firstName.charAt(0).toUpperCase()}
                {admin.lastName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Author</h1>
                <p className="text-gray-600">Update author information</p>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email (Read-only) */}
              <div className="flex items-start gap-4 p-4 bg-gray-100 rounded-lg">
                <div className="p-3 bg-white rounded-lg">
                  <MdEmail className="w-6 h-6 text-theme-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Email (Read-only)
                  </h3>
                  <p className="text-gray-900 break-all">{admin.email}</p>
                </div>
              </div>

              {/* User ID (Read-only) */}
              <div className="flex items-start gap-4 p-4 bg-gray-100 rounded-lg">
                <div className="p-3 bg-white rounded-lg">
                  <MdPerson className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    User ID (Read-only)
                  </h3>
                  <p className="text-gray-900 font-mono text-sm">{admin._id || admin.id}</p>
                </div>
              </div>

              {/* First Name */}
              <div className="flex items-start gap-4 p-4 bg-[#f8fafc] rounded-lg">
                <div className="p-3 bg-white rounded-lg">
                  <MdPerson className="w-6 h-6 text-theme-dark" />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-semibold text-gray-500 uppercase mb-2 block"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full"
                    placeholder="First Name"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="flex items-start gap-4 p-4 bg-[#f8fafc] rounded-lg">
                <div className="p-3 bg-white rounded-lg">
                  <MdPerson className="w-6 h-6 text-theme-dark" />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-semibold text-gray-500 uppercase mb-2 block"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-start gap-4 p-4 bg-[#f8fafc] rounded-lg">
                <div className="p-3 bg-white rounded-lg">
                  <MdPhone className="w-6 h-6 text-success-green" />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="phoneNumber"
                    className="text-sm font-semibold text-gray-500 uppercase mb-2 block"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-4 p-4 bg-[#f8fafc] rounded-lg">
                <div className="p-3 bg-white rounded-lg">
                  <MdWork className="w-6 h-6 text-theme-blue" />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="role"
                    className="text-sm font-semibold text-gray-500 uppercase mb-2 block"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-blue focus:border-transparent"
                  >
                    <option value="author">Author</option>
                    <option value="section_editor">Section Editor</option>
                    <option value="site_editor">Site Editor</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Timestamps (Read-only) */}
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

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 justify-end">
              <Button
                type="button"
                onClick={() => router.push(`/admin/authors/${id}/view`)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-theme-blue hover:bg-theme-dark text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
