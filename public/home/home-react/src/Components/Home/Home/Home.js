import React, { Component, Button } from 'react';
import './Home.css';
import Slideshow from '../Slideshow/Slideshow.js';
import Footer from '../Footer/Footer.js';
import Benefits from '../../Benefits/benefitsCode/App';
import Jumbotron from '../../Jumbotron/App.js';
import Iframe from 'react-iframe';
//import Calendar from '../../Calendar/App.js'; <Calendar/>

/*
		<Iframe url="https://calendar.google.com/calendar/embed?src=llv828585faitko1m2nh39s3js%40group.calendar.google.com&ctz=America%2FLos_Angeles"
        width="1000px"
        height="800px"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
        allowFullScreen/> 


        <Iframe url="https://calendar.google.com/calendar/b/4/embed?showTitle=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;src=llv828585faitko1m2nh39s3js%40group.calendar.google.com&amp;color=%23182C57&amp;ctz=America%2FLos_Angeles" style="border-width:0" width="1000" height="850" frameborder="0" scrolling="no"/>
        */

class Home extends Component {
 render() {
   return (
      <div className="home">
       <Slideshow className="slideshow"/>
       <Jumbotron/>

      <h1 className="text-center"><h1 className="display-4">SCE Events Calendar</h1> </h1>	
      <p className="lead" className="text-center"> Add SCE Calendar to your own by clicking the Google Calendar icon on the bottom right side!</p>

      <div class="outer-div"> 
          <div class="inner-div">
              <Iframe url="https://calendar.google.com/calendar/b/4/embed?showTitle=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;src=llv828585faitko1m2nh39s3js%40group.calendar.google.com&amp;color=%23182C57&amp;ctz=America%2FLos_Angeles"
              width="1000px"
              height="800px"
              id="myId"
              className="myClassname"
              display="initial"
              position="relative"
              allowFullScreen/> 
          </div>
      </div>
       <Benefits className="benefits"/>
       <Footer/>
      </div>
   );
 }
}

export default Home;
