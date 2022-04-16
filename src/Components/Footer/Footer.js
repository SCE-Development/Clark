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
          <a
            href='https://www.linkedin.com/company/sjsu-software
          -computer-engineering-society/'>{<LinkedinIcon />}</a>
          <a href='https://www.facebook.com/sjsusce/'>{<FacebookIcon />}</a>
          <a href='https://www.instagram.com/sjsusce/'>{<InstagramIcon />}</a>
          <a href='https://discord.gg/KZCKCEz5YA'>{<DiscordIcon />}</a>
          <p>Brought to you by SCE Dev-Team</p>
        </Col>
      </Row>
    </footer>
  );
};
