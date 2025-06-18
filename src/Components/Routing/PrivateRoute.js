import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { membershipState } from '../../Enums';
import { allowedIf } from '../../RouteConfig';

function checkPermission(user, permission, authenticated) {
  if (permission === allowedIf.MEMBER)
    return user?.accessLevel >= membershipState.MEMBER;
  if (permission === allowedIf.OFFICER_OR_ADMIN)
    return user?.accessLevel >= membershipState.OFFICER;
  if (permission === allowedIf.AUTHENTICATED)
    return authenticated;
  if (permission === allowedIf.UNAUTHENTICATED)
    return true;
  return false;
}

export default function PrivateRoute({
  component: Component,
  appProps,
  ...params
}) {
  // Check permission before granting access
  const isAllowed = checkPermission(appProps.user, appProps.allowed, appProps.authenticated);

  return (
    <Route
      {...params}
      render={(props) => {
        if (isAllowed) {
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
                      '/login?redirect=' + encodeURIComponent(params.location.pathname),
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
