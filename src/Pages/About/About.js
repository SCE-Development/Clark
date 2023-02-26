import React from 'react';
import {
  Container,
  Card,
  CardBody,
  CardText,
  Row,
  Col,
} from 'reactstrap';

import './About.css';

export default function AboutPage() {
  return (
    <>
      <div className='about-bg'>
        <Container>
          <Row className='center about-text'>
            <Row className='center'>
              <Col className='text-col'>
                <h1> The Next Frontier of Innovation at San Jose State.</h1>
                <p>
                  The Software and Computer Engineering Society aims
                  to provide students with sense of community, industry-relevant
                  experience and mentorship.
                </p>
              </Col>
              <Col>
                <Card style={{ minWidth: '40vw' }}>
                  <CardBody>
                    <CardText>
                      Network with peers in similar majors and classes
                    </CardText>
                  </CardBody>
                </Card>
                <Card style={{ minWidth: '40vw' }}>
                  <CardBody>
                    <CardText>
                      Visit company campuses, attend company info sessions and club events
                    </CardText>
                  </CardBody>
                </Card>
                <Card style={{ minWidth: '40vw' }}>
                  <CardBody>
                    <CardText>
                      Set yourself apart from others by learning skills and resume help
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className='center'>
              <Col className='text-col'>
                <h1>learn while having fun, making friends and eating pancakes</h1>
                <h5>
                  Come visit us in ENGR 294 or on Discord!
                  (<a href='https://discord.gg/KZCKCEz5YA' target='_blank'>join here</a>)
                </h5>
              </Col>
              <Col>
                {/* eslint-disable max-len */}
                <a href='https://user-images.githubusercontent.com/36345325/78325084-81350300-752b-11ea-8571-032ed04b3018.png' target="_blank">
                  <img className='collage-photo' src='https://user-images.githubusercontent.com/36345325/78325084-81350300-752b-11ea-8571-032ed04b3018.png' alt="sce collage" />
                </a>
                {/* eslint-enable max-len */}
              </Col>
            </Row>
            <Row className='center'>
              <Col className='text-col'>
                <h1>Join our dev team!</h1>
                <h4>
                  Contribute to a variety of large open source projects,
                  adding contribution history to your GitHub profile and
                  project experience on your resume.
                </h4>
              </Col>
              <Col>
                <div className="game-board">
                  {/* eslint-disable max-len */}
                  <div className="box"><img src="https://www.raspberrypi.com/app/uploads/2022/02/COLOUR-Raspberry-Pi-Symbol-Registered.png" /></div>
                  <div className="box"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" /></div>
                  <div className="box"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2560px-Node.js_logo.svg.png" /></div>

                  <div className="box"><img src="https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/267_Python-512.png" /></div>
                  <div className="box"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png" /></div>
                  <div className="box"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" /></div>

                  <div className="box"><img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/postman-icon.png" /></div>
                  <div className="box"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Prometheus_software_logo.svg/2066px-Prometheus_software_logo.svg.png" /></div>
                  <div className="box"><img src="https://docs.checkmk.com/latest/images/grafana_logo.png" /></div>
                  {/* eslint-enable max-len */}
                </div>
              </Col>
            </Row>
          </Row>
        </Container>
      </div>
    </>
  );
}
