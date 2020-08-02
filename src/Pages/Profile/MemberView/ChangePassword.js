import React, { useState } from 'react';
import { Input, Button } from 'reactstrap';
import './profile-modifier.css';
import Footer from '../../../Components/Footer/Footer.js';
import PrintRequest from './PrintRequest';
import { editUser } from '../../../APIFunctions/User';
const pic = require('./getPicBySeason');
const bcrypt = require('bcryptjs');

export default function ChangePassword(props) {
	const [ password, setPassword ] = useState('New Password');
	const [ confirmPass, setConfirmPass ] = useState('Confirming New Password');
	const [ user, setUser ] = useState('');

	async function changePassword() {
		// hash pass
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = password.trim() === '' ? user.password : bcrypt.hashSync(password, salt);

		if (password === confirmPass) {
			const apiResponse = await editUser(
				{
					...user,
					password: hashedPassword
				},
				user.token
			);
			if (!apiResponse.error) {
				setPassword('');
				window.alert('Success!!');
			}
		}
	}

	function buttonStyle() {
		let style = { marginTop: '10px' };
		password === confirmPass
			? (style = {
					...style,
					color: 'white'
				})
			: (style = {
					...style,
					color: '#333333',
					cursor: 'not-allowed'
				});
		return style;
	}

	return (
		<div>
			<h4 id="inner-text-top" style={{ marginTop: '10px' }}>
				New Password:{' '}
				<Input
					onChange={(e) => {
						setUser(props.user);
						setPassword(e.target.value);
					}}
					type="password"
				/>
			</h4>
			<h4 id="inner-text-top">
				Confirm Password:{' '}
				<Input
					onChange={(e) => {
						setUser(props.user);
						setConfirmPass(e.target.value);
					}}
					type="password"
				/>
				<Button
					id="changePasswd"
					color="info"
					style={(buttonStyle(), { background: '#02C39A', marginTop: '10px', border: 'none' })}
					onClick={() => {
						changePassword();
					}}>
					Change Password
				</Button>
				{/* <div>
					<PrintRequest email={props.user.email} />
				</div> */}
			</h4>
		</div>
	);
}
