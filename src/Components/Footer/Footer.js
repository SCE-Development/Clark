import React, { useState } from 'react';
import { Row } from 'reactstrap';
import './footer.css';
import DiscordIcon from './Icons/DiscordIcon';
import InstagramIcon from './Icons/InstagramIcon';
import GitHubIcon from './Icons/GitHubIcon';




export default () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  let getInTouch = 'https://user-images.githubusercontent.com' +
    '/63530023/230752230-f8c42972-a0cc-4dfb-96fb-f44bb7d935c4.png';

  return (
    <>
      <head>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.3/css/all.css">
        </link>
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
                <p
                  style=
                    {{color: 'rgb(172, 172, 172)'
                      , fontWeight: 'bold'}}>
                    Akshit Sharma
                </p>
                <p style={{fontSize: '0.75rem'}}>
                  <a
                    style={{color:'gray'}}
                    href="mailto:akshit.sharma@sjsu.edu">
                      akshit.sharma@sjsu.edu
                  </a>
                </p>
              </li>

              {/* Span Is to display an svg of a suitcase  */}
              <span class="svg"><i class="fas fa-suitcase"></i></span>

              Sponsor and Relations
              <li className='sub-list'>
                <p style={{color: 'rgb(172, 172, 172)', fontWeight: 'bold'}}>Pablo Nava Barrera</p>
                <p style={{fontSize: '0.75rem'}}>
                  <a
                    href="mailto:pablo.navabarrera@sjsu.edu"
                    style={{color:'gray'}}>
                      pablo.navabarrera@sjsu.edu
                  </a>
                </p>
              </li>
              <li className='sub-list'>
                <p style={{color: 'rgb(172, 172, 172)', fontWeight: 'bold'}}>Sarah Singh</p>
                <p style={{fontSize: '0.75rem'}}>
                  <a
                    href="mailto:sarah.singh@sjsu.edu"
                    style={{color:'gray'}}>
                      sarah.singh@sjsu.edu
                  </a>
                </p>
              </li>

            </li>
          </ul>
        </h1>
      </div>
      <img
        src={getInTouch}

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
          <p
            id='footer-note'
            style={{marginTop: '1rem', fontSize: '0.8rem'}}>
              Brought to you by SCE Dev-Team
          </p>
        </Row>
      </footer>
    </>
  );
};
