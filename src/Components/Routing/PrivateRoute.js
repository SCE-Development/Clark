import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { membershipState } from '../../Enums';
import { allowedIf } from '../../RouteConfig';
import { useUser } from '../../Components/context/UserContext';

export default function PrivateRoute({
  component: Component,
  appProps,
  ...params
}) {
  const { user } = useUser();

  // Check if the user's access level matches with route's access grant
  const PERMISSION_LOOKUP_TABLE = {
    [allowedIf.MEMBER]: (user, authenticated) => user?.accessLevel >= membershipState.MEMBER,
    [allowedIf.OFFICER_OR_ADMIN]: (user, authenticated) => user?.accessLevel >= membershipState.OFFICER,
    [allowedIf.AUTHENTICATED]: (user, authenticated) => authenticated,
    [allowedIf.UNAUTHENTICATED]: (user, authenticated) => !authenticated,
  };

  const isAllowed = PERMISSION_LOOKUP_TABLE[appProps.allowed]?.(user, appProps.authenticated) ?? false;

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
