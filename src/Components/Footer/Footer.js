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
    <footer className='footer-wrap bg-dark text-white p-4'>
      <Row className='footer-text align-items-center justify-content-center'>
        <Col id='left-col'>
          <b>Software & Computer Engineering Society</b>
          <ul>
            <li>
              San Jose State University
            </li>
            <li>
              Charles W. Davidson College of Engineering
            </li>
            <li>
              Room: ENGR 294
            </li>
          </ul>
        </Col>
        <div className='contact-us'>
          <Button
            outline color="primary"
            className='contact-us-btn'
            onClick={togglePopup}
          >Contact Us</Button>
        </div>
        {
          isOpen && <FooterModal handleClose={togglePopup} />
        }
        <div className='social-media'>
          <LinkedinIcon/>
          <FacebookIcon/>
          <InstagramIcon/>
          <DiscordIcon/>
          <GitHubIcon/>
          <YouTubeIcon/>
        </div>
        <p id='footer-note'>Brought to you by SCE Dev-Team</p>
      </Row>
    </footer>
  );
};
