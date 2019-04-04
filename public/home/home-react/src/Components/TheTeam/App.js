import React from 'react';
import Ionicon from 'react-ionicons'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Media, Card, CardBody, Button, CardTitle, CardText, CardImg } from 'reactstrap';
import classnames from 'classnames';
import './App.css';
import './card-config.css';
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
      <div className = "Page">

{/*-----------------Nav Bar-------------------*/}
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

{/*-----------------Panel 1-------------------*/}
          <TabPane tabId="1" id="tab1" className="Panel">

          <h1 className="Title">Leadership</h1>

            <Row id="rowCSS">
              <Col sm="4" id="col1">
                <Card body className="wholeCard">
                  <Media>
                    <Media href="#ArisKoumis" className="Pic">
                      <CardImg height="250" width="250" src={Ari}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Aris Koumis</h2>
                        <h5>B.S Computer Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>

              <Col sm="4" id="col2">
                <Card body>
                  <Media>
                    <Media href="#EvanUgarte" className="Pic">
                      <CardImg height="250" width="250" src={Evan}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Evan Ugarte</h2>
                        <h5>B.S Software Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>
            </Row>

            <Row id="rowCSS">
              <Col sm="4" id="col1">
                <Card body className="wholeCard">
                  <Media>
                    <Media href="#pranavPatil" className="Pic">
                      <CardImg height="250" width="250" src={Pranav}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Pranav Patil</h2>
                        <h5>B.S Computer Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>

              <Col sm="4" id="col2">
                <Card body>
                  <Media>
                    <Media href="#kevenGallegos" className="Pic">
                      <CardImg height="250" width="250" src={Keven}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Keven Gallegos</h2>
                        <h5>Unknown</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>
            </Row>

            <Row id="rowCSS">
              <Col sm="4" id="col1">
                <Card body className="wholeCard">
                  <Media>
                    <Media href="#DonRobertPornaras" className="Pic">
                      <CardImg height="250" width="250" src={DRP}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Don Robert Pornaras</h2>
                        <h5>B.S Mechanical Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>

              <Col sm="4" id="col2">
                <Card body>
                  <Media>
                    <Media href="#ThenuSenthil" className="Pic">
                      <CardImg height="250" width="250" src={Thenu}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Thenu Senthil</h2>
                        <h5>B.S Computer Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>
            </Row>

            <Row id="rowCSS">
              <Col sm="4" id="col1">
                <Card body className="wholeCard">
                  <Media>
                    <Media href="#AlishaMehndiratta" className="Pic">
                      <CardImg height="250" width="250" src={Alisha}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Alisha Mehndiratta</h2>
                        <h5>B.S Software Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>

              <Col sm="4" id="col2">
                <Card body>
                  <Media>
                    <Media href="#LorenaSilva" className="Pic">
                      <CardImg height="250" width="250" src={Lorena}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Lorena Silva</h2>
                        <h5>B.S Computer Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>
            </Row>

            <Row id="rowCSS">
              <Col sm="4" id="col1">
                <Card body className="wholeCard">
                  <Media>
                    <Media href="#Nick Derry" className="Pic">
                      <CardImg height="250" width="250" src={Nick}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Nick Derry</h2>
                        <h5>B.S Computer Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>
            </Row>

            <h1 className="Title">Software Development Team</h1>

            <Row id="rowCSS">
              <Col sm="4" id="col1">
                <Card body className="wholeCard">
                  <Media>
                    <Media href="#ArisKoumis" className="Pic">
                      <CardImg height="250" width="250" src={Ari}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Aris Koumis</h2>
                        <h5>B.S Computer Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>

              <Col sm="4" id="col2">
                <Card body>
                  <Media>
                    <Media href="#EvanUgarte" className="Pic">
                      <CardImg height="250" width="250" src={Evan}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Evan Ugarte</h2>
                        <h5>B.S Software Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>
            </Row>

            <Row id="rowCSS">
              <Col sm="4" id="col1">
                <Card body className="wholeCard">
                  <Media>
                    <Media href="#ArisKoumis" className="Pic">
                      <CardImg height="250" width="250" src={Ari}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Aris Koumis</h2>
                        <h5>B.S Computer Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>

              <Col sm="4" id="col2">
                <Card body>
                  <Media>
                    <Media href="#EvanUgarte" className="Pic">
                      <CardImg height="250" width="250" src={Evan}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Evan Ugarte</h2>
                        <h5>B.S Software Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>
            </Row>

            <Row id="rowCSS">
              <Col sm="4" id="col1">
                <Card body className="wholeCard">
                  <Media>
                    <Media href="#ArisKoumis" className="Pic">
                      <CardImg height="250" width="250" src={Ari}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Aris Koumis</h2>
                        <h5>B.S Computer Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>

              <Col sm="4" id="col2">
                <Card body>
                  <Media>
                    <Media href="#EvanUgarte" className="Pic">
                      <CardImg height="250" width="250" src={Evan}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Evan Ugarte</h2>
                        <h5>B.S Software Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>
            </Row>

            <h1 className="Title">Event Planning and Public Relations Team</h1>

            <Row id="rowCSS">
              <Col sm="4" id="col1">
                <Card body className="wholeCard">
                  <Media>
                    <Media href="#ArisKoumis" className="Pic">
                      <CardImg height="250" width="250" src={Ari}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Aris Koumis</h2>
                        <h5>B.S Computer Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>

              <Col sm="4" id="col2">
                <Card body>
                  <Media>
                    <Media href="#EvanUgarte" className="Pic">
                      <CardImg height="250" width="250" src={Evan}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Evan Ugarte</h2>
                        <h5>B.S Software Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>
            </Row>

            <Row id="rowCSS">
              <Col sm="4" id="col1">
                <Card body className="wholeCard">
                  <Media>
                    <Media href="#ArisKoumis" className="Pic">
                      <CardImg height="250" width="250" src={Ari}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Aris Koumis</h2>
                        <h5>B.S Computer Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>

              <Col sm="4" id="col2">
                <Card body>
                  <Media>
                    <Media href="#EvanUgarte" className="Pic">
                      <CardImg height="250" width="250" src={Evan}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Evan Ugarte</h2>
                        <h5>B.S Software Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>
            </Row>

            <h1 className="Title">Associates</h1>

            <Row id="rowCSS">
              <Col sm="4" id="col1">
                <Card body className="wholeCard">
                  <Media>
                    <Media href="#ArisKoumis" className="Pic">
                      <CardImg height="250" width="250" src={Ari}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Aris Koumis</h2>
                        <h5>B.S Computer Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>

              <Col sm="4" id="col2">
                <Card body>
                  <Media>
                    <Media href="#EvanUgarte" className="Pic">
                      <CardImg height="250" width="250" src={Evan}/>
                    </Media>
                    <Media body className="SubTitle">
                      <Media heading className="NameHead">
                        <h2>Evan Ugarte</h2>
                        <h5>B.S Software Engineering</h5>
                      </Media>

                      <Media className="link">
                      <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                      <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
                      </Media>
                    </Media>
                  </Media>
                  <Media className="description">
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                  sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                  </Media>
                </Card>
              </Col>
            </Row>

          </TabPane>

