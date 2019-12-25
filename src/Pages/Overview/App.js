/*
NOTE!

There are 2 search API in user:
"search" get an array of all users, need a token
"searchFor" get an {obj} of the user, need a token and an emailOptIn

Log out "this.state.users" you will see an array of users

Direction!!!!!! its gonna be pretty tricky:
1.Delete what you dont use/need
2.use SVG for icons
3.use map() put individual user in "this.state.users" under the board
      ex: this.state.users.map(user => {html format})
4.Sort by "members, officers, excutives, alumni,...dont remmeber"
      look into api>models>User
      also give numbers users in each group
5.search bar, shouldnt be too hard, just add filter to the users array
6.There should be a delete route in api>routes>user
      delete api should need a token and an email (to be deleted)

Ya are my ace good luck.
*/

import React, { Component } from 'react'
import './App.css'
import InfoCard from '../Profile/admin/AdminView'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

import axios from 'axios'
class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // All users array, update by callDatabase
      users: [],
      search: '',
      selectedUser: {},
      toggle: false,
      toggleDelete: false
    }
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

    // verify that user is login
    axios
      .post('/api/user/verify', { token })
      .then(res => {
        this.setState(
          {
            currentUser: res.data.email,
            currentUserLevel: res.data.accessLevel,
            authToken: token
          },
          () => {
            this.callDatabase()
          }
        )
      })
      .catch(() => {
        if (this.props.history) this.props.history.push('/login')
      })
  }

  handleToggle (user) {
    user !== false &&
      this.setState(
        { toggle: !this.state.toggle },
        this.setState({ selectedUser: { ...user } })
      )
    this.callDatabase()
  }

  handleToggleDelete (user) {
    user !== false &&
      this.setState(
        { toggleDelete: !this.state.toggleDelete },
        this.setState({ selectedUser: { ...user } })
      )
  }

  callDatabase () {
    axios
      // get all user!
      .post('/api/user/search', {
        // don't need email
        token: this.state.authToken
      })
      .then(result => {
        if (result.status >= 200 && result.status < 300) {
          this.setState({ users: result.data })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  updateSearch (event) {
    this.setState({ search: event.target.value })
  }

  /*
  Delete api
  parameter: Json object of object to be deleted
  */
  deleteUser (user) {
    // if they decide to delete themselves: delete->logout
    if (user.email === this.state.currentUser) {
      axios
        .post('/api/user/delete', {
          token: this.state.authToken,
          email: user.email
        })
        .then(result => {
          this.callDatabase() // reload database
        })
        .catch(err => {
          console.log(err)
        })

      // logout
      window.localStorage.removeItem('jwtToken')
      window.location.reload()
      return window.alert('Self-deprecation is an art')
    } else {
      axios
        .post('/api/user/delete', {
          token: this.state.authToken,
          email: user.email
        })
        .then(result => {
          this.callDatabase() // reload database
        })
        .catch(err => {
          console.log(err)
        })
    }
    this.handleToggleDelete()
  }

  // simply filter array by name
  search () {
    const search = this.state.search.trim().toLowerCase()
    return search !== null || search !== ''
      ? this.state.users.filter(data =>
        data.firstName.toLowerCase().includes(search.toLowerCase())
      )
      : this.state.users
  }

  // Return check mark if true
  marks (sign) {
    return sign === true ? (
      <svg width='24' height='24' viewBox='0 0 24 24' style={{ fill: 'GREEN' }}>
        <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z' />
      </svg>
    ) : (
      <svg width='24' height='24' viewBox='0 0 24 24' style={{ fill: 'RED' }}>
        <path d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z' />
      </svg>
    )
  }

  /*
  translating access Level into role
  The access level is defined as follows:
  -2: Ban
  -1: Pending
   0: Member
   1: Officer
   2: Admin
  */
  roleTranslator (level) {
    switch (level) {
      case -2:
        return 'Ban'
      case 0:
        return 'Member'
      case 1:
        return 'Officer'
      case 2:
        return 'Admin'
      default:
        return 'Pending'
    }
  }

  // displaying children of board
  display (user, index) {
    return (
      <tr key={index}>
        <td>
          {user.firstName[0].toUpperCase() +
            user.firstName.slice(1, user.firstName.length) +
            ' ' +
            user.lastName[0].toUpperCase() +
            user.lastName.slice(1, user.lastName.length)}
          {user.middleInitial.trim() !== '' &&
            ' ' + user.middleInitial.toUpperCase() + '.'}
        </td>

        <td>{user.doorCode}</td>

        <td>{user.pagesPrinted}/30</td>

        <td>{this.marks(user.emailVerified)}</td>

        <td>{this.roleTranslator(user.accessLevel)}</td>

        <td>
          <button
            className='delete'
            onClick={() => {
              this.handleToggleDelete(user)
            }}
          >
            <svg width='24' height='24' viewBox='0 0 24 24'>
              <path d='M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z' />
            </svg>
          </button>
        </td>

        <button
          className='delete'
          onClick={() => {
            this.handleToggle(user)
            // this.displayInfo(user, index)
          }}
        >
          <svg width='40' height='40' viewBox='0 0 24 24'>
            <path
              fill='#000000'
              d='M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09
           20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,18.94L18.06,12.88L20.11,14.93L14.06,21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,
           14.11C13.34,14.03 12.67,14 12,14M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z'
            />
          </svg>
        </button>
      </tr>
    )
  }

  render () {
    return (
      <div className='layout'>
        <h1>Users Dashboard</h1>

        <h6>Search by first-name</h6>
        <input
          onChange={e => {
            this.updateSearch(e)
          }}
        />

        <table className='content-table' id='users'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Door Code</th>
              <th>Printing</th>
              <th>Email Verified</th>
              <th>Type</th>
              <th />
              <th />
            </tr>
          </thead>

          <tbody>
            {this.search(this.state.users).map((user, index) =>
              this.display(user, index)
            )}
          </tbody>
        </table>

        <Modal isOpen={this.state.toggle}>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            onClick={() => {
              this.handleToggle()
            }}
            style={{
              position: 'relative',
              marginTop: '5px',
              marginLeft: '-5px',
              left: '95%'
            }}
          >
            <path d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z' />
          </svg>

          <InfoCard
            user={this.state.selectedUser}
            token={this.state.authToken}
            onClick={() => {
              this.state.handleToggle()
            }}
          />
        </Modal>

        <Modal isOpen={this.state.toggleDelete}>
          <ModalHeader>ARE YOU SURE?</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this user? They're kinda cute and
            they'll be gone forever if you do.
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              onClick={() => {
                this.deleteUser(this.state.selectedUser)
              }}
            >
              Yes, they're dead to me
            </Button>
            <Button
              color='light'
              onClick={() => {
                this.handleToggleDelete()
              }}
            >
              No, they're chill
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default Login
