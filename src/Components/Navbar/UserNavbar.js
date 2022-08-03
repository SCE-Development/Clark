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

export default function UserNavBar(props) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const unauthedRoutes = [{ title: 'About', route: '/#about' },
    { title: 'Events', route: '/events' },
    { title: 'Team', route: '/team' }];

  const unauthedTeamRoutes = [{ title: 'Dev Team', route: '/team'}];

  const authedRoutes = [{ title: 'Printing', route: '/2DPrinting' }];

  const authentication = [{ title: 'Sign Up', route: '/register' },
    { title: 'Sign In', route: '/login' }];

  const toggler = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  return (
    <div className={'user-nav'}>
      <Navbar expand='xl' className = "navbar">
        <NavbarBrand href='/'>
          <div>
            <img id='logo-image' src='favicon.ico'
              alt={'sce-logo'} style={{ width: '70px' }} />
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
                <DropdownItem  className='dropdown-submenu drp-item'>
                  <DropdownItem className='drp-item' id='btndrp-text'>
                      Printing
                  </DropdownItem>
                  <DropdownMenu className='drp-menu'>
                    {authedRoutes.map((link, index) => {
                      return (
                        <DropdownItem
                          key={index}
                          className='drp-item'
                          href={link.route}
                        >
                          {link.title}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </DropdownItem>
              )}
              {/* Display unauthedRoutes in hamburger button */}
              {unauthedRoutes.map((link, index) => {
                return (
                  <>
                    { link.title === 'Team' ?
                      (
                        <DropdownItem
                          className='dropdown-submenu drp-item'
                          key={index}>

                          <DropdownItem className='drp-item' id='btndrp-text'>
                            Team
                          </DropdownItem>

                          <DropdownMenu className='drp-menu'>
                            {unauthedTeamRoutes.map((link, index) => {
                              return (
                                <DropdownItem
                                  key={index}
                                  className='drp-item'
                                  href={link.route}
                                >
                                  {link.title}
                                </DropdownItem>
                              );
                            })}
                          </DropdownMenu>

                        </DropdownItem>
                      ) : (
                        <DropdownItem className='drp-item' key={index}>
                          <NavItem>
                            <NavLink id='btndrp-text' href={link.route}>
                              {link.title}
                            </NavLink>
                          </NavItem>
                        </DropdownItem>
                      )}
                  </>
                );
              })}
              {/* account icon */}
              {props.authenticated && props.user ? (
                <div className='dropdown-submenu drp-item'>
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
                    <DropdownItem
                      className='authenticated-navlink drp-item'
                      href='/profile'
                    >
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
                </div>
                // display sign in, sign up in hamburger if not logged in
              ) : (
                <NavItem className='drp-item'>
                  {authentication.map((link, index) => {
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
                </NavItem>
              )}
            </DropdownMenu>
          </ButtonDropdown>
        </NavbarToggler>

        <Collapse navbar>
          <Nav className='mx-auto d-flex sce-nav' navbar>
            <div className='navlink-items'>
              {/* Display user's first name in nav*/}
              {props.authenticated && props.user ? (
                <div className='profile'>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle className='text-white' nav caret>
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
                      <DropdownItem className='drp-item'
                        href='/profile'>
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
                  <>
                    { link.title === 'Team'  ?
                      (
                        <UncontrolledDropdown nav inNavbar key={index}>
                          <DropdownToggle
                            className='authenticated-navlink'
                            id='navlink-text'
                            nav
                            caret
                          >
                            Team
                          </DropdownToggle>
                          <DropdownMenu right>
                            {unauthedTeamRoutes.map((link, index) => {
                              return (
                                <DropdownItem
                                  key={index}
                                  className='drp-item'
                                  href={link.route}
                                >
                                  {link.title}
                                </DropdownItem>
                              );
                            })}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      ) : (
                        <NavItem key={index}>
                          <NavLink id='navlink-text'
                            className='routes'
                            href={link.route}>
                            {link.title}
                          </NavLink>
                        </NavItem>
                      )
                    }
                  </>
                );
              })}
              {/* Display printing in nav when logged in */}
              {props.user && props.user.accessLevel >= membershipState.MEMBER
                && (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle
                      className='authenticated-navlink'
                      id='navlink-text'
                      nav
                      caret
                    >
                      Services
                    </DropdownToggle>
                    <DropdownMenu right>
                      {authedRoutes.map((link, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            className='drp-item'
                            href={link.route}
                          >
                            {link.title}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                )}
            </div>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}
