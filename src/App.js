import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './index.css'
// import * as serviceWorker from './serviceWorker'

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
// import EventManager from './Pages/Events/manager/eventManager.jsx'
import LabKits from './Pages/LabKits/App.js'
import PrintingSolids from './Pages/3DPrinting/app3DPrintForm.js'
import SolidsConsole from './Pages/3DPrintingConsole/app3DConsole.js'
import MembershipApplication from './Pages/MembershipApplication/membershipApplication.jsx'
import Team from './Pages/TheTeam/App.js'
import Printing from './Pages/2DPrinting/App.js'
// import Jumbotron from './Components/Jumbotron/App.js'

export default class App extends React.Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path='/(dashboard|admin|officer-tools|member-manager|event-manager|3DConsole)'
            render={() => (
              <Dashboard>
                <Route path='/dashboard' component={() => <Overview />} />
                <Route path='/admin' component={() => <Admin />} />
                <Route
                  path='/officer-tools'
                  component={() => <OfficerTools />}
                />
                <Route
                  path='/member-manager'
                  component={() => <MemberManager />}
                />
                <Route
                  path='/event-manager'
                  component={() => <EventManager />}
                />
                <Route path='/3DConsole' component={() => <SolidsConsole />} />
              </Dashboard>
            )}
          />

          <Route exact path='/' component={Home} />
          <Route exact path='/events' component={Events} />
          {/* <Route exact path='/eventsManager' component={EventManager} /> */}
          {/* <Route exact path='/jumbotron' component={Jumbotron} /> */}
          <Route exact path='/Team' component={Team} />
          <Route exact path='/labkits' component={LabKits} />
          <Route exact path='/3DPrintingForm' component={PrintingSolids} />
          <Route exact path='/2DPrinting' component={Printing} />
          {/* <Route exact path='/Gear' component={Gear} /> */}

          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={MembershipApplication} />

          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    )
  }
}
