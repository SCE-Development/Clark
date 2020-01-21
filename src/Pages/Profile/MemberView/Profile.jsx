import React, { Component } from 'react';
import './profile-modifier.css';
import axios from 'axios'
import InfoCard from './InfoCard.js'

export default class Profile extends Component {

  constructor(props) {
    super(props)

    // Variables that will be send to data base
    this.state = {
      user: '',
      fullName: ''
    }
  }

  componentDidMount() {
    axios
      // get user
      .post('/api/user/search', {
        // don't need email
        token: this.props.user.token,
        email: this.props.user.email
      })
      .then(result => {
        if (result.status >= 200 && result.status < 300) {

          //concat user to full name
          this.setState({ user: result.data }, () => {
            const name = this.state.user.firstName[0].toUpperCase() +
              this.state.user.firstName.slice(1, this.state.user.firstName.length) +
              " " +
              this.state.user.lastName[0].toUpperCase() +
              this.state.user.lastName.slice(1, this.state.user.lastName.length)

            this.setState({ fullName: name })
          })
        }
      }).catch(()=>{})
  }

  render() {
    const fields =
      (this.state.user) ?
        [
          { title: 'Name', value: this.state.fullName },
          { title: 'Door Code', value: this.state.user.doorCode },
          { title: 'Joined Date', value: this.state.user.joinDate.slice(0, 10) },
          { title: 'Email', value: this.state.user.email },
          { title: 'Membership Expiration', value: this.state.user.membershipValidUntil.slice(0, 10) },
        ] :
        [
          { title: '.', value: '' },
          { title: 'Door Code', value: '' },
          { title: 'Joined Date', value: '' },
          { title: 'Email', value: '' },
          { title: 'Membership Expiration', value: '' },
        ]

    return (
      <div id='app'>
        <h1 id='title'> SCE Member Profile </h1>

        <img id='profile-logo' alt='sce logo'
          src='images/SCE-glow.png' />

        <InfoCard fields={fields} 
        user={{...this.state.user, token: this.props.user.token}} />
      </div>
    );
  }
}
