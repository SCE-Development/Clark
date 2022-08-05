import React from 'react';
import './SponsorsLogos.css';

const SponsorsLogos = () => {
  return (
    <div className='sponosors-logos'>
      <div className='container-sponsors-logos'>
        <div className='sponsors-row-1'>
          <div className='cisco-img'>
            <img src='images/cisco.png'
              alt='Sponsor Cisco'/>
          </div>
          <div className='echo3d-img'>
            <img src='images/echo3D.png'
              alt='Sponsor Echo3D'
              className='hide-images'/>
          </div>
          <div className='google-img'>
            <img src='images/google.png'
              alt='Sponsor Google'/>
          </div>
        </div>
        <div className='sponsors-row-2'>
          <div className='balsamiq-img'>
            <img src='images/balsamiq.png'
              alt='Sponsor Balsamiq'
              className='hide-images'/>
          </div>
          <div className='xircle-img'>
            <img src='images/xircle.png'
              alt='Sponsor Xircle'
              className='hide-images'/>
          </div>
        </div>
        <div className='sponsors-row-3'>
          <div className='microsoft-img'>
            <img src='images/microsoft.png'
              alt='Sponsor Microsoft'/>
          </div>
          <div className='tesla-img'>
            <img src='images/tesla.png'
              alt='Sponsor Tesla'/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorsLogos;
