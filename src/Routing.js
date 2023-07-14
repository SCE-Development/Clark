import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';

import PrivateRoute from './Components/Routing/PrivateRoute';
import NavBarWrapper from './Components/Navbar/NavBarWrapper';
import Overview from './Pages/Overview/Overview';
import EmailPage from './Pages/EmailList/EmailPage';
import EventManager from './Pages/EventManager/EventManager';
import Login from './Pages/Login/Login';
import Profile from './Pages/Profile/MemberView/Profile';
import LedSign from './Pages/LedSign/LedSign';
import EditUserInfo from './Pages/UserManager/EditUserInfo';

import Home from './Pages/Home/Home.js';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';
import EventList from './Pages/Events/EventList';
import PrintingSolids from './Pages/3DPrinting/3DPrintForm.js';
import SolidsConsole from './Pages/3DPrintingConsole/3DConsole.js';
import MembershipApplication from
  './Pages/MembershipApplication/MembershipApplication.js';
import VerifyEmailPage from './Pages/MembershipApplication/VerifyEmail.js';
import Printing from './Pages/2DPrinting/2DPrinting.js';

import { membershipState } from './Enums';
import GoogleLoginDiscord from './Pages/SJSUDiscordBot/GoogleLogin.js';
import DiscordSJSU from './Pages/DiscordSJSU/DiscordSJSU.js';

import AdminDashboard from './Pages/Profile/admin/AdminDashboard';
import AboutPage from './Pages/About/About';
import ProjectsPage from './Pages/Projects/Projects';
import URLShortenerPage from './Pages/URLShortener/URLShortener';

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

    {
      Component: AdminDashboard,
      path: '/dashboard',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    // new for Overview
    {
      Component: Overview,
      path: '/user-manager',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    //
    {
      Component: EmailPage,
      path: '/email-list',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    {
      Component: EventManager,
      path: '/event-manager',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    {
      Component: SolidsConsole,
      path: '/3DConsole',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    {
      Component: LedSign,
      path: '/led-sign',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/',
      inAdminNavbar: true
    },
    {
      Component: PrintingSolids,
      path: '/3DPrintingForm',
      allowedIf: userIsMember || userIsOfficerOrAdmin,
      redirect: '/login'
    },
    {
      Component: Printing,
      path: '/2DPrinting',
      allowedIf: userIsMember || userIsOfficerOrAdmin,
      redirect: '/login'
    },
    {
      Component: Login,
      path: '/login',
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
      redirect: '/'
    }
  ];
  const signedOutRoutes = [
    { Component: Home, path: '/' },
    { Component: EventList, path: '/events' },
    { Component: VerifyEmailPage, path: '/verify' },
    { Component: GoogleLoginDiscord, path: '/discordSJSU/LoginWithGoogle/:id' },
    { Component: DiscordSJSU, path: '/discordSJSU' },
    { Component: AboutPage, path: '/about'},
    { Component: ProjectsPage, path: '/projects'}
  ];
  return (
    <Router>
      <Switch>
        {signedInRoutes.map(
          ({ path, Component, allowedIf, redirect, inAdminNavbar }, index) => {
            return (
              <PrivateRoute
                key={index}
                exact
                path={path}
                appProps={{
                  allowed: allowedIf,
                  user: appProps.user,
                  redirect,
                  ...appProps
                }}
                component={props => (
                  <NavBarWrapper
                    component={Component}
                    enableAdminNavbar={inAdminNavbar}
                    {...props}
                  />
                )}
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
