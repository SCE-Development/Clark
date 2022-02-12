import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  TabContent, TabPane, Nav,
  NavItem, NavLink, Row, Col
} from 'reactstrap';
import classnames from 'classnames';
import './past-events.css';
import { redis } from 'googleapis/build/src/apis/redis';

function PastEvents() {
  // State for current active Tab
  const [currentActiveTab, setCurrentActiveTab] = useState('1');

  // Toggle active state for Tab
  const toggle = (tab) => {
    if (currentActiveTab !== tab){
      setCurrentActiveTab(tab);
    }
  };

  return (
    <div style={{
      display: 'block', width: '40%', padding: 30, backgroundColor:'#1B1B1B'
    }}>
      <Nav tabs className = 'tab-header' style={{}}>
        <NavItem className="circle">
          <div className="red" style={{width:25, height:25}}></div>
          <div className="orange" style={{width:25, height:25}}></div>
          <div className="green" style={{width:25, height:25}}></div>
        </NavItem>
        <NavItem className='tab-title'>
          <NavLink
            className={classnames({
              active:
                currentActiveTab === '1'
            })}
            onClick={() =>{
              toggle('1');
            }}
          >
            Industry Events
          </NavLink>
        </NavItem>
        <NavItem className='tab-title'>
          <NavLink
            className={classnames({
              active:
                  currentActiveTab === '2'
            })}
            onClick={() => {
              toggle('2');

            }}
          >
            Socials
          </NavLink>
        </NavItem>
        <NavItem className='tab-title'>
          <NavLink
            className={classnames({
              active:
                currentActiveTab === '3'
            })}
            onClick={() => {
              toggle('3');
            }}
          >
            Workshops
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={currentActiveTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <img
                alt="Card image cap"
                src="images/sce-hero.png"
                width="100%"
                className="hero-image"
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <img
                alt="Card image cap"
                src="images/sce-hero.png"
                width="100%"
                className="hero-image"
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="3">
          <Row>
            <Col sm="12">
              <img
                alt="Card image cap"
                src="images/sce-hero.png"
                width="100%"
                className="hero-image"
              />
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div >
  );
}

export default PastEvents;
