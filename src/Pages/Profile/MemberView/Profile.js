import React, { Component } from 'react';
import './profile-modifier.css';
import InfoCard from './InfoCard.js';
import { searchUserByEmail } from '../../../APIFunctions/User';
import { formatFirstAndLastName } from '../../../APIFunctions/Profile';
import Header from '../../../Components/Header/Header';
import PrintRequest from './PrintRequest';
import ChangePassword from './ChangePassword';
import Footer from '../../../Components/Footer/Footer.js';
import { connectToDiscord } from '../../../APIFunctions/User';

// Font Awesome Imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faDoorOpen,
  faCalendarDay,
  faCubes,
  faPrint,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fab);

const membershipStatus = require('../../../Enums').membershipState;

export default class Profile extends Component {
  constructor(props) {
    super(props);

    // Variables that will be send to data base
    this.state = {
      user: '',
      fullName: ''
    };
    this.headerProps = {
      title: 'SCE Member Profile'
    };
  }

  async componentDidMount() {
    const response = await searchUserByEmail(
      this.props.user.email, this.props.user.token
    );

    if (!response.error) {
      // concat user to full name
      this.setState({ user: response.responseData }, () => {
        const name = formatFirstAndLastName(this.props.user);

        this.setState({ fullName: name });
      });
    }
  }

  async handleDiscordAuth() {
    const response = await connectToDiscord(
      this.props.user.email, this.props.user.token
    );

    window.open(response.responseData);
  }

  render() {
    const fields = this.state.user
      ? [
        { title: `Welcome, ${this.state.fullName}!`, value: '', style: '4rem' },
        {
          title: 'Door Code',
          value: this.state.user.doorCode,
          icon: <FontAwesomeIcon icon={faDoorOpen} />
        },
        {
          title: 'Joined Date',
          value: this.state.user.joinDate.slice(0, 10),
          icon: <FontAwesomeIcon icon={faCalendarDay} />
        },
        { title: `${this.state.user.email}`, value: '', style: '2.5rem' },
        {
          title: 'Membership Expiration',
          value:
						this.props.user.accessLevel < membershipStatus.MEMBER
						  ? 'Not Valid'
						  : this.state.user.membershipValidUntil.slice(0, 10),
          icon: <FontAwesomeIcon icon={faExclamationTriangle} />
        },
        {
          title: '2D Prints',
          value: '',
          icon: <FontAwesomeIcon icon={faPrint} />,
          function: () => {
            window.location.href = '/2DPrinting';
          }
        },
        {
          title: 'Request 3D Printing',
          value: <PrintRequest />,
          icon: <FontAwesomeIcon icon={faCubes} /> },
        {
          title: 'Change Discord Account',
          value: '',
          icon: <FontAwesomeIcon icon={['fab', 'discord']} />,
          function: () => {
            this.handleDiscordAuth();
          }
        },
        {
          title: 'Change Password',
          value: <ChangePassword
            user={{ ...this.state.user, token: this.props.user.token }}
          />,
          icon: <FontAwesomeIcon icon={faLock} />
        }
      ]
      : [
        { title: '', value: '' },
        { title: 'Door Code', value: '' },
        { title: 'Joined Date', value: '' },
        { title: 'Email', value: '' },
        { title: 'Membership Expiration', value: '' },
        { title: '2D Prints', value: '' },
        { title: 'Request 3D Printing', value: '' },
        { title: 'Sign-in with Discord', value: '' },
        { title: 'Change Password', value: '' }
      ];

    return (
      <div id="profile">
        <Header {...this.headerProps} />
        <div id="enclose">
          <div id="profile-box">
            {fields.map((elem, ind) => {
              return (
                <InfoCard
                  key={ind}
                  field={elem}
                  user={{ ...this.state.user, token: this.props.user.token }}
                />
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
