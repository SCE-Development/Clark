import React, { Component } from 'react';
import './profile-modifier.css';
import InfoCard from './InfoCard.js';
import { searchUserByEmail } from '../../../APIFunctions/User';
import { formatFirstAndLastName } from '../../../APIFunctions/Profile';
import Header from '../../../Components/Header/Header';
import PrintRequest from './PrintRequest';
import ChangePassword from './ChangePassword';

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
		const response = await searchUserByEmail(this.props.user.email, this.props.user.token);
		if (!response.error) {
			//concat user to full name
			this.setState({ user: response.responseData }, () => {
				const name = formatFirstAndLastName(this.props.user);

				this.setState({ fullName: name });
			});
		}
	}

	render() {
		const fields = this.state.user
			? [
					{ title: `Welcome, ${this.state.fullName}!`, value: '', style: '4rem' },
					{ title: 'Door Code', value: this.state.user.doorCode, icon: <i class="fas fa-door-open" /> },
					{
						title: 'Joined Date',
						value: this.state.user.joinDate.slice(0, 10),
						icon: <i class="fas fa-calendar-day" />
					},
					{ title: `${this.state.user.email}`, value: '', style: '2.5rem' },
					{
						title: 'Membership Expiration',
						value:
							this.props.user.accessLevel < membershipStatus.MEMBER
								? 'Not Valid'
								: this.state.user.membershipValidUntil.slice(0, 10),
						icon: <i class="fas fa-exclamation-triangle" />
					},
					{ title: '2D Prints', value: '', icon: <i class="fas fa-print" /> },
					{ title: 'Request 3D Printing', value: <PrintRequest />, icon: <i class="fas fa-cubes" /> },
					{ title: 'Connect with Discord', value: '', icon: <i class="fab fa-discord" /> },
					{ title: 'Change Password', value: <ChangePassword />, icon: <i class="fas fa-lock" /> }
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
			<div id="app">
				<Header {...this.headerProps} />

				<InfoCard fields={fields} user={{ ...this.state.user, token: this.props.user.token }} />
			</div>
		);
	}
}
