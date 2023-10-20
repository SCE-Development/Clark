import React, { useState } from 'react';
import {
  Navbar,
  NavLink,
  Nav,
  NavbarBrand,
  NavbarToggler,
  Collapse,
} from 'reactstrap';
import { membershipState } from '../../Enums';
import DarkMode from './DarkMode';

export default function AdminNavbar(props) {
  const [collapsed, setCollapsed] = useState(true);
  const navbarLinks = [
    { title: 'Home', route: '/' },
    { title: 'User Manager', route: '/user-manager' },
    { title: 'Event Manager', route: '/event-manager' },
    { title: 'LED Sign', route: '/led-sign' },
    { title: '3DConsole', route: '/3DConsole' },
    { title: 'Speakers', route: '/speakers'}
  ];

  return (
    <Navbar
      dark
      className='admin-nav admin-dark'
      navbar='true'
    >
      <div id='admin-title'>
        <NavbarBrand href='/dashboard'>Admin Dashboard
        </NavbarBrand>
        <div id='admin-toggler'>
          <DarkMode />
        </div>
      </div>
      <NavbarToggler
        onClick={() => setCollapsed(!collapsed)}
      />
      <Collapse isOpen={!collapsed} navbar>
        <Nav className='ml-auto sce-nav' navbar>
          {navbarLinks.map((link, index) => {
            const navlink = (
              <NavLink key={index} title={link.title} href={link.route}>
                {link.title}
              </NavLink>
            );
            // If the link has restricted access, return it based on the
            // condition that the user has admin priviledge. Otherwise,
            // just return the link.
            return link.restricted
              ? props.user &&
              props.user.accessLevel === membershipState.ADMIN &&
              navlink
              : navlink;
          })}
          <div onClick={props.handleLogout} className = "leave-button nav-link">
            Logout
          </div>
        </Nav>
      </Collapse>
    </Navbar >
  );
}

