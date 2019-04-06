import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home/Home/Home.js';
import NavBar from '../Home/Navbar/NavBar.js';
import Test from './Test.js';
import Events from '../Events/announcements/announcementsPage.jsx';
import EventManager from '../Events/manager/eventManager.jsx';
import Benefits from '../Benefits/benefitsCode/App.js';
import LabKits from '../LabKits/App.js';
import PrintingSolids from '../3DPrinting/src/app3DPrintForm.js';
import SolidsConsole from '../3DPrintingConsole/src/app3DConsole.js';
import MembershipApplication from '../MembershipApplication/membershipApplication.jsx';
import Jumbotron from '../Jumbotron/App.js';
import TheTeam from '../TheTeam/App.js';
import Printing from '../2DPrinting/App.js';

class Router extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false, //this will be used for login API later using componentDidMount()
    }
  }
  render() {
    const Router = () => (
      <div>
        <NavBar isLoggedIn={this.state.isLoggedIn}/>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/test' component = {Test}/>
          <Route exact path='/events' component = {Events}/>
          <Route exact path='/eventsManager' component = {EventManager}/>
          <Route exact path='/membershipApplication' component = {MembershipApplication}/>
          <Route exact path='/benefits' component = {Benefits}/>
          <Route exact path='/jumbotron' component = {Jumbotron}/>
          <Route exact path='/theTeam' component = {TheTeam}/>
          <Route exact path='/labkits' component = {LabKits}/>
          <Route exact path='/3DPrintingForm' component = {PrintingSolids}/>
          <Route exact path='/3DConsole' component = {SolidsConsole}/>
          <Route exact path='/2DPrinting' component = {Printing}/>
          <Route component={Home}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <Router/>
      </Switch>
    );
  }
}

export default Router;
