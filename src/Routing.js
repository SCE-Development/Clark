import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PrivateRoute from './Components/Routing/PrivateRoute';
import NavBarWrapper from './Components/Navbar/NavBarWrapper';

import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';

import { useUser } from './Components/context/UserContext';
import { useAuth } from './Components/context/AuthContext';

import { officerOrAdminRoutes, notAuthenticatedRoutes, signedOutRoutes } from './Routes.js';

export default function Routing({ appProps }) {
  const { user, setUser } = useUser();
  const { authenticated } = useAuth();

  const signedInRoutes = [...officerOrAdminRoutes, ...notAuthenticatedRoutes];

  return (
    <div>
      <Routes>
        {signedInRoutes.map(
          ({
            path,
            Component,
            allowedIf,
            redirect,
            inAdminNavbar,
            hideAdminNavbar = false,
          }, index) => {
            function getCorrectComponent(privateRouteProps) {
              if (hideAdminNavbar) {
                return <Component {...privateRouteProps} />;
              }
              return (<NavBarWrapper
                component={Component}
                enableAdminNavbar={inAdminNavbar}
                {...privateRouteProps}
              />);
            }
            return (
              <Route
                key={index}
                path={path}
                element={
                  <PrivateRoute
                    appProps={{
                      allowed: allowedIf,
                      redirect,
                      ...appProps
                    }}
                  >
                    {getCorrectComponent({})}
                  </PrivateRoute>
                }
              />
            );
          }
        )}
        {signedOutRoutes.map(({ path, Component }, index) => (
          <Route
            key={index}
            path={path}
            element={<NavBarWrapper component={Component} {...appProps} />}
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
