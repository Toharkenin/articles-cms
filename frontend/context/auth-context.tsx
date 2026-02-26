'use client';
import { getAdminProfile } from '@/services/auth';

import { createGenericContext } from './create-context';
import { ReactNode, useEffect, useState, useCallback } from 'react';

type AuthContextData = {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const [useAuthContextInternal, AuthContextProviderInternal] =
  createGenericContext<AuthContextData>('useAuthContext');

export const useAuthContext = () => useAuthContextInternal();

export default function AuthContextWrapper({ children }: { children: ReactNode }) {
  const login = useCallback((token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }, []);

  return (
    <AuthContextProviderInternal
      defaultValue={{
        isLoggedIn: false,
        isAuthLoading: true,
        login,
        logout,
      }}
    >
      <AuthInitializer>{children}</AuthInitializer>
    </AuthContextProviderInternal>
  );
}

function AuthInitializer({ children }: { children: ReactNode }) {
  const { update, value } = useAuthContextInternal();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Skip if already logged in or already checked
    if (value.isLoggedIn || checked) return;

    let isMounted = true;

    async function checkAuth() {
      if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
        update({ isLoggedIn: false, isAuthLoading: false });
        setChecked(true);
        return;
      }

      try {
        await getAdminProfile();
        if (isMounted) {
          update({ isLoggedIn: true, isAuthLoading: false });
          setChecked(true);
        }
      } catch {
        if (isMounted) {
          update({ isLoggedIn: false, isAuthLoading: false });
          setChecked(true);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, value.isLoggedIn]);

  return <>{children}</>;
}
