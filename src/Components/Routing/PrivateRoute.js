import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute(
  { component: Component, appProps, ...props }) {
  return (
    appProps.allowed ?
      <Component {...appProps} {...props} />
      : <Navigate
        to={{
          pathname: appProps.redirect ? appProps.redirect : '/login'
        }}
        state={{ from: props.location }}
        replace
      />
  );
}

