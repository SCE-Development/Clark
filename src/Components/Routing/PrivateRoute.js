import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { membershipState } from '../../Enums';
import { allowedIf } from '../../Routes';
import { useUser } from '../../Components/context/UserContext';
import { useAuth } from '../../Components/context/AuthContext';

export default function PrivateRoute({ element: Component, appProps, ...params }) {
  const { user } = useUser();
  const { authenticated } = useAuth();
  const location = useLocation();

  const PERMISSION_LOOKUP_TABLE = {
    [allowedIf.MEMBER]: user?.accessLevel >= membershipState.MEMBER,
    [allowedIf.OFFICER_OR_ADMIN]: user?.accessLevel >= membershipState.OFFICER,
    [allowedIf.AUTHENTICATED]: !!authenticated,
    [allowedIf.UNAUTHENTICATED]: !authenticated,
  };

  const isAllowed = PERMISSION_LOOKUP_TABLE[appProps.allowed] ?? false;

  if (isAllowed) {
    return React.cloneElement(Component, { ...appProps });
  } else if (authenticated) {
    return <Navigate to="/" replace />;
  } else {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} state={{ from: location }} replace />;
  }
}
