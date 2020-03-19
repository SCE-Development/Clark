import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';

import PrivateRoute from './Components/Routing/PrivateRoute';
import NavBarWrapper from './Components/Navbar/NavBarWrapper';

import Overview from './Pages/Overview/Overview';
import EventManager from './Pages/EventManager/EventManager';
import Login from './Pages/Login/Login';
import Profile from './Pages/Profile/MemberView/Profile';
import LedSign from './Pages/LedSign/LedSign';

import Home from './Pages/Home/Home.js';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';
import EventList from './Pages/Events/EventList';
import PrintingSolids from './Pages/3DPrinting/3DPrintForm.js';
import SolidsConsole from './Pages/3DPrintingConsole/3DConsole.js';
import MembershipApplication from 
  './Pages/MembershipApplication/membershipApplication.jsx';
import VerifyEmailPage from './Pages/MembershipApplication/VerifyEmail.js';
import Team from './Pages/TheTeam/TheTeam.js';
import Printing from './Pages/2DPrinting/2DPrinting.js';
import OfficerDB from './Pages/OfficerDB/OfficerDB.js';
import { membershipState } from './Enums';

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
      Component: Overview,
      path: '/dashboard',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/'
    },
    {
      Component: EventManager,
      path: '/event-manager',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/'
    },
    {
      Component: SolidsConsole,
      path: '/3DConsole',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/'
    },
    {
      Component: LedSign,
      path: '/led-sign',
      allowedIf: userIsOfficerOrAdmin,
      redirect: '/'
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
    }
  ];
  const signedOutRoutes = [
    { Component: Home, path: '/' },
    { Component: EventList, path: '/events' },
    { Component: OfficerDB, path: '/officerDB' },
    { Component: Team, path: '/team' },
    { Component: VerifyEmailPage, path: '/verify' }
  ];
  return (
    <Router>
      <Switch>
        {signedInRoutes.map(
          ({ path, Component, allowedIf, redirect }, index) => {
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
                    enableAdminNavbar={
                      userIsOfficerOrAdmin &&
                      path !== '/2DPrinting' &&
                      path !== '/3DPrintingForm' &&
                      path !== '/profile'
                    }
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
