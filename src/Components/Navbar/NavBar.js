import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import './navbar.css'
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import Ionicon from 'react-ionicons'
import 'bootstrap/dist/css/bootstrap.min.css'

class NavBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoggedIn: false,
      user: {
        name: 'Andrew',
        accessLevel: 2
      }
    }
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    if (token) {
      // Verify if token is valid
      // As user persmissions are created, the verify auth should be more extensive
      // and return views as the permissions defines
      axios
        .post('/api/user/verify', { token })
        .then(res => {
          this.setState({ isLoggedIn: true })
        })
        .catch(() => {
          // Token is no longer valid, remove it
          window.localStorage.removeItem('jwtToken')
        })
    }
  }

  handleLogout () {
    window.localStorage.removeItem('jwtToken')
    window.location.reload()
  }

  render () {
    return (
      <div className='sce-nav'>
        <Navbar light expand='md'>
          <NavbarBrand href='/'>
            Software & Computer Engineering Society &nbsp;
          </NavbarBrand>
          <a href='https://www.linkedin.com/company/sjsu-software-computer-engineering-society/'>
            <Ionicon icon='logo-linkedin' fontSize='35px' color='#757575' />
          </a>
          <a href='https://www.facebook.com/sjsusce/'>
            <Ionicon icon='logo-facebook' fontSize='35px' color='#757575' />
          </a>
          <Nav className='ml-auto' navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Student Resources
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href='/labkits'>Lab Kits</DropdownItem>
                <DropdownItem href='https://docs.google.com/forms/d/e/1FAIpQLSfAKfUnblxOZ0r3BjMY6xe_0g2zC7v3OfaadyvF-Ste1eL28A/viewform'>
                  Microsoft Imagine
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Printing
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href='/2DPrinting'>2D Printing</DropdownItem>
                <DropdownItem href='/3DPrintingForm'>3D Printing</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href='/'>Snacks & Food</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/events'>Events</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/Team'>SCE Team</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/Gear'>SCE Gear</NavLink>
            </NavItem>
            {/*
             <UncontrolledDropdown nav inNavbar>
               <DropdownToggle nav caret href='/'>
                 The Team
               </DropdownToggle>
               <DropdownMenu right>
                 <DropdownItem href='/'>
                   Leadership
                 </DropdownItem>
                 <DropdownItem href='/'>
                   Software Development
                 </DropdownItem>
                 <DropdownItem href='/'>
                   Events & PR
                 </DropdownItem>
               </DropdownMenu>
             </UncontrolledDropdown>
             */}
            {/* <NavItem>
               <NavLink href='#benefits'>Benefits</NavLink>
             </NavItem> */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Join Us!
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href='/register'>
                  Membership Application
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              {/* Change below to actual login page later */}
              {this.state.isLoggedIn ? (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    <svg
                      style={{ width: '30px', height: '30px' }}
                      viewBox='0 0 24 24'
                    >
                      <path
                        fill='#AAAAAA'
                        d='M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z'
                      />
                    </svg>
                    {this.state.user.name}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem href='/profile'>Profile</DropdownItem>
                    {this.state.user.accessLevel >= 1 && (
                      <DropdownItem href='/dashboard'>Admin</DropdownItem>
                    )}
                    <DropdownItem>
                      <div onClick={this.handleLogout}>
                        <svg
                          style={{ width: '18px', height: '18px' }}
                          viewBox='0 0 24 24'
                        >
                          <path d='M17,17.25V14H10V10H17V6.75L22.25,12L17,17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z' />
                        </svg>
                        Logout
                      </div>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              ) : (
                <NavLink href='/login'>Login</NavLink>
              )}
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    )
  }
}

export default withRouter(NavBar)
