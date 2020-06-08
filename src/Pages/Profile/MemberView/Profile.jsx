import React, { Component } from 'react';
import './profile-modifier.css';
import InfoCard from './InfoCard.js'
import { searchUserByEmail } from '../../../APIFunctions/User';
import { formatFirstAndLastName } from '../../../APIFunctions/Profile';
import Header from '../../../Components/Header/Header'
const membershipStatus = require('../../../Enums').membershipState

export default class Profile extends Component {

  constructor(props) {
    super(props)

    // Variables that will be send to data base
    this.state = {
      user: '',
      fullName: ''
    }
    this.headerProps = {
      title: 'SCE Member Profile'
    };
  }

  async componentDidMount() {
    const response = await searchUserByEmail(this.props.user.email,
      this.props.user.token)
    if (!response.error) {
      //concat user to full name
      this.setState({ user: response.responseData }, () => {
        const name = formatFirstAndLastName(this.props.user)

        this.setState({ fullName: name })
      })
    }
  }

  render() {
    const fields =
      (this.state.user) ?
        [
          { title: 'Name', value: this.state.fullName },
          { title: 'Door Code', value: this.state.user.doorCode },
          { title: 'Joined Date', value: this.state.user.joinDate.slice(0, 10) },
          { title: 'Email', value: this.state.user.email },
          {
            title: 'Membership Expiration', value: (this.props.user.accessLevel < membershipStatus.MEMBER) ?
              "Not Valid" :
              this.state.user.membershipValidUntil.slice(0, 10)
          },
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
        <Header {...this.headerProps} />

        <img id='profile-logo' alt='sce logo'
          src='images/SCE-glow.png' />

        <InfoCard fields={fields}
          user={{ ...this.state.user, token: this.props.user.token }} />
      </div>
    );
  }
}
