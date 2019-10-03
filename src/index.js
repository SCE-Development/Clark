import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './index.css'
// import * as serviceWorker from './serviceWorker'

import Home from './Pages/Home/Home.js'
import Events from './Pages/Events/announcements/announcementsPage.jsx'
import EventManager from './Pages/Events/manager/eventManager.jsx'
import Benefits from './Pages/Benefits/App.js'
import LabKits from './Pages/LabKits/App.js'
import PrintingSolids from './Pages/3DPrinting/app3DPrintForm.js'
import SolidsConsole from './Pages/3DPrintingConsole/app3DConsole.js'
import MembershipApplication from './Pages/MembershipApplication/membershipApplication.jsx'
import Team from './Pages/TheTeam/App.js'
import Printing from './Pages/2DPrinting/App.js'
import Gear from './Pages/TheGear/App.js'

// import NavBar from './Components/Navbar/NavBar.js'
import Jumbotron from './Components/Jumbotron/App.js'

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/events' component={Events} />
      <Route exact path='/eventsManager' component={EventManager} />
      <Route
        exact
        path='/membershipApplication'
        component={MembershipApplication}
      />
      <Route exact path='/benefits' component={Benefits} />
      <Route exact path='/jumbotron' component={Jumbotron} />
      <Route exact path='/Team' component={Team} />
      <Route exact path='/labkits' component={LabKits} />
      <Route exact path='/3DPrintingForm' component={PrintingSolids} />
      <Route exact path='/3DConsole' component={SolidsConsole} />
      <Route exact path='/2DPrinting' component={Printing} />
      <Route exact path='/Gear' component={Gear} />

      <Route
        component={function () {
          return <Home />
        }}
      />
    </Switch>
  </Router>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister()
