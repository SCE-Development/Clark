import React, { Component } from 'react';
import './home.css';
import HeroFrame from '../../Components/Frame/HeroFrame.js';
import Footer from '../../Components/Footer/Footer.js';
import WhoWeAre from './Components/WhoWeAre';
import WhatWeDo from './Components/WhatWeDo';

class Home extends Component {
  render() {
    return (
      <>
        <div className='home bg-white text-white'>
          {/* Initial Image */}
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
