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
    <Card className="bg-light card" style={{ borderRadius: 18 }}>
      <CardBody className="circles">
        <div className="red"></div>
        <div className="orange"></div>
        <div className="green"></div>
      </CardBody>
	    <div className='image-header'>
        <img className="hero-logo" src='favicon.ico' alt="hero-logo" />
        <div>
          {icons.map((icon, index) => {
            return (
              <a key={index} href={icon.link} className='text-dark ml-3 name'>
                {icon.title}
              </a>
            );
          })}
        </div>
        <div className="text-dark more">...</div>
      </div>
      <img
        alt="Card image cap"
        src="images/sce-hero.png"
        width="100%"
        className="hero-image"
      />
    </Card>
  );
}
export default HeroFrame;
