import React, { Component } from 'react';
import './Home.css';
import Slideshow from '../Slideshow/Slideshow.js';
import Footer from '../Footer/Footer.js';

class Home extends Component {
 render() {
   return (
     <div className="home">
       <Slideshow/>
       <Footer/>
     </div>
   );
 }
}

export default Home;
