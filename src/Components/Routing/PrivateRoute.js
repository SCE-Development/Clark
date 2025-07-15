import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { membershipState } from '../../Enums';
import { allowedIf } from '../../Routes';
import { useUser } from '../../Components/context/UserContext';
import { useAuth } from '../../Components/context/AuthContext';

export default function PrivateRoute({
  component: Component,
  appProps,
  ...params
}) {
  const { user } = useUser();
  const { authenticated } = useAuth();

  // Check if the user's access level matches with route's access grant
  const PERMISSION_LOOKUP_TABLE = {
    [allowedIf.MEMBER]: user?.accessLevel >= membershipState.MEMBER,
    [allowedIf.OFFICER_OR_ADMIN]: user?.accessLevel >= membershipState.OFFICER,
    [allowedIf.AUTHENTICATED]: !!authenticated,
    [allowedIf.UNAUTHENTICATED]: !authenticated,
  };

  const isAllowed = PERMISSION_LOOKUP_TABLE[appProps.allowed] ?? false;

  return (
    <Route
      {...params}
      render={(props) => {
        if (isAllowed) {
          return <Component {...appProps} {...props} />;
        } else if (authenticated) {
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
