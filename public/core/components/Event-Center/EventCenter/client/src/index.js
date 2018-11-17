import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import eventManager from './components/eventManager';
import LandingPage from './components/landingPage';
import announcementsPage from './components/announcementsPage';

//<App />, document.getElementById('root')

ReactDOM.render(
    <Router>
        <div>
            <Route exact path='/' component={App}/>
            <Route path='/eventManager' component={eventManager} />
            <Route path='/announcementsPage' component={announcementsPage} />
            <Route path='/landingPage' component={LandingPage} />

        </div>
    </Router>,
    document.getElementById('root')
);
