import React, { Component } from 'react';
import './Home.css';
import Slideshow from '../Slideshow/Slideshow.js';
import Footer from '../Footer/Footer.js';
import Benefits from '../../Benefits/benefitsCode/App';

class Home extends Component {
 render() {
   return (
     <div className="home">
       <Slideshow className="slideshow"/>
       <Benefits className="benefits"/>
       <Footer/>
     </div>
   );
 }
}

export default Home;
