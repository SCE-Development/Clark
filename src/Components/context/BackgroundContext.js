import React, { createContext, useContext } from 'react';

export const BackgroundColorContext = createContext();

export function useBackgroundColor() {
  return useContext(BackgroundColorContext);
}
