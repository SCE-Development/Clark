import React from 'react';
import './SponsorsLogos.css';

const SponsorsLogos = () => {
  return (
    <div className='sponosors-logos'>
      <div className='container-sponsors-logos'>
        <div className='sponsors-row-1'>
          <img className='cisco-img'
            src='images/cisco.png'
            alt='Sponsor Cisco'/>
          <img className='echo3d-img'
            src='images/echo3D.png'
            alt='Sponsor Echo3D'/>
          <img className='google-img'
            src='images/google.png'
            alt='Sponsor Google'/>
        </div>
        <div className='sponsors-row-2'>
          <img className='balsamiq-img'
            src='images/balsamiq.png'
            alt='Sponsor Balsamiq'/>
          <img className='xircle-img'
            src='images/xircle.png'
            alt='Sponsor Xircle'/>
        </div>
        <div className='sponsors-row-3'>
          <img className='microsoft-img'
            src='images/microsoft.png'
            alt='Sponsor Microsoft'/>
          <img className='tesla-img'
            src='images/tesla.png'
            alt='Sponsor Tesla'/>
        </div>
      </div>
    </div>
  );
};

export default SponsorsLogos;
