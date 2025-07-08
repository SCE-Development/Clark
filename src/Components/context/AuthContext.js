import React, { createContext, useContext } from 'react';

export const AuthContext = createContext({
  authenticated: false,
  setAuthenticated: () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}
