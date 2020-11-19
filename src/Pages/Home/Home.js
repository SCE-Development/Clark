import React, { Component } from 'react';
import 'aos/dist/aos.css';
import 'animate.css/animate.min.css';
import './home.css';
import Footer from '../../Components/Footer/Footer.js';
import { Row, Col } from 'reactstrap';

const SCEtitle = 'Software and \n Computer \n Engineering \n Society';

// The major block texts surrounding the sub block
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



const SCEtitle = 'Software and \n Computer \n Engineering \n Society';

const blockOneText = [
  { title: 'Our clubroom offers everything an SE ' },
  { title: 'or COMPE student could need.' },
  { title: <br /> },
  { title: 'We continue to offer resources to our  ' },
  { title: 'members despite being remote. ' },
  { title: 'Read further for more details!' },
];

const blockTwoText = [
  { title: 'Join our public accounts on Discord, Slack,' },
  { title: 'Instagram and more to connect with SCE members!' },
];

// The sub block texts
// ( the part with the empty clubroom in the background )
const subBlockOneText = [
  { title: 'As an SCE member, you will get many perks! ' },
  { title: <br /> },
  { title: 'We have conducted events with companies like' },
  { title: 'IBM, Tesla, SAP and more!' },
  { title: <br /> },
  { title: 'We have conducted events with companies like' },
  { title: 'IBM, Tesla, SAP and more!' }
];

const subBlockTwoText = [
  { title: 'Want to learn new technical skills? Or even develop ' },
  { title: 'your interpersonal skills?' },
  { title: <br /> },
  { title: 'SCE hosts a range of free workshops taught by peers,' },
  { title: 'our alumnis and SJSU faculty!' },
];

const subBlockThreeText = [
  { title: 'Join us for fun and exciting social events for different' },
  { title: 'occasions!' },
  { title: <br /> },
  { title: 'We host potlucks, movie nights, game nights and much more!' },
];

// Club social media icon links
const icons = [
  {
    link: ['https://www.linkedin.com/company', '/sjsusce/'].join(''),
    vector: [
      'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h',
      '14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3',
      'v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.7',
      '64 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5',
      ' 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.3',
      '96-2.586 7-2.777 7 2.476v6.759z'
    ].join('')
  },
  {
    link: 'https://discord.com/invite/STkT6mH',
    vector: [
      'M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.4',
      '52-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.4',
      '6-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 1',
      '5.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.',
      '728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2',
      '.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.09',
      '6-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444',
      '.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.03',
      '6-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824',
      ' 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.04',
      '8.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.38',
      '4 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.51',
      '6.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.97',
      '2.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.33',
      '2 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.22',
      '4-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.2',
      '24 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z'
    ].join('')
  },
  {
    link: 'https://www.instagram.com/sjsusce/',
    vector: [
      'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.91',
      '9 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.8',
      '49-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07',
      '-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.0',
      '58-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 ',
      '1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-',
      '3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.',
      '073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.7',
      '8 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.94',
      '8-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.9',
      '48 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.9',
      '8-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.75',
      '9-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163',
      'c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-',
      '4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.',
      '845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.',
      '439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
    ].join('')
  }
];

const subBlockOneText = [
  { title: 'As an SCE member, you will get inside scoops ' },
  { title: '& opportunities.' },
  { title: <br /> },
  { title: 'We have conducted events with companies like' },
  { title: 'IBM, Tesla, SAP and more!' }
];

const subBlockTwoText = [
  { title: 'Want to learn new technical skills? Or even develop ' },
  { title: 'your interpersonal skills?' },
  { title: <br /> },
  { title: 'SCE hosts a range of free workshops taught by peers,' },
  { title: 'our alumnis and SJSU faculty!' },
];

const subBlockThreeText = [
  { title: 'Join us for fun and exciting social events for different' },
  { title: 'occasions!' },
  { title: <br /> },
  { title: 'We host potlucks, movie nights, game nights and much more!' },
];

