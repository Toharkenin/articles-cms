'use client';

import { createGenericContext } from './create-context';
import { ReactNode, useEffect, useState } from 'react';

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
  const login = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  };

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

import { getAdminProfile } from '@/services/auth';

function AuthInitializer({ children }: { children: ReactNode }) {
  const { update } = useAuthContextInternal();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
  let isMounted = true;

  async function checkAuth() {
    try {
      await getAdminProfile(); 
      if (isMounted) {
        update({ isLoggedIn: true, isAuthLoading: false });
      }
    } catch {
      if (isMounted) {
        update({ isLoggedIn: false, isAuthLoading: false });
      }
    }
  }

  checkAuth();

  return () => {
    isMounted = false;
  };
}, [update]);

  return <>{children}</>;
}
