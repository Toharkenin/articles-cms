'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { adminLogout, getAdminProfile } from '@/services/auth';

interface Profile {
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: 'super_admin' | 'admin';
  };
}

export default function ProfileDropdown({
  logout,
  update,
  router,
}: {
  logout: () => void;
  update: (v: any) => void;
  router: any;
}) {
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState<Profile | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchAdminProfile() {
      try {
        const profile = await getAdminProfile();
        setAdmin(profile);
      } catch (error) {
        setAdmin(null);
      }
    }
    fetchAdminProfile();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Get initials from name or email
  const getInitials = () => {
    if (admin?.admin?.firstName) {
      return `${admin.admin?.firstName[0]}${admin.admin?.lastName[0]}`.toUpperCase();
    }
    if (admin?.admin?.email) {
      return admin.admin.email[0].toUpperCase();
    }
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
      logout();
      update({ isLoggedIn: false });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 
                 flex items-center justify-center text-white font-normal 
                 shadow-md hover:shadow-lg transition-all duration-200 
                 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="User menu"
      >
        {getInitials()}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-52 
                      bg-white/95 backdrop-blur-md 
                      border border-gray-200 
                      rounded-xl shadow-xl 
                      overflow-hidden 
                      animate-in fade-in zoom-in-95 
                      z-50"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">
              {admin?.admin?.firstName && admin?.admin?.lastName
                ? `${admin.admin.firstName} ${admin.admin.lastName}`
                : admin?.admin?.email || 'Admin'}
            </p>
            <p className="text-xs text-gray-500">{admin?.admin?.role}</p>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              href="/admin/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 
                       hover:bg-gray-100 transition-colors"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left 
                       px-4 py-2 text-sm text-red-600 
                       hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
