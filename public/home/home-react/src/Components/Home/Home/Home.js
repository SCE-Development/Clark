import React, { Component, Button } from 'react';
import './Home.css';
import Slideshow from '../Slideshow/Slideshow.js';
import Footer from '../Footer/Footer.js';
import Benefits from '../../Benefits/benefitsCode/App';
import Jumbotron from '../../Jumbotron/App.js';

class Home extends Component {
 render() {
   return (
     <div className="home">
       <Slideshow className="slideshow"/>
       <Jumbotron/>
       <Benefits className="benefits"/>
       <Footer/>
     </div>
   );
 }
}

export default Home;
