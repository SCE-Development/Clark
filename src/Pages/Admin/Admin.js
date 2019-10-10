import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

export class Admin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {}
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

    // Verify if token is valid
    // As user persmissions are created, the verify auth should be more extensive
    // and return views as the permissions defines
    axios
      .post('/api/user/verify', { token })
      .then(res => {
        this.setState({
          user: res.data
        })

        // If the user doesn't have sufficient privilages, send them to their profile page
        if (res.data.accessLevel < 2 && this.props.history) {
          this.props.history.push('/dashboard')
        }
      })
      .catch(() => {
        if (this.props.history) this.props.history.push('/login')
      })
  }

  render () {
    return <div>{this.state.user.accessLevel >= 2 && <div>Admin</div>}</div>
  }
}

export default withRouter(Admin)
