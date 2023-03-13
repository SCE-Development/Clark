import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import './footer.css';
import DiscordIcon from './Icons/DiscordIcon';
import LinkedinIcon from './Icons/LinkedinIcon';
import FacebookIcon from './Icons/FacebookIcon';
import InstagramIcon from './Icons/InstagramIcon';
import GitHubIcon from './Icons/GitHubIcon';
import YouTubeIcon from './Icons/YouTubeIcon';
import FooterModal from './FooterModal';



export default () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <head>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.3/css/all.css"></link>
      </head>
      <div className='text-box'>
        <h1 className='text-box-header'>
          Contact Us<br></br>
          <ul className='list'>
            <li className='mail'> 

              {/* Span Is to display an svg of an envelope  */}
              <span class="svg"><i class="fas fa-envelope"></i></span> 

              General Inquries
              <li className='sub-list'>
                <p style={{color: 'rgb(172, 172, 172)', fontWeight: 'bold'}}>Akshit Sharma</p>
                <p style={{fontSize: '0.75rem'}}>
                    <a style={{color:'gray'}} href="mailto:akshit.sharma@sjsu.edu">akshit.sharma@sjsu.edu</a>
                </p>
              </li>

              {/* Span Is to display an svg of a suitcase  */}
              <span class="svg"><i class="fas fa-suitcase"></i></span> 

              Sponsor and Relations
              <li className='sub-list'>
                  <p style={{color: 'rgb(172, 172, 172)', fontWeight: 'bold'}}>Jessabelle Ramos</p>
                  <p style={{fontSize: '0.75rem'}}>
                    <a href="mailto:jessabelle.ramos@sjsu.edu" style={{color:'gray'}}>jessabelle.ramos@sjsu.edu</a>
                  </p>
              </li>
              <li className='sub-list'>
                <p style={{color: 'rgb(172, 172, 172)', fontWeight: 'bold'}}>Abbigel Palad</p>
                <p style={{fontSize: '0.75rem'}}>
                    <a href="mailto:abegail.palad@sjsu.edu" style={{color:'gray'}}>abegail.palad@sjsu.edu</a>
                </p>
              </li>

            </li>
          </ul>
        </h1>
      </div>
      <img
        src="images/getInTouch.png"
        alt="SCE What We Do"
        className='get-in-touch'
      />
      <footer className='footer-wrap bg-dark text-white p-4'>
        <Row  className='footer-text align-items-center justify-content-center'>
          <div className='social-media'>
            <DiscordIcon/>
            <InstagramIcon/>
            <GitHubIcon/>
          </div>
          <p id='footer-note' style={{marginTop: '1rem', fontSize: '0.8rem'}}>Brought to you by SCE Dev-Team</p>
        </Row>
      </footer>
    </>
  );
};
