'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SuccessPopup } from '@/components/ui/success-popup';
import { createAdmin } from '@/services/auth';
import { MdEmail, MdLock, MdPerson, MdPhone, MdWorkOutline } from 'react-icons/md';

export default function NewAuthorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'author',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const response = await createAdmin(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.phoneNumber,
        formData.role
      );

      if (response.success) {
        setShowSuccessPopup(true);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
          role: 'author',
        });
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      const errorMessage =
        error?.response?.data?.message || 'Failed to create admin. Please try again.';
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    router.push('/admin/authors');
  };

  return (
    <div className="w-[90%] max-w-3xl mx-auto py-10">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold">Create New Admin</h1>
        <p className="text-gray-600 mt-2">Add a new administrator to the system</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="firstName"
              type="text"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              icon={<MdPerson size={20} />}
              disabled={isSubmitting}
            />

            <Input
              label="Last Name"
              name="lastName"
              type="text"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              icon={<MdPerson size={20} />}
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="admin@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<MdEmail size={20} />}
            disabled={isSubmitting}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password (min. 6 characters)"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<MdLock size={20} />}
            disabled={isSubmitting}
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            icon={<MdPhone size={20} />}
            disabled={isSubmitting}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <MdWorkOutline size={20} />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-200
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${errors.role ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="super_admin">Super Admin</option>
                <option value="site_editor">Site Editor</option>
                <option value="section_editor">Section Editor</option>
                <option value="author">Author</option>
              </select>
            </div>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creating...' : 'Create Admin'}
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <SuccessPopup
        open={showSuccessPopup}
        onClose={handleSuccessClose}
        title="Admin Created!"
        description="The new administrator has been successfully created."
      />
    </div>
  );
}
