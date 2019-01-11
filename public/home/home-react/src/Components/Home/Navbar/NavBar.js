import React, { Component } from 'react';
import './navbar.css';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import Ionicon from 'react-ionicons'
import 'bootstrap/dist/css/bootstrap.min.css';

class NavBar extends Component {
  /*
  constructor(props) {
   super(props);
 }
 */

 render() {
   let isLoggedIn = this.props.isLoggedIn;
   return (
     <div className="sce-nav">
       <Navbar light expand="md">
         <NavbarBrand href="/">Software & Computer Engineering Society &nbsp;</NavbarBrand>
         <a href="https://www.linkedin.com/company/sjsu-software-computer-engineering-society/"><Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/></a>
         <a href="https://www.facebook.com/sjsusce/"><Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/></a>
           <Nav className="ml-auto" navbar>
             <UncontrolledDropdown nav inNavbar>
               <DropdownToggle nav caret>
                 Student Resources
               </DropdownToggle>
               <DropdownMenu right>
                 <DropdownItem href="/">
                   Lab Kits
                 </DropdownItem>
                 <DropdownItem href="/">
                   Microsoft Imagine
                 </DropdownItem>
               </DropdownMenu>
             </UncontrolledDropdown>
             <UncontrolledDropdown nav inNavbar>
               <DropdownToggle nav caret>
                 Printing
               </DropdownToggle>
               <DropdownMenu right>
                 <DropdownItem href="/">
                   2D Printing
                 </DropdownItem>
                 <DropdownItem href="/">
                   3D Printing
                 </DropdownItem>
               </DropdownMenu>
             </UncontrolledDropdown>
             <NavItem>
               <NavLink href="/">Snacks & Food</NavLink>
             </NavItem>
             <NavItem>
               <NavLink href="/">Events</NavLink>
             </NavItem>
             <UncontrolledDropdown nav inNavbar>
               <DropdownToggle nav caret href="/">
                 The Team
               </DropdownToggle>
               <DropdownMenu right>
                 <DropdownItem href="/">
                   Leadership
                 </DropdownItem>
                 <DropdownItem href="/">
                   Software Development
                 </DropdownItem>
                 <DropdownItem href="/">
                   Events & PR
                 </DropdownItem>
               </DropdownMenu>
             </UncontrolledDropdown>
             <NavItem>
               <NavLink href="/">Benefits</NavLink>
             </NavItem>
             {
               isLoggedIn ? (
                 <React.Fragment>
                 <UncontrolledDropdown nav inNavbar>
                   <DropdownToggle nav caret>
                     Join Us!
                   </DropdownToggle>
                   <DropdownMenu right>
                     <DropdownItem  href="/">
                       Membership Application
                     </DropdownItem>
                   </DropdownMenu>
                 </UncontrolledDropdown>
                 <NavItem>
                   <NavLink href="/">Profile</NavLink>
                 </NavItem>
                 <NavItem>
                   <NavLink><Ionicon className="login-icon" icon="ios-radio-button-on" fontSize="20px" color="green" /></NavLink>
                 </NavItem>
               </React.Fragment>
               ) : (
                 <>
                 <UncontrolledDropdown nav inNavbar>
                   <DropdownToggle nav caret>
                     Join Us!
                   </DropdownToggle>
                   <DropdownMenu right>
                     <DropdownItem  href="/">
                       Membership Application
                     </DropdownItem>
                   </DropdownMenu>
                 </UncontrolledDropdown>
                 <NavItem>
                   {/* Change below to actual login page later */}
                   <NavLink href="https://localhost:8080/core/">Login</NavLink>
                 </NavItem>
               </>
               )}

           </Nav>
       </Navbar>
     </div>
   );
 }
}

export default NavBar;
