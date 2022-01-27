import React, { useState } from 'react';
import {
  ButtonDropdown,
  Collapse,
  NavbarToggler,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import DarkMode from './DarkMode';
import { membershipState } from '../../Enums';
import logo from '../Navbar/sce_logo.png';

export default function UserNavBar(props) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const icons = [
    {
      link: 'https://www.instagram.com/sjsusce/',
      vector: [
        'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.91',
        '9 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.8',
        '49-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07',
        '-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.0',
        '58-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 ',
        '1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-',
        '3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.',
        '073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.7',
        '8 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.94',
        '8-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.9',
        '48 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.9',
        '8-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.75',
        '9-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163',
        'c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-',
        '4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.',
        '845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.',
        '439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
      ].join('')
    }
  ];
  const unauthedRoutes = [{ title: 'About', route: '/#about' },
    // need to check for the right route to About
    { title: 'Services', route: '/services' },
    // need to check for the right route to Services
    { title: 'Events', route: '/events' }];

  const toggler = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  return (
    <div className={'user-nav'}>
      <Navbar expand='xl'>
        <NavbarBrand href='/'>
          <div>
            <img id='logo-image' src={logo} alt={'sce logo'} />
          </div>
        </NavbarBrand>
        <NavbarToggler tag='h1'>
          <ButtonDropdown isOpen={menuIsOpen} toggle={toggler}>
            <DropdownToggle className='hamburger-button'>
              <span className='border'></span>
              <span className='border'></span>
              <span className='border'></span>
            </DropdownToggle>
            <DropdownMenu right>
              {props.user && props.user.accessLevel >=
                membershipState.MEMBER && (
                <DropdownItem tag='h1' className='dropdown-submenu drp-item'>
                  <DropdownItem className='drp-item' id='btndrp-text'>
                      Printing
                  </DropdownItem>
                  <DropdownMenu className='drp-menu'>
                    <DropdownItem className='drp-item' href='/2DPrinting'>
                        2D Printing
                    </DropdownItem>
                    <DropdownItem className='drp-item' href='/3DPrintingForm'>
                        3D Printing
                    </DropdownItem>
                  </DropdownMenu>
                </DropdownItem>
              )}

              {/* Display unauthedRoutes in hamburger button */}
              {unauthedRoutes.map((link, index) => {
                return (
                  <DropdownItem className='drp-item' key={index}>
                    <NavItem>
                      <NavLink id='btndrp-text' href={link.route}>
                        {link.title}
                      </NavLink>
                    </NavItem>
                  </DropdownItem>
                );
              })}
			        {/* account icon */}
              {props.authenticated && props.user ? (
                <DropdownItem tag='h1' className='dropdown-submenu drp-item'>
                  <DropdownItem className='drp-item' id='btndrp-text'>
                    <svg className='profile-image' viewBox='0 0 24 24'>
                      <path
                        fill='gray'
                        d='M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,
                          12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,
                          17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,
                          3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,
                          2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,
                          0 22,12C22,6.47 17.5,2 12,2Z'
                      />
                    </svg>
                    {props.user.firstName}
                  </DropdownItem>
                  <DropdownMenu right className='drp-menu'>
                    <DropdownItem className='drp-item' href='/profile'>
                      Profile
                    </DropdownItem>
                    {/* Display admin in hamburger if user is admin */}
                    {props.user.accessLevel >= membershipState.OFFICER && (
                      <DropdownItem className='drp-item' href='/dashboard'>
                        Admin
                      </DropdownItem>
                    )}
                    <DropdownItem className='drp-item'>
                      <div onClick={() => props.handleLogout()}>
                        <svg className='logout-image' viewBox='0 0 24 24'>
                          <path
                            d='M17,17.25V14H10V10H17V6.75L22.25,12L17,
                            17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,
                            2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z'
                          />
                        </svg>
                        Logout
                      </div>
                    </DropdownItem>
                  </DropdownMenu>
                </DropdownItem>
              // display sign in, sign up in hamburger if not logged in
              ) : (
                <NavItem className='drp-item'>
                  <NavLink id='btndrp-text' href='/register'>
                Sign Up
                  </NavLink>
                  <NavLink id='btndrp-text' href='/login'>
                Sign In
                  </NavLink>
                </NavItem>
              )}
            </DropdownMenu>
          </ButtonDropdown>
        </NavbarToggler>

        <Collapse navbar>
          <Nav className='mx-auto d-flex align-items-end sce-nav' navbar>
            <div className='navlink-items'>
              {/* Display printing in nav when logged in */}
              {props.user && props.user.accessLevel >= membershipState.MEMBER
                && (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle id='navlink-text' nav caret>
                      Printing
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem className='drp-item' href='/2DPrinting'>
                        2D Printing
                      </DropdownItem>
                      <DropdownItem className='drp-item' href='/3DPrintingForm'>
                        3D Printing
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                )}

              {/* Display user's first name in nav*/}
              {props.authenticated && props.user ? (
                <div className='profile'>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle id='navlink-text' nav caret>
                      <svg className='profile-image' viewBox='0 0 24 24'>
                        <path
                          fill='white'
                          d='M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,
                          12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,
                          17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,
                          8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,
                          5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,
                          10 0 0,0 22,12C22,6.47 17.5,2 12,2Z'
                        />
                      </svg>
                      {props.user.firstName}
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem className='drp-item' href='/profile'>
                        Profile
                      </DropdownItem>
                      {/* Display admin if user is admin */}
                      {props.user.accessLevel >= membershipState.OFFICER && (
                        <DropdownItem className='drp-item' href='/dashboard'>
                          Admin
                        </DropdownItem>
                      )}
                      <DropdownItem className='drp-item'>
                        <div onClick={() => props.handleLogout()}>
                          <svg className='logout-image' viewBox='0 0 24 24'>
                            <path
                              d='M17,17.25V14H10V10H17V6.75L22.25,12L17,
                            17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,
                            2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z'
                            />
                          </svg>
                          Logout
                        </div>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              ) : (
                <NavItem className='mx-auto d-flex authentication'>
                  <NavLink id='signin-btn' href='/login'>
                Sign In
                  </NavLink>
                  <NavLink id='signup-btn' href='/register'>
                Sign Up
                  </NavLink>
                </NavItem>
              )}

              {/* Display titles when and when not logged in */}
              {unauthedRoutes.map((link, index) => {
                return (
                  <NavItem key={index}>
                    <NavLink className='routes' id='navlink-text'
					  href={link.route}>
                      {link.title}
                    </NavLink>
                  </NavItem>
                );
              })}
            </div>
          </Nav>
        </Collapse>
      </Navbar>
    </div >
  );
}
