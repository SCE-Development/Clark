import React, { Component } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'animate.css/animate.min.css';
import './home.css';
import Footer from '../../Components/Footer/Footer.js';
import { Row, Col } from 'reactstrap';
import { icons } from './IconConstants';

const SCEtitle = 'Software and \n Computer \n Engineering \n Society';

// The major block texts surrounding the sub block
const blockOneText =
  '\n\nOur clubroom offers everything a Software Engineering ' +
  'or Computer Engineering student could need. \n\n' +
  'We continue to offer resources to our ' +
  'members despite being remote. \n\n' +
  'Read further for more details!';

const blockTwoText =
  '\n\nJoin our public accounts on Discord, Slack, ' +
  'Instagram and more to connect with SCE members!';

// The sub block texts
// ( the part with the empty clubroom in the background )
const subBlockOneText =
  'As an SCE member, you will get inside scoops & opportunities.' +
  '\n\nWe have conducted events with companies like ' +
  'IBM, Tesla, SAP and more!';

const subBlockTwoText = 'Want to learn new technical skills? Or develop ' +
  'your interpersonal skills? \n\n' +
  'SCE hosts a range of free workshops taught by peers, ' +
  'our alumni and SJSU faculty!';

const subBlockThreeText =
  'Join us for fun and exciting social events for different occasions!' +
  '\n\nWe host potlucks, movie nights, game nights and much more!';


class Home extends Component {
  render() {
    AOS.init();
    // AOS.init({
    //   // Global settings:
    //   debounceDelay: 50, // the delay on debounce used while resizing window (advanced)


    //   // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    //   once: false, // whether animation should happen only once - while scrolling down
    //   mirror: true, // whether elements should animate out while scrolling past them

    // });
    return (
      <>

        <div className='home'>

          {/* This container is for the SCE offciers picture and title */}
          <div className="groupPicContainer">
            <img className="groupPictureStyles"
            id="grouPicture"
            src='images/officers2019_2.jpg'
            alt="officersPic"></img>
          </div>
          <div className="sceLogo"
            data-aos="fade-down"
            data-aos-duration="1000" >
            <div className="img-container">
              <img className="logo-styles"
                src='images/sce_logo_2.svg'
                alt="sce logo"
              ></img>
            </div>
          </div>
          <div className="sceTitle-div" data-aos="fade-down"
            data-aos-duration="1000" >
              <div className="sceTitle-style">
                {SCEtitle}
                </div>
          </div>

          {/* This contains all the content regarding the club,
         what we have to offer and social media links */}
          <div className="contentContainer">

            <div className="block-space" />

            {/* The first major block: "Need a place to get things done?" */}
            <div className="block-one aos-item">
              <Row>
                <Col className="col-images">
                  <div data-aos="fade-down"
                    data-aos-easing="linear"
                    data-aos-anchor-placement="bottom-bottom"
                    data-aos-duration="500" >
                    <img className="block-images"
                      id = "block-images"
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
                  <div className="textBlock1-text" >
                    <span className="blockText">{blockOneText}</span>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="block-space" />

            {/* The sub block section */}
            <div className="clubRoomContainer">
              <Row>
                <Col className="col-cr1" xs={3}>
                  <div className="subBlock-title" data-aos="fade-up"
                    data-aos-duration="1000" >
                    Tech Events
                  </div>
                  <div className="subBlockContainer"
                    data-aos="fade-up"
                    data-aos-duration="2000" >
                    <span className="subBlockText">{subBlockOneText}</span>
                  </div>
                </Col>
                <Col className="col-cr2" xs={3} >
                  <div className="subBlock-title" data-aos="fade-up"
                    data-aos-duration="1000" >
                    Workshops
                  </div>
                  <div className="subBlockContainer"
                    data-aos="fade-up"
                    data-aos-duration="2000" >
                    <span className="subBlockText">{subBlockTwoText}</span>
                  </div>
                </Col>
                <Col className="col-cr3" xs={3}>
                  <div className="subBlock-title" data-aos="fade-up"
                    data-aos-duration="1000" >
                    Social Events
                  </div>
                  <div className="subBlockContainer"
                    data-aos="fade-up"
                    data-aos-duration="2000" >
                    <span className="subBlockText">{subBlockThreeText}</span>
                  </div>
                </Col>
              </Row>

              <div className="screen-cr">
                <div className="screen-cr-sub">
                  <b>Tech Events</b><br />
                  <span className="screen-cr-body">{subBlockOneText}</span>
                </div>
                <div className="special-margins"></div>

                <div className="screen-cr-sub" >
                  <b>Diverse Workshops</b><br />
                  <span className="screen-cr-body">{subBlockTwoText}</span> 
                </div>
                <div className="special-margins"></div>

                <div className="screen-cr-sub" >
                  <b>Social Events</b><br />
                  <span className="screen-cr-body">{subBlockThreeText}</span>
                </div>
              </div>
              
            </div>

            {/* The second major block: "Want to know more?" */}
            <div className="block-two">
              <Row>
                <Col className="block-styles">
                  <h1>
                    <span className="textBlock2-title">
                      Want to know more?
                    </span>
                  </h1>
                  <div className="textBlock2-text" >
                    <span className="blockText">{blockTwoText}</span>
                  </div>

                  {/* Icons div */}
                  <div className="icons-container"
                    data-aos="fade-right"
                    data-aos-duration="1000">
                    {icons.map((icon, index) => {
                      return (
                        <a key={index} href={icon.link}>
                          <svg className='block2-icons' viewBox='0 0 24 24'>
                            <path fill='#ff8c66' d={icon.vector} />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                </Col>
                <Col className="col-images">
                  <div data-aos="fade-down"
                    data-aos-easing="linear"
                    data-aos-anchor-placement="bottom-bottom"
                    data-aos-duration="500">
                    <img className="block-images"
                      src='images/Tesla2.jpg'
                      alt="blockOneImg"
                      style={{ width: '45vw' }} />
                  </div>
                </Col>
              </Row>
              
            </div>
            <div className="block-space" />
            <Footer />
            
          </div>
        </div>
      </>
    );
  }
}

export default Home;
