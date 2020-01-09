import React, { useState } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavLink,
  Nav,
  Collapse,
  NavbarToggler
} from 'reactstrap'

export default function AdminNavbar (props) {
  const [collapsed, setCollapsed] = useState(true)

  const navbarLinks = [
    { title: 'Overview', route: '/dashboard' },
    { title: 'Admin', route: '/admin', restricted: true },
    { title: 'Officer Tools', route: '/officer-tools' },
    { title: 'Member Manager', route: '/member-manager' },
    { title: 'Event Manager', route: '/event-manager' },
    { title: '3DConsole', route: '/3DConsole' }
  ]

  return (
    <Navbar light className='admin-nav navbar-expand-md'>
      <NavbarBrand href='/'>
        Software & Computer Engineering Society
      </NavbarBrand>
      <NavbarToggler
        onClick={() => setCollapsed(!collapsed)}
        className='mr-2'
      />
      <Collapse isOpen={!collapsed} navbar>
        <Nav className='ml-auto sce-nav' navbar>
          {navbarLinks.map((link, index) => {
            const navlink = (
              <NavLink key={index} title={link.title} href={link.route}>
                {link.title}
              </NavLink>
            )
            // If the link has restricted access, return it based on the
            // condition that the user has admin priviledge. Otherwise,
            // just return the link.
            return link.restricted
              ? props.user && props.user.accessLevel === 2 && navlink
              : navlink
          })}
          <div onClick={props.handleLogout} className='nav-button nav-link'>
            <svg style={{ width: '18px', height: '18px' }} viewBox='0 0 24 24'>
              <path d='M17,17.25V14H10V10H17V6.75L22.25,12L17,17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z' />
            </svg>
            Logout
          </div>
        </Nav>
      </Collapse>
    </Navbar>
  )
}
