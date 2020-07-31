import React, { useState } from 'react';
import { Input, Button, Modal, ModalFooter, ModalBody } from 'reactstrap';
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
	const [ toggle, setToggle ] = useState(true);

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
		<div id="password-div">
			<Modal isOpen={toggle}>
				<h4 id="inner-text-top" style={{ marginTop: '10px' }}>
					<span className="password-span">
						<b>New Password: </b>
					</span>
					<Input
						onChange={(e) => {
							setUser(props.user);
							setPassword(e.target.value);
						}}
						type="password"
						style={{ margin: '1rem', width: '75%', border: '2px solid #b5b5b5' }}
					/>
				</h4>
				<h4 id="inner-text-top">
					<span className="password-span">
						<b>Confirm Password: </b>
					</span>
					<Input
						onChange={(e) => {
							setUser(props.user);
							setConfirmPass(e.target.value);
						}}
						type="password"
						style={{ margin: '1rem', width: '75%', border: '2px solid #b5b5b5' }}
					/>
				</h4>

				<ModalFooter>
					<Button
						id="changePasswd"
						color="info"
						style={
							(buttonStyle(),
							{
								background: '#0779e4',
								marginRight: '1rem',
								border: 'none',
								fontSize: '1.5rem',
								fontWeight: 'bolder'
							})
						}
						onClick={() => {
							changePassword();
						}}>
						Change Password
					</Button>
					<Button
						onClick={() => {
							setToggle(!toggle);
						}}
						style={{ background: '#eb4559', border: 'None', fontSize: '1.5rem', fontWeight: 'bolder' }}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}
