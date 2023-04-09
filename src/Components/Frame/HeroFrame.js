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

  let heroImage = 'https://user-images.githubusercontent.com' +
  '/63530023/230752289-defefe87-354d-4fcc-9e60-17e4356ba17e.png';
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
        src={heroImage}
        width='100%'
        className='hero-image'
      />
    </>
  );
}
export default HeroFrame;
