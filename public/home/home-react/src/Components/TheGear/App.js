import React from 'react';
import Ionicon from 'react-ionicons'
import { CardHeader, CardFooter, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Media, Card, CardBody, Button, CardTitle, CardText, CardImg } from 'reactstrap';
import classnames from 'classnames';
import './App.css';
import './card-config.css';
import Ari from './gearPics/2018_2019/arisKoumis.png';
import Evan from './gearPics/2018_2019/evanUgarte.png';

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

{/*-----------------Nav Bar-------------------
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              2018 - 2019 Gear
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              2017 - 2018 Gear
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={this.state.activeTab}> */}

{/*-----------------Panel 1-------------------
          <TabPane tabId="1" id="tab1" className="Panel">
          </TabPane> */}
{/*-----------------Panel 2-------------------

          <TabPane tabId="2" id="tab2" className="Panel">

          </TabPane>

        </TabContent>
        */}

      </div>
    );
  }
}


// Tab 1
//
//
// <Card>
//   <CardHeader tag="h3">T-Shirt</CardHeader>
//   <CardBody>
//     <CardTitle>Special Title Treatment</CardTitle>
//     <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
//     <Button>Go somewhere</Button>
//   </CardBody>
//   <CardFooter className="text-muted">Footer</CardFooter>
// </Card>
//
//
// <Card>
//   <CardHeader tag="h3">Graduation Stoles</CardHeader>
//   <CardBody>
//     <CardTitle>Special Title Treatment</CardTitle>
//     <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
//     <Button>Available for order 2.5 months before graduation deadline. Must be an SCE member</Button>
//   </CardBody>
//   <CardFooter className="text-muted">Footer</CardFooter>
// </Card>
//
//
// <h1 className="Title">s</h1>
//
//   <Row id="rowCSS">
//     <Col sm="8" id="col2">
//
//     <Media href="#ArisKoumis">
//       <CardImg height="550" width="550" src={Ari}/>
//     </Media>
//
//       <Card body className="wholeCard">
//
//         <Media>
//
//           {/*
//           <Media body className="SubTitle">
//             <Media heading className="NameHead">
//               <h2>Aris Koumis</h2>
//               <h5>B.S Computer Engineering</h5>
//             </Media>
//
//             <Media className="link">
//             <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
//             <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
//             <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
//             </Media>
//           </Media>
//           */}
//         </Media>
//         {/*
//         <Media className="description">
//         Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
//         sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
//         Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
//         </Media>
//       */}
//       </Card>
//     </Col>
//
//   </Row>
//
// <h1 className="Title"> Graduation Stoles </h1>
//
//   <Row>
//     <Col sm="4" id="col2">
//       <Card body>
//         <Media>
//           <Media href="#EvanUgarte" className="Pic">
//             <CardImg height="250" width="250" src={Evan}/>
//           </Media>
//           <Media body className="SubTitle">
//             <Media heading className="NameHead">
//               <h2>Evan Ugarte</h2>
//               <h5>B.S Software Engineering</h5>
//             </Media>
//
//             <Media className="link">
//             <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
//             <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
//             <Ionicon icon="logo-github" fontSize="35px" color="#757575"/>
//             </Media>
//           </Media>
//         </Media>
//         <Media className="description">
//         Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
//         sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
//         Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
//         </Media>
//       </Card>
//     </Col>
//   </Row>
// </TabPane>
//
//


// TAB 2
//
// <h1 className="Title">Executive Leadership</h1>
//
//   <Row>
//     <Col sm="4" id="col1">
//       <Card body>
//         <Media>
//           <Media href="#ArisKoumis" className="Pic">
//             <CardImg height="250" width="250" src={Ari}/>
//           </Media>
//           <Media body className="SubTitle">
//             <Media heading>
//               <h2>Aris Koumis v1</h2>
//               <h5> Major </h5>
//             </Media>
//
//             <Media className="link">
//             <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
//             <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
//             </Media>
//           </Media>
//         </Media>
//         <Media className="description">
//         Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
//         sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
//         Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
//         </Media>
//       </Card>
//     </Col>
//
//     <Col sm="4" id="col2">
//       <Card body>
//         <Media>
//           <Media href="#ArisKoumis" className="Pic">
//             <CardImg height="250" width="250" src={Ari}/>
//           </Media>
//           <Media body className="SubTitle">
//             <Media heading>
//               <h2>Aris Koumis v2</h2>
//               <h5> Major </h5>
//             </Media>
//             <Media className="link">
//             <Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/>
//             <Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/>
//             </Media>
//           </Media>
//         </Media>
//
//         <Media className="description">
//         Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
//         sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
//         Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
//         </Media>
//       </Card>
//     </Col>
//   </Row>
//
//   <h1 className="Title">Software Development Team</h1>
//
//   <h1 className="Title">Event Planning and Public Relations Team</h1>
//
// </TabPane>
// </TabContent>
