import React, { createContext, useState, useEffect } from 'react';

export const SpeakerContext = createContext();

export const SpeakerProvider = ({ children }) => {
  const [hasSong, setHasSong] = useState(() => {
    // Initialize state from localStorage
    const savedHasSong = localStorage.getItem('hasSong');
    console.log("Saved Has Song: ", savedHasSong);
    return savedHasSong === 'true' || false; //return false if saveHasSong DNE
  });

  // set the localStorage hasSong to false when we first render(?)
  localStorage.setItem('hasSong', 'false');
  console.log("HAS SONG FALSIFIED");
  console.log("HASSONG NOW: ", hasSong);
   

  useEffect(() => {
    // Update localStorage whenever hasSong changes
    localStorage.setItem('hasSong', hasSong);
    console.log("a change in hasSONG HAPPENED!!");
  }, [hasSong]);

  return (
    <SpeakerContext.Provider value={{ hasSong, setHasSong }}>
      {children}
    </SpeakerContext.Provider>
  );
};
