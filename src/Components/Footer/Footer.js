import React from 'react';
import { Row, Col } from 'reactstrap';
import './footer.css';

export default () => {
  return (
    <footer className='text-left bg-dark text-white p-4'>
      <Row className='footer-text'>
        <Col>
          <b>Software & Computer Engineering Society</b>
          <p>San Jose State University</p>
          <p>Charles W. Davidson College of Engineering</p>
          <p>Room: ENGR 294</p>
        </Col>
        <Col>
          <b>Contact</b>
          <p>
            General: <a href='mailto:asksce@gmail.com'>asksce@gmail.com</a>
          </p>
          <p>
            President:{' '}
            <a href='mailto:pres.sce.sjsu@gmail.com'>sce.sjsu@gmail.com</a>
          </p>
          <p>
            Vice-President:{' '}
            <a href='mailto:vp.sce.sjsu@gmail.com'>sce.sjsu@gmail.com</a>
          </p>
          <p>
            Public Relations:{' '}
            <a href='mailto:pr.sce.sjsu@gmail.com'>pr.sce.sjsu@gmail.com</a>
          </p>
        </Col>
        <Col>
          <a href='https://www.linkedin.com/company/sjsu-software
          -computer-engineering-society/'>
            <svg width='50px' height='50px' viewBox='0 0 24 24'>
              <path
                fill='#E1F5FE'
                d='M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,
                19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,
                9.94C14.39,9.94 13.4,10.46 12.92,
                11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,
                12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,
                8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,
                5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,
                8.56M8.27,18.5V10.13H5.5V18.5H8.27Z'
              />
            </svg>
          </a>
          <a href='https://www.facebook.com/sjsusce/'>
            <svg width='50px' height='50px' viewBox='0 0 24 24'>
              <path
                fill='#E1F5FE'
                d='M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,
                19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,
                8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z'
              />
            </svg>
          </a>

          <p>Brought to you by SCE Dev-Team</p>
        </Col>
      </Row>
    </footer>
  );
};
