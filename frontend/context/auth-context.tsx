'use client';

import { createGenericContext } from './create-context';
import { ReactNode, useEffect } from 'react';

type AuthContextData = {
  isLoggedIn: boolean;
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
        login,
        logout
      }}
    >
      <AuthInitializer>{children}</AuthInitializer>
    </AuthContextProviderInternal>
  );
}

function AuthInitializer({ children }: { children: ReactNode }) {
  const { value, update } = useAuthContextInternal();

  useEffect(() => {
    // Check authentication status on mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      update({ isLoggedIn: !!token });
    }
  }, [update]);

  return <>{children}</>;
}
