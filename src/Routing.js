import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './Components/Routing/PrivateRoute';
import NavBarWrapper from './Components/Navbar/NavBarWrapper';
import Overview from './Pages/Overview/Overview';
import Login from './Pages/Login/Login';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetPasswordPage from './Pages/ForgotPassword/ResetPassword';
import Profile from './Pages/Profile/MemberView/Profile';
import LedSign from './Pages/LedSign/LedSign';
import SpeakerPage from './Pages/Speaker/Speaker';
import EditUserInfo from './Pages/UserManager/EditUserInfo';

import Home from './Pages/Home/Home.js';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';
import MembershipApplication from
  './Pages/MembershipApplication/MembershipApplication.js';
import VerifyEmailPage from './Pages/MembershipApplication/VerifyEmail.js';
import Printing from './Pages/2DPrinting/2DPrinting.js';

import { membershipState } from './Enums';

import AboutPage from './Pages/About/About';
import ProjectsPage from './Pages/Projects/Projects';
import URLShortenerPage from './Pages/URLShortener/URLShortener';

import EmailPreferencesPage from './Pages/EmailPreferences/EmailPreferences';

import sendUnsubscribeEmail from './Pages/Profile/admin/SendUnsubscribeEmail';


export default function Routing({ appProps }) {
  const userIsAuthenticated = appProps.authenticated;
  const userIsMember =
    userIsAuthenticated &&
    appProps.user &&
    appProps.user.accessLevel === membershipState.MEMBER;
  const userIsOfficerOrAdmin =
    userIsAuthenticated &&
    appProps.user &&
    appProps.user.accessLevel >= membershipState.OFFICER;
  const signedInRoutes = [
    // new for Overview
    {
      Component: Overview,
      path: '/user-manager',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    //
    // {
    //   Component: EmailPage,
    //   path: '/email-list',
    //   allowedIf: userIsOfficerOrAdmin,
    //   redirect: '/',
    //   inAdminNavbar: true
    // },
    {
      Component: LedSign,
      path: '/led-sign',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    {
      Component: SpeakerPage,
      path: '/speakers',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    {
      Component: Printing,
      path: '/2DPrinting',
      allowedIf: userIsMember || userIsOfficerOrAdmin,
      redirect: '/login'
    },
    {
      Component: Login,
      path: '/login*',
      allowedIf: !userIsAuthenticated,
      redirect: '/',
      queryParams: {
        redirect: 'redirect',
      },
    },
    {
      Component: ForgotPassword,
      path: '/forgot',
      allowedIf: !userIsAuthenticated,
      redirect: '/'
    },
    {
      Component: MembershipApplication,
      path: '/register',
      allowedIf: !userIsAuthenticated,
      redirect: '/'
    },
    {
      Component: Profile,
      path: '/profile',
      allowedIf: userIsAuthenticated,
      redirect: '/login'
    },
    {
      Component: EditUserInfo,
      path: '/user/edit/:id',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    {
      Component: URLShortenerPage,
      path: '/short',
      allowedIf: userIsOfficerOrAdmin,
      inAdminNavbar: true,
      redirect: '/',
    },
    {
      Component: sendUnsubscribeEmail,
      path: '/unsub',
      allowedIf: userIsOfficerOrAdmin,
      inAdminNavbar: true,
      redirect: '/',
    },
  ];
  const signedOutRoutes = [
    { Component: Home, path: '/' },
    { Component: VerifyEmailPage, path: '/verify' },
    { Component: ResetPasswordPage, path: '/reset' },
    { Component: AboutPage, path: '/about'},
    { Component: ProjectsPage, path: '/projects'},
    { Component: EmailPreferencesPage, path: '/emailPreferences' },
  ];
  return (
    <Router>
      <Switch>
        {signedInRoutes.map(
          ({
            path,
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
                appProps={{
                  allowed: allowedIf,
                  user: appProps.user,
                  redirect,
                  authenticated:userIsAuthenticated,
                  ...appProps
                }}
                component={props => getCorrectComponent(props)}
              />
            );
          }
        )}
        {signedOutRoutes.map(({ path, Component }, index) => {
          return (
            <Route
              key={index}
              exact
              path={path}
              render={props => (
                <NavBarWrapper component={Component} {...props} {...appProps} />
              )}
            />
          );
        })}
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
}