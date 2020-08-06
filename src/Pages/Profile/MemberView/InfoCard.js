import React, { useState } from 'react';
import { Input, Button } from 'reactstrap';
import './profile-modifier.css';
import Footer from '../../../Components/Footer/Footer.js';
import PrintRequest from './PrintRequest';
import { editUser } from '../../../APIFunctions/User';
import { connectToDiscord } from '../../../APIFunctions/User';
const pic = require('./getPicBySeason');
const bcrypt = require('bcryptjs');

export default function ProfileCard(props) {
	const [password, setPassword] = useState('New Password');
	const [confirmPass, setConfirmPass] = useState('Confirming New Password');
	const [user, setUser] = useState('');
	const [toggle, setToggle] = useState(false);

	function itemClicked() {
		// } else if (id === 7) {
		// 	props.handleDiscordAuth();
		// } else {
		// 	setState({
		// 		...state,
		// 		[id]: {
		// 			clicked: state[id] ? !state[id].clicked : true
		// 		}
		// 	});
		// }
		if (props.field.function) {
			props.field.function();
		}
		setToggle(!toggle);
	}
	return (
		<div onClick={() => itemClicked()}>
			{/* {props.fields ? (
					props.fields.map((field, ind) => ( */}
			<div key={props.field.title}
				className="box"
			>
				<span id="icon" style={{ fontSize: '3.8rem' }}>
					{props.field.icon}
				</span>

				<h3
					id="inner-text-top"
					style={{
						fontSize: '2.2rem',
						marginTop: '0.2rem'
					}}>
					<b style={props.field.style ?
						{ fontSize: props.field.style } : { fontSize: '' }}>
						{props.field.title}{' '}
					</b>

					{toggle == true ? (
						<span
							id="value-span"
							style={{
								fontSize: '2rem',
								fontWeight: '500'
							}}>
							{props.field.value}
						</span>
					) : (
							''
						)}
				</h3>
			</div>
		</div>
	);
}
