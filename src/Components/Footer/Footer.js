import React from 'react';
import { Row, Col } from 'reactstrap';
import './footer.css';
import DiscordIcon from './Icons/DiscordIcon';
import LinkedinIcon from './Icons/LinkedinIcon';
import FacebookIcon from './Icons/FacebookIcon';
import InstagramIcon from './Icons/InstagramIcon';

export default () => {
  return (
    <footer className='text-left bg-dark text-white p-4'>
      <Row className='footer-text'>
        <Col>
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
        <Col>
          <b>Contact</b>
          <ul>
            <li>
              General: <a href='mailto:asksce@gmail.com'>asksce@gmail.com</a>
            </li>
            <li>President:{' '}
              <a href='mailto:sce.sjsu@gmail.com'>sce.sjsu@gmail.com</a>
            </li>
            <li>
              Vice-President:{' '}
              <a href='mailto:sce.sjsu@gmail.com'>sce.sjsu@gmail.com</a>
            </li>
            <li>
              Public Relations:{' '}
              <a href='mailto:pr.sce.sjsu@gmail.com'>pr.sce.sjsu@gmail.com</a>
            </li>
          </ul>
        </Col>
        <Col id='social-media'>
          <LinkedinIcon/>
          <FacebookIcon/>
          <InstagramIcon/>
          <DiscordIcon/>
          <p>Brought to you by SCE Dev-Team</p>
        </Col>
      </Row>
    </footer>
  );
};
