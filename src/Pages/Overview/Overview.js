import React, { Component } from 'react'
import './Overview.css'
import axios from 'axios'
import OverviewProfile from './OverviewProfile.js'

export default class OverviewBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // All users array, update by callDatabase
      users: [],
      query: '',
      queryResult: []
    }
  }

  componentDidMount () {
    if (this.props.user) {
      this.setState(
        {
          authToken: this.props.user.token,
          currentUser: this.props.user.email,
          currentUserLevel: this.props.user.accessLevel
        },
        () => {
          this.callDatabase()
        }
      )
    }
  }

  callDatabase () {
    axios
      // get all user!
      .post('/api/user/users', {
        // don't need email
        token: this.state.authToken
      })
      .then(result => {
        if (result.status >= 200 && result.status < 300) {
          this.setState({ users: result.data })
        }
      })
      .catch(err => {})
  }

  updateQuery (event) {
    let { value } = event.target
    value = value.trim().toLowerCase()
    this.setState({ query: value })

    if (!value) return
    const queryResult = this.state.users.filter(data =>
      data.firstName.toLowerCase().includes(value)
    )
    this.setState({ queryResult })
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
      })
    if (user.email === this.state.currentUser) {
      // logout
      window.localStorage.removeItem('jwtToken')
      window.location.reload()
      return window.alert('Self-deprecation is an art')
    }
  }

  render () {
    return (
      <div className='layout'>
        <h1>Users Dashboard</h1>

        <h6>Search by first-name</h6>
        <input
          onChange={e => {
            this.updateQuery(e)
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

          <tbody>
            {this.state.query
              ? this.state.queryResult.map((user, index) => {
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
              })
              : this.state.users.map((user, index) => {
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
