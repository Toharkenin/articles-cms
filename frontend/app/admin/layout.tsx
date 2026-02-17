'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/auth-context';
import AuthContextWrapper from '@/context/auth-context';

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { value, update } = useAuthContext();
  const { isLoggedIn, logout } = value;

  useEffect(() => {
    // If not on login page and not logged in, redirect to login
    if (pathname !== '/admin/login' && !isLoggedIn) {
      router.push('/admin/login');
    }
    // If on login page and already logged in, redirect to dashboard
    else if (pathname === '/admin/login' && isLoggedIn) {
      router.push('/admin/dashboard');
    }
  }, [pathname, isLoggedIn, router]);

  // Don't show layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={() => {
            logout();
            update({ isLoggedIn: false });
            router.push('/admin/login');
          }}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          Logout
        </button>
      </nav>
      <main>{children}</main>
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
