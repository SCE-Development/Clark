import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './Components/Routing/PrivateRoute';
import NavBarWrapper from './Components/Navbar/NavBarWrapper';

import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';

import { officerSignedInRoutes, memberSignedInRoutes, signedOutRoutes } from './RouteConfig.js';

export default function Routing({ appProps }) {
  const userIsAuthenticated = appProps.authenticated;

  const routes = [...officerSignedInRoutes, ...memberSignedInRoutes];

  return (
    <div>
      <Switch>
        {routes.map(
          ({
            path,
            pageName,
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
                pageName={pageName}
                appProps={{
                  allowed: allowedIf,
                  redirect,
                  authenticated: userIsAuthenticated,
                  ...appProps
                }}
                component={props => getCorrectComponent(props)}
              />
            );
          }
        )}
        {signedOutRoutes.map(({ path, pageName, Component }, index) => {
          return (
            <Route
              key={index}
              exact
              path={path}
              pageName={pageName}
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
