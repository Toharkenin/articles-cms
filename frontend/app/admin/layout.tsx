'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/auth-context';
import AuthContextWrapper from '@/context/auth-context';
import Link from 'next/link';
import ProfileDropdown from '@/components/admin/profile-dropdown';
import Sidebar from '@/components/admin/sidebar';

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { value, update } = useAuthContext();
  const { isLoggedIn, isAuthLoading, logout } = value;

  useEffect(() => {
    if (isAuthLoading) return;
    // If not on login page and not logged in, redirect to login
    if (pathname !== '/admin/login' && !isLoggedIn) {
      router.push('/admin/login');
    }
    else if (pathname === '/admin/login' && isLoggedIn) {
      router.push('/admin/dashboard');
    }
  }, [pathname, isLoggedIn, isAuthLoading, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't show admin layout if not logged in (will redirect)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="p-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">G-Articles</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
        </div>
        <ProfileDropdown logout={logout} update={update} router={router} />
      </nav>
      <div className="flex flex-1">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContextWrapper>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthContextWrapper>
  );
}
