import React, { Component } from 'react';
// import { Route, Redirect } from 'react-router-dom';
import { Route, Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute(
  {component: Component, appProps, ...props}) {
  return (
    appProps.allowed ?
      <Component {...appProps} {...props} />
      // <Outlet />
      : <Navigate
        to={{
          pathname: appProps.redirect ? appProps.redirect : '/login'}}
        state={{ from: props.location }}
        replace
      />

  // <Route
  //   {...params}
  //   element={props =>
  //     appProps.allowed ?
  //       (
  //         <Component {...appProps} {...props} />
  //       ) :
  //       (
  //         <Route
  //           element={props => (
  //             <Navigate
  //               to={{
  //                 pathname: appProps.redirect ? appProps.redirect : '/login',
  //                 state: { from: props.location }
  //               }}
  //             />
  //           )}
  //         />
  //       )}
  // />


  // appProps.allowed ? (<Component {...appProps} {...props} />) : (
  //   <Navigate
  //     to={{
  //       pathname: appProps.redirect ? appProps.redirect : '/login',
  //       state: { from: props.location }
  //     }}
  //   />
  // )
  );
}