// useEffect(() => {
//   Aos.init({ duration: 2000 });
Aos.init({ duration: 2000 });
return (
  <>
    <div className='home'>

      {/* <Slideshow className='slideshow' />
          <Jumbotron /> */}
      <div class="groupPicContainer">
        <img class="groupPictureStyles" src='images/officers2019_2.jpg'
          alt="officersPic" style={{ width: '105%' }}></img>
      </div>
      <div class="sceLogo" data-aos="fade-out" >
        <img class="logo-styles"
          src='images/sce_logo_2.svg'
          alt="sce logo" style={{ width: '50%', float: 'right' }}></img>
      </div>

      <div className="sceTitle" data-aos="fade-out" >
        {SCEtitle}
      </div>
      <div class="contentContainer">
        <div className="block-space"></div>

        <div className="block-one">
          <Row>
            <Col>
              <div data-aos="fade-up"
                data-aos="fade-down">
                <img className="block-images"
                  src='images/resume-workshop.jpg'
                  alt="blockOneImg"
                  style={{ width: '40vw', marginLeft: '15%' }}></img>
              </div>
            </Col>
            <Col className="block-styles">
              <h1 className="leftalign">
                <span className="textBlock1-title">
                  Need a place to get things done?</span>
              </h1>
              <div class="textBlock1-text" >
                {blockOneText.map((title) => {
                  return (
                    <p className="blockText">
                      {title.title}</p>
                  );
                })}
              </div>
            </Col>
          </Row>
        </div>

        <div className="block-space"></div>
        <div className="clubRoomContainer">
          <p>
            <Row>
              <Col className="column" xs={3}>
                <div class="subBlock-title" data-aos="fade-up">
                  Tech Events
                    </div>
                <div class="subBlockContainer" data-aos="fade-left">
                  {subBlockOneText.map((title) => {
                    return (
                      <span className="subBlockText">{title.title}</span>
                    );
                  })}
                </div>
                <Col xs={3} >
                  <div class="subBlockContainer" data-aos="fade-up">
                    {subBlockTwoText.map((title) => {
                      return (
                        <span className="subBlockText">{title.title}</span>
                      );
                    })}
                  </div>
                </Col>
                <Col xs={3}>
                  <div class="subBlock-title" data-aos="fade-right">
                    Social Events
                    </div>
                  <div class="subBlockContainer" data-aos="fade-right">
                    {subBlockThreeText.map((title) => {
                      return (
                        <p className="subBlockText">{title.title}</p>
                      );
                    })}
                  </div>
                </Col>
                </Row>
              </p>
            </div>
          <div className="block-two">
            <Row>
              <Col className="block-styles">
                <h1>
                  <span class="textBlock2-title">
                    Want to know more?
                    </span>

                      return (
                        <a key={index} href={icon.link}>

                    <svg className='block2-icons' viewBox='0 0 24 24'>
                      <path fill='#484848' d={icon.vector} />
                    </svg>
                  </a>
                      );
                    })}
                  </div>

              </Col>
              <Col>
                <div data-aos="fade-up" data-aos="fade-down" >
                  <img className="block-images"
                    src='images/Tesla2.jpg'
                    alt="blockOneImg"
                    style={{ width: '45vw', marginRight: '15%' }}></img>
                </div>
              </Col>
            </Row>
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

            <div className="block-space"></div>


            {/* </div> */}


            <Footer />
          </div>


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
>>>>>>> Adds Group Pic and Title
=======
            {/* <div className='text-center'>
>>>>>>> Creates parallax scrolling effect for homepage
              <h1 className='display-4'>SCE Events Calendar</h1>{' '}
            </div>
            <p className='lead text-center'>
              {' '}
            Add SCE Calendar to your own by clicking the Google Calendar icon on
            the bottom right side!</p> */}

          {/* <div className='outer-div'>
>>>>>>> Adds Group Pic and Title
=======
            {/* <div className='outer-div'>
>>>>>>> Creates parallax scrolling effect for homepage
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
                        <p className="blockText">{title.title}</p>
                      );
                    })}
                  </div>
                </Container>
              </Col>
            </Row>
          </div>
          </Container >
  </Col >

  </Row >
  </div >
</Row >
  </div >
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
  </div >
  <div className="clubRoomContainer">
    <img class="groupPictureStyles" src='images/emptyclubroom.png'
      alt="officersPic" style={{ width: '105%' }}></img>
            </div>

{/* The second major block: "Want to know more?" */ }
            <div className="block-two">
              <Row>
                <Col className="block-styles">
                  <h1>
                    <span class="textBlock2-title">
          Want to know more?
                    </span>
                  </h1>
                  <div class="textBlock2-text">
                    {blockTwoText.map((title) => {
                      return (
                        <p className="blockText">{title.title}</p>
                      );
                    })}
                  </div>

                  {/* Icons div */}
                  <div className="icons-container">
                    {icons.map((icon, index) => {
                      return (
                        <a key={index} href={icon.link}>

                          <svg className='block2-icons' viewBox='0 0 24 24'>
                            <path fill='#484848' d={icon.vector} />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                </Col>
                <Col>
                  <div data-aos="fade-up" data-aos="fade-down" >
                    <img className="block-images"
                      src='images/Tesla2.jpg'
                      alt="blockOneImg"
                      style={{ width: '45vw', marginRight: '15%' }}></img>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="block-space"></div>

            <div className="block-space"></div>


{/* </div> */ }


{/* </div> */ }


<Footer />
          </div >
        </div >
  <Footer />
          </div >
        </div >
      </>
    );
  }
}

export default Home;
