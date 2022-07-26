import React from 'react';
import {
  Card,
  CardBody
} from 'reactstrap';
import './HeroFrame.css';

function HeroFrame() {
  const icons = [
    {
      link: 'https://www.instagram.com/sjsusce/',
      title: 'sjsu.sce'
    }
  ];
  return(
    <Card className='bg-light hero-frame'
	 style={{ borderRadius: 18 }}>
      <CardBody className='circles'>
        <div className='red hide-this'></div>
        <div className='orange hide-this'></div>
        <div className='green hide-this'></div>
      </CardBody>
	    <div className='image-header hide-this'>
        <img
          className='hero-logo hide-this'
          src='favicon.ico'
          alt='hero-logo' />
        <div>
          {icons.map((icon, index) => {
            return (
              <a key={index} href={icon.link} className='text-dark ml-3 name'>
                {icon.title}
              </a>
            );
          })}
        </div>
        <div className='text-dark more hide-this'>...</div>
      </div>
      <img
        alt='Card image cap'
        src='images/sce-hero.webp'
        width='100%'
        className='hero-image'
      />
    </Card>
  );
}
export default HeroFrame;
