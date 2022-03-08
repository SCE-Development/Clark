import React, { Component } from 'react';
import './home.css';
import HeroFrame from '../../Components/Frame/HeroFrame.js';
import Footer from '../../Components/Footer/Footer.js';
import Iframe from 'react-iframe';
import { Button } from 'reactstrap';


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

class Home extends Component {
  render() {
    return (
      <>
        <div className='home bg-black text-white'>

          <div className='text-header'>
            <h1>Software and Computer </h1>
            <h1>Engineering Society</h1>
          </div>

          <div className='text-content'>
            <p>Empowering students through support in academics, projects,</p>
            <p> and professional development.</p>
          </div>

          <div className='join-sce'>
            <a href='/register'>
              <Button outline color="primary" id='joinsce-btn'
                style={{width:'170px', border:'3px solid',
                  borderRadius:8, fontSize:'20px'}}>Join SCE</Button>
            </a>
          </div>
          <div className='home-hero-frame text-center mx-auto'>
            <HeroFrame />
          </div>
          <div className='text-center'>
            <h1 className='display-4'>SCE Events Calendar</h1>{' '}
          </div>
          <p className='lead text-center'>
            {' '}
            Add SCE Calendar to your own by clicking the Google Calendar icon on
            the bottom right side!
          </p>

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
      </>
    );
  }
}

export default Home;
