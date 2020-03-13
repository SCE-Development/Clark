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
      render={props =>
        appProps.allowed ? (
          <Component {...appProps} {...props} />
        ) : (
          <Route
            render={props => (
              <Redirect
                to={{
                  pathname: appProps.redirect ? appProps.redirect : '/login',
                  state: { from: props.location }
                }}
              />
            )}
          />
        )}
    />
  );
}
