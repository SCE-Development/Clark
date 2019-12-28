import React, { Component } from 'react'
import './App.css'
import axios from 'axios'
import OverviewProfile from './OverviewProfile.js'

export default class OverviewBoard extends Component {
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
    if (user.email === this.state.currentUser) {
      // logout
      window.localStorage.removeItem('jwtToken')
      window.location.reload()
      return window.alert('Self-deprecation is an art')
    }
  }

  // simply filter array by name
  search () {
    const search = this.state.search.trim().toLowerCase()
    return search !== null && search !== ''
      ? this.state.users.filter(data =>
        data.firstName.toLowerCase().includes(search)
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
              {[
                'Name',
                'Door Code',
                'Printing',
                'Email Verified',
                'Type',
                '',
                ''
              ].map((ele, ind) => {
                return <th key={ind}>{ele}</th>
              })}
            </tr>
          </thead>

          <tbody
            onClick={() => {
              this.forceUpdate()
            }}
          >
            {this.search().map((user, index) => {
              return (
                <OverviewProfile
                  key={index}
                  user={user}
                  index={index}
                  token={this.state.authToken}
                  callDatabase={this.callDatabase.bind(this)}
                  deleteUser={this.deleteUser.bind(this)}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}
