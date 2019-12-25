import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

export class Admin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {}
    }
  }

  render () {
    return <div>Admin</div>
  }
}

export default withRouter(Admin)
