import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './index.css'

import PrivateRoute from './Components/Routing/PrivateRoute'
import NavBarWrapper from './Components/Navbar/NavBarWrapper'

import Overview from './Pages/Overview/Overview'
import Admin from './Pages/Admin/Admin'
import OfficerTools from './Pages/OfficerTools/OfficerTools'
import MemberManager from './Pages/MemberManager/MemberManager'
import EventManager from './Pages/EventManager/EventManager'
import Login from './Pages/Login/Login'
import Profile from './Pages/Profile/MemberView/Profile'

import Home from './Pages/Home/Home.js'
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage'
import Events from './Pages/Events/announcements/announcementsPage.jsx'
import PrintingSolids from './Pages/3DPrinting/3DPrintForm.js'
import SolidsConsole from './Pages/3DPrintingConsole/3DConsole.js'
import MembershipApplication from './Pages/MembershipApplication/membershipApplication.jsx'
import Team from './Pages/TheTeam/TheTeam.js'
import Printing from './Pages/2DPrinting/2DPrinting.js'
import OfficerDB from './Pages/OfficerDB/OfficerDB.js'

export default function Routing ({ appProps }) {
  const userIsAuthenticated = appProps.authenticated
  const userIsOfficer =
    userIsAuthenticated && appProps.user && appProps.user.accessLevel > 0
  const userIsAdmin =
    userIsAuthenticated && appProps.user && appProps.user.accessLevel === 2

  const signedInRoutes = [
    {
      Component: Overview,
      path: '/dashboard',
      allowedIf: userIsOfficer,
      redirect: '/'
    },
    {
      Component: Admin,
      path: '/admin',
      allowedIf: userIsAdmin,
      redirect: '/dashboard'
    },
    {
      Component: OfficerTools,
      path: '/officer-tools',
      allowedIf: userIsOfficer,
      redirect: '/'
    },
    {
      Component: MemberManager,
      path: '/member-manager',
      allowedIf: userIsOfficer,
      redirect: '/'
    },
    {
      Component: EventManager,
      path: '/event-manager',
      allowedIf: userIsOfficer,
      redirect: '/'
    },
    {
      Component: SolidsConsole,
      path: '/3DConsole',
      allowedIf: userIsOfficer,
      redirect: '/'
    },
    {
      Component: PrintingSolids,
      path: '/3DPrintingForm',
      allowedIf: userIsAuthenticated,
      redirect: '/login'
    },
    {
      Component: Printing,
      path: '/2DPrinting',
      allowedIf: userIsAuthenticated,
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
  ]
  const signedOutRoutes = [
    { Component: Home, path: '/' },
    { Component: Events, path: '/events' },
    { Component: OfficerDB, path: '/officerDB' },
    { Component: Team, path: '/team' }
  ]
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
                      userIsOfficer &&
                      path !== '/2DPrinting' &&
                      path !== '/3DPrintingForm' &&
                      path !== '/profile'
                    }
                    {...props}
                  />
                )}
              />
            )
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
          )
        })}
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  )
}
