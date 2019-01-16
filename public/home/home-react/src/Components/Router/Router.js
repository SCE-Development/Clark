import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home/Home/Home.js';
import NavBar from '../Home/Navbar/NavBar.js';
import Test from './Test.js';
import Events from '../Events/announcements/announcementsPage.jsx';
import EventManager from '../Events/manager/eventManager.jsx';
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
