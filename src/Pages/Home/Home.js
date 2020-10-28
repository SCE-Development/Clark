import React, { Component } from 'react';
import './home.css';
//import Slideshow from '../../Components/Slideshow/Slideshow.js';
import Footer from '../../Components/Footer/Footer.js';
//import Jumbotron from '../../Components/Jumbotron/Jumbotron.js';
//import Iframe from 'react-iframe';
import { Row, Col, Container } from 'reactstrap';
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

const blockOneText = [
  { title: 'Our clubroom offers everything a software or computer' },
  { title: 'engineering student could need.' },
  { title: <br /> },
  { title: 'We continue to offer resources to our members regardless' },
  { title: 'of being online. Join our discord for more details!' }
];

const blockTwoText = [
  { title: 'Join our public accounts on Discord, Slack,' },
  { title: 'Instagram and more today, and connect with SCE members' },
];

const sceTitle = [
  { title: "Software and \n" },
  { title: "Computer" },
  { title: "Engineering" },
  { title: "Society" }
]

const blockTwoText = [
  { title: 'Join our public accounts on Discord, Slack,' },
  { title: 'Instagram and more today, and connect with SCE members' },
];

const text = 'Software and \n Computer \n Engineering \n Society';

class Home extends Component {
  render() {
    return (
      <>
        <div className='home'>

          {/* <Slideshow className='slideshow' />
          <Jumbotron /> */}
          <div class="groupPicContainer">
            <img class="groupPictureStyles" src='images/officers2019_2.jpg'
              alt="officersPic" style={{ width: '105%' }}></img>
          </div>
          <div class="sceLogo">
            <img class="logo-styles" src="/static/media/sce_logo.1f644918.png"
              alt="sce logo" style={{ width: '50%', float: 'right' }}></img>
          </div>
          <div className="sceTitle">
            {text}
          </div>




          <div class="contentContainer">

            <div className="eventsContainer">
              <Container>
                <h1>------------------------</h1>
                <h1>EVENTS!!!!</h1>
                <h1>------------------------</h1>

              </Container>
            </div>
            {/* <div class="sceTitle">
              {sceTitle.map((item) => {
                return (
                  <text>{item.title + "\n"}</text>
                );
              })}
            </div> */}

            {/* <div className='text-center'>
              <h1 className='display-4'>SCE Events Calendar</h1>{' '}
            </div>
            <p className='lead text-center'>
              {' '}
            Add SCE Calendar to your own by clicking the Google Calendar icon on
            the bottom right side!</p> */}

            {/* <div className='outer-div'>
              <div className='inner-div'>
                <Iframe
                  // Unable to breka up iframe url
                  // eslint-disable-next-line
                  url='https://calendar.google.com/calendar/b
                  /4/embed?showTitle=0&amp;showPrint=0&amp;showTabs=
                  0&amp;showCalendars=0&amp;showTz=0&amp;height=600&amp
                  ;wkst=1&amp;bgcolor=%23ffffff&amp;src=llv828585faitko
                  1m2nh39s3js%40group.calendar.google.com&amp;color=%
                  23182C57&amp;ctz=America%2FLos_Angeles'
                  className='calendar'
                  allowFullScreen
                />
              </div>
            </div> */}
            <div className="block-space"></div>

            <div className="block-one">
              <Row>
                <Col>
                  <img src='images/block1.png' alt="blockOneImg"
                    style={{ width: '100%' }}></img>
                </Col>
                <Col>
                  <Container className="textOne">

                    <h1 class="textBlock1-title">
                      Need a place to get things done?
                    </h1>
                    <div class="textBlock1-text">
                      {blockOneText.map((title) => {
                        return (
                          <p className="text">{title.title}</p>
                        );
                      })}
                    </div>
                  </Container>
                </Col>
              </Row>
            </div>
            <div className="block-space"></div>

            <div className="block-two">
              <Row>
                <Col>
                  <h1 class="textBlock2-title">Would like to know more?</h1>
                  <div class="textBlock2-text">
                    {blockTwoText.map((title) => {
                      return (
                        <p className="text">{title.title}</p>
                      );
                    })}
                  </div>
                  <div className="linksIcons">
                    <a href='https://www.linkedin.com/company/sjsu-software
          -computer-engineering-society/'>
                      <svg width='50px' height='50px' viewBox='0 0 24 24'>
                        <path
                          fill='#484848'
                          d='M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0
                          0,1 3,
                19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,
                9.94C14.39,9.94 13.4,10.46 12.92,
                11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,
                12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,
                8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,
                5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,
                8.56M8.27,18.5V10.13H5.5V18.5H8.27Z'
                        />
                      </svg>
                    </a>
                    <a href='https://www.facebook.com/sjsusce/'>
                      <svg width='50px' height='50px' viewBox='0 0 24 24'>
                        <path
                          fill='#484848'
                          d='M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2
                          0 0,1 3,
                19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,
                8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z'
                        />
                      </svg>
                    </a>
                  </div>
                </Col>
                <Col>
                  <img src='images/block2.png' alt="blockOneImg"
                    style={{ width: '100%' }}></img>
                </Col>
              </Row>
            </div>
            <div className="clubRoomContainer">
              <img class="groupPictureStyles" src='images/emptyclubroom.png'
                alt="officersPic" style={{ width: '105%' }}></img>
            </div>


            <Footer />
          </div>
        </div>
      </>
    );
  }
}

export default Home;
