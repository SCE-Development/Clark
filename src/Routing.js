import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './index.css'

import PrivateRoute from './Components/Routing/PrivateRoute'
import Dashboard from './Components/Dashboard/Dashboard'
import Overview from './Pages/Overview/Overview'
import Admin from './Pages/Admin/Admin'
import OfficerTools from './Pages/OfficerTools/OfficerTools'
import MemberManager from './Pages/MemberManager/MemberManager'
import EventManager from './Pages/EventManager/EventManager'
import Login from './Pages/Login/Login'

import Home from './Pages/Home/Home.js'
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage'
import Events from './Pages/Events/announcements/announcementsPage.jsx'
import LabKits from './Pages/LabKits/App.js'
import PrintingSolids from './Pages/3DPrinting/app3DPrintForm.js'
import SolidsConsole from './Pages/3DPrintingConsole/app3DConsole.js'
import MembershipApplication from './Pages/MembershipApplication/membershipApplication.jsx'
import Team from './Pages/TheTeam/App.js'
import Printing from './Pages/2DPrinting/App.js'
import OfficerDB from './Pages/OfficerDB/App.js'

export default function Routing ({ appProps }) {
  const signedInRoutes = [
    { Component: Overview, path: '/dashboard' },
    {
      Component: Admin,
      path: '/admin',
      allowedIf:
        appProps.authenticated &&
        appProps.user &&
        appProps.user.accessLevel === 2
    },
    { Component: OfficerTools, path: '/officer-tools' },
    { Component: MemberManager, path: '/member-manager' },
    { Component: EventManager, path: '/event-manager' },
    { Component: SolidsConsole, path: '/3DConsole' }
  ]
  const signedOutRoutes = [
    { Component: Home, path: '/' },
    { Component: Events, path: '/events' },
    { Component: OfficerDB, path: '/officerDB' },
    { Component: Team, path: '/team' },
    { Component: LabKits, path: '/labkits' },
    { Component: PrintingSolids, path: '/3DPrintingForm' },
    { Component: Printing, path: '/2DPrinting' },
    { Component: Login, path: '/login' },
    { Component: MembershipApplication, path: '/register' }
  ]
  return (
    <Router>
      <Switch>
        <Route
          exact
          path='/(dashboard|admin|officer-tools|member-manager|event-manager|3DConsole)'
          render={() => (
            <Dashboard>
              {signedInRoutes.map(({ path, Component, allowedIf }, index) => {
                return (
                  <PrivateRoute
                    key={index}
                    exact
                    path={path}
                    appProps={{
                      allowed: allowedIf || appProps.authenticated,
                      user: appProps.user,
                      ...appProps
                    }}
                    component={() => <Component />}
                  />
                )
              })}
            </Dashboard>
          )}
        />
        {signedOutRoutes.map(({ path, Component }, index) => {
          return (
            <Route
              key={index}
              exact
              path={path}
              render={props => <Component {...appProps} {...props} />}
            />
          )
        })}
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  )
}
