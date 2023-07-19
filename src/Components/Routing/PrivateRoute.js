import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({
  component: Component,
  appProps,
  ...params
}) {
  return (
    <Route
      {...params}
      render={(props) => {
        if (appProps.allowed) {
          return <Component {...appProps} {...props} />;
        } else if (appProps.authenticated) {
          return (
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          );
        } else {
          return (
            <Route
              render={(props) => (
                <Redirect
                  to={{
                    pathname:
                      '/login?redirect=' + encodeURIComponent(params.path),
                    state: { from: props.location },
                  }}
                />
              )}
            />
          );
        }
      }}
    />
  );
}