{/*-----------------Panel 2-------------------*/}

          <TabPane tabId="2" id="tab2" className="Panel">

                    <h1 className="Title">Executive Leadership</h1>

                      <Row>
                        <Col sm="4" id="col1">
                          <Card body>
                            <Media>
                              <Media href="#ArisKoumis" className="Pic">
                                <CardImg height="250" width="250" src={Ari}/>
                              </Media>
                              <Media body className="SubTitle">
                                <Media heading>
                                  <h2>Aris Koumis v1</h2>
                                  <h5> Major </h5>
                                </Media>

                                <Media className="link">
                                <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                                <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                                </Media>
                              </Media>
                            </Media>
                            <Media className="description">
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                            sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                            Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                            </Media>
                          </Card>
                        </Col>

                        <Col sm="4" id="col2">
                          <Card body>
                            <Media>
                              <Media href="#ArisKoumis" className="Pic">
                                <CardImg height="250" width="250" src={Ari}/>
                              </Media>
                              <Media body className="SubTitle">
                                <Media heading>
                                  <h2>Aris Koumis v2</h2>
                                  <h5> Major </h5>
                                </Media>
                                <Media className="link">
                                <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                                <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                                </Media>
                              </Media>
                            </Media>

                            <Media className="description">
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                            sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                            Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                            </Media>
                          </Card>
                        </Col>
                      </Row>

                      <h1 className="Title">Software Development Team</h1>

                      <Row>
                        <Col sm="4" id="col1">
                          <Card body>
                            <Media>
                              <Media href="#ArisKoumis" className="Pic">
                                <CardImg height="250" width="250" src={Ari}/>
                              </Media>
                              <Media body className="SubTitle">
                                <Media heading>
                                  <h2>Aris Koumis v1</h2>
                                  <h5> Major </h5>
                                </Media>

                                <Media className="link">
                                <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                                <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                                </Media>
                              </Media>
                            </Media>
                            <Media className="description">
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                            sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                            Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                            </Media>
                          </Card>
                        </Col>

                        <Col sm="4" id="col2">
                          <Card body>
                            <Media>
                              <Media href="#ArisKoumis" className="Pic">
                                <CardImg height="250" width="250" src={Ari}/>
                              </Media>
                              <Media body className="SubTitle">
                                <Media heading>
                                  <h2>Aris Koumis v2</h2>
                                  <h5> Major </h5>
                                </Media>
                                <Media className="link">
                                <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                                <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                                </Media>
                              </Media>
                            </Media>

                            <Media className="description">
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                            sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                            Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                            </Media>
                          </Card>
                        </Col>
                      </Row>

                      <h1 className="Title">Event Planning and Public Relations Team</h1>

                      <Row>
                        <Col sm="4" id="col1">
                          <Card body>
                            <Media>
                              <Media href="#ArisKoumis" className="Pic">
                                <CardImg height="250" width="250" src={Ari}/>
                              </Media>
                              <Media body className="SubTitle">
                                <Media heading>
                                  <h2>Aris Koumis v1</h2>
                                  <h5> Major </h5>
                                </Media>

                                <Media className="link">
                                <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                                <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                                </Media>
                              </Media>
                            </Media>
                            <Media className="description">
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                            sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                            Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                            </Media>
                          </Card>
                        </Col>

                        <Col sm="4" id="col2">
                          <Card body>
                            <Media>
                              <Media href="#ArisKoumis" className="Pic">
                                <CardImg height="250" width="250" src={Ari}/>
                              </Media>
                              <Media body className="SubTitle">
                                <Media heading>
                                  <h2>Aris Koumis v2</h2>
                                  <h5> Major </h5>
                                </Media>
                                <Media className="link">
                                <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                                <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                                </Media>
                              </Media>
                            </Media>

                            <Media className="description">
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                            sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                            Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                            </Media>
                          </Card>
                        </Col>
                      </Row>

                      <h1 className="Title">Associates</h1>

                      <Row>
                        <Col sm="4" id="col1">
                          <Card body>
                            <Media>
                              <Media href="#ArisKoumis" className="Pic">
                                <CardImg height="250" width="250" src={Ari}/>
                              </Media>
                              <Media body className="SubTitle">
                                <Media heading>
                                  <h2>Aris Koumis v1</h2>
                                  <h5> Major </h5>
                                </Media>

                                <Media className="link">
                                <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                                <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                                </Media>
                              </Media>
                            </Media>
                            <Media className="description">
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                            sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                            Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                            </Media>
                          </Card>
                        </Col>

                        <Col sm="4" id="col2">
                          <Card body>
                            <Media>
                              <Media href="#ArisKoumis" className="Pic">
                                <CardImg height="250" width="250" src={Ari}/>
                              </Media>
                              <Media body className="SubTitle">
                                <Media heading>
                                  <h2>Aris Koumis v2</h2>
                                  <h5> Major </h5>
                                </Media>
                                <Media className="link">
                                <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
                                <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
                                </Media>
                              </Media>
                            </Media>

                            <Media className="description">
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                            sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                            Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                            </Media>
                          </Card>
                        </Col>
                      </Row>
          
          </TabPane>
        </TabContent>

      </div>
    );
  }
}
