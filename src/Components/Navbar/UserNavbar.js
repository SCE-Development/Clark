import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import {
  ButtonDropdown,
  Collapse,
  CustomInput,
  NavbarToggler,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { membershipState } from '../../Enums';
import logo from '../Navbar/sce_logo.png';
import { toggleDarkTheme } from '../../APIFunctions/dark-theme';
import { sunIcon, moonIcon } from '../../Pages/Overview/SVG';


export default function UserNavBar(props) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const icons = [
    {
      link: ['https://www.linkedin.com/company', '/sjsusce/'].join(''),
      vector: [
        'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h',
        '14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3',
        'v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.7',
        '64 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5',
        ' 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.3',
        '96-2.586 7-2.777 7 2.476v6.759z'
      ].join('')
    },
    {
      link: 'https://discord.com/invite/STkT6mH',
      vector: [
        'M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.4',
        '52-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.4',
        '6-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 1',
        '5.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.',
        '728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2',
        '.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.09',
        '6-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444',
        '.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.03',
        '6-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824',
        ' 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.04',
        '8.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.38',
        '4 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.51',
        '6.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.97',
        '2.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.33',
        '2 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.22',
        '4-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.2',
        '24 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z'
      ].join('')
    },
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
  const unauthedRoutes = [{ title: 'Events', route: '/events', month: null }, {title: 'Officer Application', route:'/officerApplication', month: [7,8,9] }];

  const toggler = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  function createCookie() {
    if (document.body.className === 'light') {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
    toggleDarkTheme();
  }

  function keepState() {
    const cookie = new Cookies();
    if (cookie.get('dark') === 'true') {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
  }

  useEffect(() => {
    keepState();
    // eslint-disable-next-line
  }, [])

  return (
    <div className='user-nav'>
      <Navbar light expand='md'>
        <NavbarBrand href='/'>
          <div>
            <img id='logo-image' src={logo} alt={'sce logo'} />
          </div>
        </NavbarBrand>
        <div style={{ width: '0.7rem', height: '1.9rem' }} >{sunIcon()}</div>
        <div style={{ width: '1.2rem' }} />
        <CustomInput onChange={createCookie} className='darkToggle'
          type='switch' id='exampleCustomSwitch' name='customSwitch'
          checked={darkTheme} />
        <div style={{ width: '1.1rem', height: '1.9rem' }} >{moonIcon()}</div>
        <NavbarToggler tag='h1'>
          <ButtonDropdown isOpen={menuIsOpen} toggle={toggler}>
            <DropdownToggle className='hamburger-button'>
              <span className='border'></span>
              <span className='border'></span>
              <span className='border'></span>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem className='drp-item'>
                <NavItem>
                  {icons.map((icon, index) => {
                    return (
                      <a key={index} href={icon.link}>
                        <svg className='m-2 icon-images' viewBox='0 0 24 24'>
                          <path fill='gray' d={icon.vector} />
                        </svg>
                      </a>
                    );
                  })}
                </NavItem>
              </DropdownItem>
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
              {unauthedRoutes.map((link, index) => {
                if (link.month === null || link.month.includes(new Date().getMonth())){
                  return (
                      <DropdownItem className='drp-item' key={index}>
                        <NavItem>  
                          <NavLink id='btndrp-text' href={link.route}>
                            {link.title}
                          </NavLink>
                        </NavItem>
                      </DropdownItem>
                  );
                }
                return null;
              })}
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
              ) : (
                <DropdownItem tag='h1' className='dropdown-submenu drp-item'>
                  <DropdownItem className='drp-item' id='btndrp-text'>
                      Join Us!
                  </DropdownItem>
                  <DropdownMenu right className='drp-menu'>
                    <DropdownItem className='drp-item' href='/register'>
                        Membership Application
                    </DropdownItem>
                    <DropdownItem className='drp-item' href='/login'>
                        Login
                    </DropdownItem>
                  </DropdownMenu>
                </DropdownItem>
              )}
            </DropdownMenu>
          </ButtonDropdown>
        </NavbarToggler>
        <Collapse navbar>
          <Nav className='ml-auto d-flex align-items-end sce-nav' navbar>
            <NavItem>
              {icons.map((icon, index) => {
                return (
                  <a key={index} href={icon.link}>
                    <svg className='m-2 icon-images' viewBox='0 0 24 24'>
                      <path fill='white' d={icon.vector} />
                    </svg>
                  </a>
                );
              })}
            </NavItem>
            {props.user && props.user.accessLevel >= membershipState.MEMBER && (
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
            {unauthedRoutes.map((link, index) => {
              if (link.month === null || link.month.includes(new Date().getMonth())){
                return(
                  <NavItem key={index}>
                    <NavLink id='navlink-text' href={link.route}>
                      {link.title}
                    </NavLink>
                  </NavItem>
                );
              }
              return null;
            })}
            {props.authenticated && props.user ? (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle id='navlink-text' nav caret>
                  <svg className='profile-image' viewBox='0 0 24 24'>
                    <path
                      fill='white'
                      d='M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,
                      12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,
                      19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,
                      8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,
                      22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z'
                    />
                  </svg>
                  {props.user.firstName}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem className='drp-item' href='/profile'>
                    Profile
                  </DropdownItem>
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
            ) : (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle id='navlink-text' nav caret>
                    Join Us!
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem className='drp-item' href='/register'>
                      Membership Application
                  </DropdownItem>
                  <DropdownItem className='drp-item' href='/login'>
                      Login
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}
