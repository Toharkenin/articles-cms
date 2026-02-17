'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export function createGenericContext<T>(hookName: string = 'useContext') {
  const Context = createContext<{ value: T; update: (v: Partial<T>) => void } | undefined>(
    undefined,
  );

  function useGenericContext() {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`${hookName} must be used within a Provider`);
    }
    return context;
  }

  function Provider({ children, defaultValue }: { children: ReactNode; defaultValue: T }) {
    const [value, setValue] = useState<T>(defaultValue);

    const update = useCallback(
      (newValue: Partial<T>) => setValue((prev) => ({ ...prev, ...newValue })),
      [],
    );

    return <Context.Provider value={{ value, update }}>{children}</Context.Provider>;
  }

  return [useGenericContext, Provider] as const;
}
