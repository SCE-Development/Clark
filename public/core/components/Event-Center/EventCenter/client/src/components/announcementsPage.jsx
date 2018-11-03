import React from 'react';
import {Card, Button, CardTitle, Row, Col, CardText, Nav, NavItem, NavLink } from 'reactstrap';

import "./announcementsPage.css"

export default class announcementsPage extends React.Component {

  render() {
    return (
      <div className = "EventsPage">
        
        <Nav className = "NavBar">
        <h1 align="center">Announcements Page</h1>
          
          <NavItem>
            <NavLink activestyle = {{
               fontWeight: "bold", 
               color: "white" 
            }}
            >Home
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink activestyle = {{
               fontWeight: "bold", 
               color: "white" 
            }}
            >Event Manager
            </NavLink> 
          </NavItem>
        </Nav>

{/*Cards will display the events shown*/}
       <Row>
      <Col sm="6" style = {{    
          paddingTop: '10px'
        }}>
        <Card body>
          <CardTitle><p class = "text-muted">Event 1</p></CardTitle>
          <CardText><p class = "text-muted">This is event 1</p></CardText>
          <Button>Learn more</Button>
        </Card>
      </Col>
     
      <Col sm="6" style = {{    
          paddingTop: '10px'
        }}>
        <Card body>
          <CardTitle><p class = "text-muted">Event 2</p></CardTitle>
          <CardText><p class = "text-muted">This is event 2</p></CardText>
          <Button>Learn more</Button>
        </Card>
      </Col>

       <Col sm="6" style = {{    
          paddingTop: '10px'
        }}>
        <Card body>
          <CardTitle><p class = "text-muted">Event 3</p></CardTitle>
          <CardText><p class = "text-muted">This is event 3</p></CardText>
          <Button>Learn more</Button>
        </Card>
      </Col>
    </Row>
      </div>
    );
  }
}
