import React, { Component } from 'react';
import './Home.css';
import NavBar from '../Navbar/NavBar.js';
import Slideshow from '../Slideshow/Slideshow.js';
import Footer from '../Footer/Footer.js';

class Home extends Component {
 constructor(props) {
   super(props);

   this.state = {
     isLoggedIn: false, //this will be used for login API later using componentDidMount()
   }
 }
 render() {
   return (
     <div className="home">
       <NavBar className="navbar" isLoggedIn={this.state.isLoggedIn}/>
       <Slideshow/>
       <Footer/>
     </div>
   );
 }
}

export default Home;
