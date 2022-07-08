import React, { Component } from 'react';
import './home.css';
import HeroFrame from '../../Components/Frame/HeroFrame.js';
import Footer from '../../Components/Footer/Footer.js';
import { Button } from 'reactstrap';
import WhoWeAre from './Components/WhoWeAre';
import WhatWeDo from './Components/WhatWeDo';


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
          <div className='who-we-are'>
            <WhoWeAre />
          </div>
          <div className='what-we-do'>
            <WhatWeDo />
          </div>
          <Footer />
        </div>
      </>
    );
  }
}

export default Home;
