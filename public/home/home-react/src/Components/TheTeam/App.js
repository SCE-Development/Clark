import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Media, Card, CardBody, Button, CardTitle, CardText, CardImg } from 'reactstrap';
import classnames from 'classnames';
import Ari from './teamPics/2018_2019/arisKoumis.png';
import Evan from './teamPics/2018_2019/evanUgarte.png';
import Pranav from './teamPics/2018_2019/pranavPatil.png';
import Keven from './teamPics/2018_2019/kevenGallegos.png';
import Alisha from './teamPics/2018_2019/alishaMehndiratta.png';
import Thenu from './teamPics/2018_2019/thenuSenthil.png';
import DRP from './teamPics/2018_2019/DRP.png';
import Lorena from './teamPics/2018_2019/lorenaSilva.png';
import Nick from './teamPics/2018_2019/nickDerry.png';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  //                
  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              2018 - 2019 Academic Year
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              2017 - 2018 Academic Year
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="4">
                <Card body>
                  <Media>
                    <Media left href="#ArisKoumis">
                      <CardImg height="250" width="250" src={Ari}/>
                    </Media>
                    <Media body>
                      <Media heading>
                        Aris Koumis
                      </Media>
                      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                    </Media>
                  </Media>
                  <CardTitle>Special Title Treatment</CardTitle>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                  <Button>Go somewhere</Button>
                </Card>
              </Col>
              <Col sm="4">
                <Card body>
                  <CardTitle>Special Title Treatment</CardTitle>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                  <Button>Go somewhere</Button>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="6">
                <Card body>
                  <CardTitle>Special Title Treatment</CardTitle>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                  <Button>Go somewhere</Button>
                </Card>
              </Col>
              <Col sm="6">
                <Card body>
                  <CardTitle>Special Title Treatment</CardTitle>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                  <Button>Go somewhere</Button>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}