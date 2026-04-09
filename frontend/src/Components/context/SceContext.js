import React, { createContext, useContext } from 'react';

export const SceContext = createContext({
  user: {},
  setUser: () => {},
  authenticated: false,
  setAuthenticated: () => {},
});

export function useSCE() {
  return useContext(SceContext);
}
