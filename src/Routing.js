import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './Components/Routing/PrivateRoute';
import NavBarWrapper from './Components/Navbar/NavBarWrapper';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';

import { getSignedInRoutes, signedOutRoutes } from './Components/Routing/Routes';

import CardReader from './Pages/CardReader/CardReader.js';

import { useUser } from './Components/context/UserContext';

export default function Routing({ appProps }) {
  const { notAuthenticatedRoutes, officerOrAdminRoutes } = getSignedInRoutes(appProps.authenticated, appProps.user);
  const signedInRoutes = [...notAuthenticatedRoutes, ...officerOrAdminRoutes];
  return (
    <div>
      <Switch>
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
              <PrivateRoute
                key={index}
                exact
                path={path}
                appProps={{
                  allowed: allowedIf,
                  redirect,
                  authenticated: appProps.authenticated,
                  ...appProps
                }}
                component={props => getCorrectComponent(props)}
              />
            );
          }
        )}
        {signedOutRoutes.map(({ path, Component }, index) => {
          return (
            <Route
              key={index}
              exact
              path={path}
              render={props => (
                <NavBarWrapper component={Component} {...props} {...appProps} />
              )}
            />
          );
        })}
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}
