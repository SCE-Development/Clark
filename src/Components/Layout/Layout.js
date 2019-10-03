import React, { Component } from 'react'
import NavBar from '../Navbar/NavBar'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoggedIn: false
    }
  }

  render () {
    return (
      <div>
        <NavBar isLoggedIn={this.state.isLoggedIn} />
        {this.props.children}
      </div>
    )
  }
}
