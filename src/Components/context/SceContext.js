import React, { createContext, useContext } from 'react';

export const SceContext = createContext({
  user: {},
  setUser: () => { },
  authenticated: false,
  setAuthenticated: () => { },
});

// ======== ORIGINAL useSCE LOGIC ========
export function useSCE() {
  return useContext(SceContext);
}
// ==========================================

// ======== MOCKED VERSION FOR TESTING ========
// export function useSCE() {
//   const context = useContext(SceContext);
//   return {
//     ...context,
//     user: {
//       ...context.user,
//       accessLevel: 3, // Temporarily forced to ADMIN for testing
//       _id: context.user?._id || 'mocked-id-for-testing'
//     }
//   };
// }
