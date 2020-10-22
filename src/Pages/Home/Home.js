import React, { Component } from 'react';
import './home.css';
import Slideshow from '../../Components/Slideshow/Slideshow.js';
import Footer from '../../Components/Footer/Footer.js';
import Jumbotron from '../../Components/Jumbotron/Jumbotron.js';
import Iframe from 'react-iframe';
import UserNavbar from '../../Components/Navbar/UserNavbar.js';
// import Calendar from '../../Calendar/App.js'; <Calendar/>

/*
  <Iframe url="https://calendar.google.com/calendar/embed?src=
  llv828585faitko1m2nh39s3js%40group.calendar.google.co
  m&ctz=America%2FLos_Angeles"
        width="1000px"
        height="800px"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
        allowFullScreen/>

        <Iframe url="https://calendar.google.com/calendar/b/4/embed?showTitle=
        0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;
        height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;src=llv828585faitko1
        m2nh39s3js%40group.calendar.google.com&amp;color=%23182C57&amp;ctz=
        America%2FLos_Angeles" style="border-width:0" width="1000"
        height="850" frameborder="0" scrolling="no"/>
        */

const sceTitle = [
  { title: "Software and \n" },
  { title: "Computer" },
  { title: "Engineering" },
  { title: "Society" }
]
const text = 'Software and \n Computer \n Engineering \n Society';

class Home extends Component {
  render() {
    return (
      <>
        <div className='home'>

          {/* <Slideshow className='slideshow' />
          <Jumbotron /> */}
          <div class="groupPicContainer">
            <img src='images/officers2019.jpg' alt="officersPic" style={{ width: "100%" }}></img>
            <div class="sceLogo">
              <img id="logo-image" src="/static/media/sce_logo.1f644918.png" alt="sce logo" style={{ width: "50%" }}></img>
            </div>
            <div className="sceTitle">
              {text}
            </div>
            {/* <div class="sceTitle">
              {text.split("\n").map((item) => {
                return (
                  <text>{item}</text>
                );
              })}
            </div> */}
          </div>
          <div class="contentContainer">
            <div className='text-center'>
              <h1 className='display-4'>SCE Events Calendar</h1>{' '}
            </div>
            <p className='lead text-center'>
              {' '}
            Add SCE Calendar to your own by clicking the Google Calendar icon on
            the bottom right side!</p>

            <div className='outer-div'>
              <div className='inner-div'>
                <Iframe
                  // Unable to breka up iframe url
                  // eslint-disable-next-line
                  url='https://calendar.google.com/calendar/b/4/embed?showTitle=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;src=llv828585faitko1m2nh39s3js%40group.calendar.google.com&amp;color=%23182C57&amp;ctz=America%2FLos_Angeles'
                  className='calendar'
                  allowFullScreen
                />
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  }
}

export default Home;
