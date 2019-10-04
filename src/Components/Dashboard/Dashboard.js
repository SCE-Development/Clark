import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import axios from 'axios'

import './dashboard.css'

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoggedIn: false
    }
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    // Immediately direct to /login if no jwtToken token present
    if (!token) {
      if (this.props.history) this.props.history.push('/login')
      return
    }

    // Verify if token is valid
    // As user persmissions are created, the verify auth should be more extensive
    // and return views as the permissions defines
    axios
      .post('/api/user/verify', { token })
      .then(res => {
        this.setState({ isLoggedIn: true })
      })
      .catch(() => {
        if (this.props.history) this.props.history.push('/login')
      })
  }

  handleLogout () {
    window.localStorage.removeItem('jwtToken')
    window.location.reload()
  }

  render () {
    return (
      <div>
        <header>
          <NavLink title='Home' to='/' exact activeClassName='active-nav-link'>
            Home
          </NavLink>
          <NavLink
            title='Overview'
            to='/dashboard'
            exact
            activeClassName='active-nav-link'
          >
            Overview
          </NavLink>
          <NavLink
            title='Admin'
            to='/admin'
            exact
            activeClassName='active-nav-link'
          >
            Admin
          </NavLink>
          <NavLink
            title='Officer Tools'
            to='/officer-tools'
            exact
            activeClassName='active-nav-link'
          >
            Officer Tools
          </NavLink>
          <NavLink
            title='Member Manager'
            to='/member-manager'
            exact
            activeClassName='active-nav-link'
          >
            Member Manager
          </NavLink>
          <NavLink
            title='Event Manager'
            to='/event-manager'
            exact
            activeClassName='active-nav-link'
          >
            Event Manager
          </NavLink>
          <NavLink
            title='3DConsole'
            to='/3DConsole'
            exact
            activeClassName='active-nav-link'
          >
            3DConsole
          </NavLink>
          <div onClick={this.handleLogout} className='nav-button'>
            <svg style={{ width: '18px', height: '18px' }} viewBox='0 0 24 24'>
              <path d='M17,17.25V14H10V10H17V6.75L22.25,12L17,17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z' />
            </svg>
            Logout
          </div>
        </header>
        {this.props.children}
      </div>
    )
  }
}

export default withRouter(Dashboard)
