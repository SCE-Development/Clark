import React, { createContext, useContext } from 'react';

export const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}
