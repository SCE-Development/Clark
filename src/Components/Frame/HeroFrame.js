import React from 'react';
import './HeroFrame.css';
import { Button } from 'reactstrap';

function HeroFrame() {
  const icons = [
    {
      link: 'https://www.instagram.com/sjsusce/',
      title: 'sjsu.sce'
    }
  ];
  return(
    <>
      <div className='text-box'>
        <h1 className='hero-text'>
          Software Computer and Engineering Society
          <p className='hero-subtext'>SJSU's Largest Engineering Club</p>
        </h1>
        <div className='join-sce'>
          <a href='/register'>
            <Button id='joinsce-btn'
              style={{width:'170px', opacity: '0.9',
                border: '0px', borderRadius:4,
                fontSize:'20px', textAlign:'center',
                backgroundColor:'#0C1E2F', color:'white'}}>
                Join SCE
            </Button>
          </a>
        </div>
      </div>
      <img
        alt='Card image cap'
        src='images/sce-hero.webp'
        width='100%'
        className='hero-image'
      />
    </>
  );
}
export default HeroFrame;
