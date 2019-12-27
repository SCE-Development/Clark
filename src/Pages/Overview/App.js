import React, { Component } from 'react'
import './App.css'
import InfoCard from '../Profile/admin/AdminView'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import axios from 'axios'
const display = require('./DisplayProfile.js')

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // All users array, update by callDatabase
      users: [],
      search: ''
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

          <tbody
            onClick={() => {
              this.forceUpdate()
            }}
          >
            {this.search(this.state.users).map((user, index) =>
              display.displayBoard(user, index)
            )}
          </tbody>
        </table>

        <Modal isOpen={display.getToggle()}>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            onClick={() => {
              this.callDatabase()
              display.toggler()
              this.forceUpdate()
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
            user={display.getUserToEdit()}
            token={this.state.authToken}
            onClick={() => {
              display.toggler()
              this.forceUpdate()
            }}
          />
        </Modal>

        <Modal isOpen={display.getToggleDelete()}>
          <ModalHeader>ARE YOU SURE?</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this user? They're kinda cute and
            they'll be gone forever if you do.
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              onClick={() => {
                this.deleteUser(display.getUserToDelete())
                display.togglerDelete()
                this.forceUpdate()
              }}
            >
              Yes, they're dead to me
            </Button>
            <Button
              color='light'
              onClick={() => {
                display.togglerDelete()
                this.forceUpdate()
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
