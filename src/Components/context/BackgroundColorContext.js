import React, { createContext, useContext, useState } from 'react';

export const BackgroundColorContext = createContext(null);

export function useBackgroundColor() {
  return useContext(BackgroundColorContext);
}

export default function BackgroundColorContextProvider({children}) {
  const [backgroundColorVersion, setBackgroundColorVersion] = useState(0);
  return (
    <BackgroundColorContext.Provider value={{ backgroundColorVersion, setBackgroundColorVersion }}>
      {children}
    </BackgroundColorContext.Provider>
  );
}

