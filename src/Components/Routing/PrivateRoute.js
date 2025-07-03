import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { membershipState } from '../../Enums';
import { allowedIf } from '../../Routes';
import { useUser } from '../../Components/context/UserContext';

export default function PrivateRoute({
  component: Component,
  appProps,
  ...params
}) {
  const { user } = useUser();

  // Check if the user's access level matches with route's access grant
  const PERMISSION_LOOKUP_TABLE = {
    [allowedIf.MEMBER]: user?.accessLevel >= membershipState.MEMBER,
    [allowedIf.OFFICER_OR_ADMIN]: user?.accessLevel >= membershipState.OFFICER,
    [allowedIf.AUTHENTICATED]: !!appProps.authenticated,
    [allowedIf.UNAUTHENTICATED]: !appProps.authenticated,
  };

  const isAllowed = PERMISSION_LOOKUP_TABLE[appProps.allowed] ?? false;

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
