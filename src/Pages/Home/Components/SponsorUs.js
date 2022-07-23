import React from 'react';
import './SponsorUs.css';
import { Button } from 'reactstrap';

const SponsorUs = () => {
  return (
    <div className='sponsor-us'>
        <img className='sponsors-img' 
          src='images/sponsor-us-img.jpg' 
          alt='SCE Sponsors Background'/>
        <div className='sponsors-header'>
          <h1>Our Sponsors make our club possible</h1>
        </div>
        <div className='sponsor-us-button'>
          <a href='https://www.canva.com/design/DAE2elflots/share/preview?token=_b1m7H5G7FeykfkUaR9JOw&role=EDITOR&utm_content=DAE2elflots&utm_campaign=designshare&utm_medium=link&utm_source=sharebutton#2'>
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
