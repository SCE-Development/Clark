import React from 'react';
import './SponsorUs.css';
import { Button } from 'reactstrap';

const SponsorUs = () => {
  return (
    <div>
      <div className='sponsors'>
        <h1 >Our Sponsors make our club possible</h1>
      </div>
      <div>
        <img src='' alt='SCE Sponsors Background'/>
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
