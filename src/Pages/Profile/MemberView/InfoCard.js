import React, { useState } from 'react';
import { Input, Button } from 'reactstrap';
import './profile-modifier.css';
import Footer from '../../../Components/Footer/Footer.js';
import PrintRequest from './PrintRequest';
import { editUser } from '../../../APIFunctions/User';
const pic = require('./getPicBySeason');
const bcrypt = require('bcryptjs');

export default function ProfileCard(props) {
	const [ password, setPassword ] = useState('New Password');
	const [ confirmPass, setConfirmPass ] = useState('Confirming New Password');
	const [ user, setUser ] = useState('');

	const [ state, setState ] = useState({});

	// async function changePassword() {
	// 	// hash pass
	// 	const salt = bcrypt.genSaltSync(10);
	// 	const hashedPassword = password.trim() === '' ? user.password : bcrypt.hashSync(password, salt);

	// 	if (password === confirmPass) {
	// 		const apiResponse = await editUser(
	// 			{
	// 				...user,
	// 				password: hashedPassword
	// 			},
	// 			user.token
	// 		);
	// 		if (!apiResponse.error) {
	// 			setPassword('');
	// 			window.alert('Success!!');
	// 		}
	// 	}
	// }

	// function buttonStyle() {
	// 	let style = { marginTop: '10px' };
	// 	password === confirmPass
	// 		? (style = {
	// 				...style,
	// 				color: 'white'
	// 			})
	// 		: (style = {
	// 				...style,
	// 				color: 'grey',
	// 				cursor: 'not-allowed'
	// 			});
	// 	return style;
	// }

	function itemClicked(id) {
		setState({ ...state, [id]: { clicked: state[id] ? !state[id].clicked : true } });
	}
	return (
		<div id="enclose">
			<div id="profile-box">
				{props.fields.map((field, ind) => (
					<div key={ind} id="box" onClick={() => itemClicked(ind)}>
						<h3 id="inner-text-top">
							<b> {field.title} </b>

							{state[ind] && state[ind].clicked ? (
								<span id="value-span">
									{/* className={field.value && field.value.includes('Valid') ? 'invalid' : ''}> */}
									{field.value}
								</span>
							) : (
								''
							)}
						</h3>
					</div>
				))}

				{/* <div>
					<h3 id="inner-text-top">
						New Password:{' '}
						<Input
							onChange={(e) => {
								setUser(props.user);
								setPassword(e.target.value);
							}}
							type="password"
						/>
					</h3>
					<h3 id="inner-text-top">
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
							style={buttonStyle()}
							onClick={() => {
								changePassword();
							}}>
							Change Password
						</Button>
						<div>
							<PrintRequest email={props.user.email} />
						</div>
					</h3>
				</div> */}
			</div>
			<Footer />
		</div>
	);
}
