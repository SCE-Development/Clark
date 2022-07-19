import React from 'react';
import './SponsorUs.css';
import { Button } from 'reactstrap';

const SponsorUs = () => {
  return (
    <div className='sponsor-us'>
        <img className='sponsors-img' 
          src='images/what-we-do-image.png' 
          alt='SCE Sponsors Background'/>
        <div className='sponsors-header'>
          <h1>Our Sponsors make our club possible</h1>
        </div>
        <div className='sponsor-us-button'>
          <a href='/register'>
            <Button outline color='primary' id='Sponsor-us-btn'
              // copied from home
              style={{width:'170px', border:'3px solid',
                borderRadius:8, fontSize:'20px'}}>Sponsor Us</Button>
          </a>
        </div>
    </div>
  );
};

export default SponsorUs;
