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

	function itemClicked(id) {
		if (id === 5) {
			window.location.href = '/2DPrinting';
		} else {
			setState({ ...state, [id]: { clicked: state[id] ? !state[id].clicked : true } });
		}
	}
	return (
		<div id="enclose">
			<div id="profile-box">
				{props.fields.map((field, ind) => (
					<div key={ind} className="box" onClick={() => itemClicked(ind)}>
						<span id="icon" style={{ fontSize: '3.8rem' }}>
							{field.icon}
						</span>

						<h3 id="inner-text-top" style={{ fontSize: '2.2rem', marginTop: '0.2rem' }}>
							<b style={field.style ? { fontSize: field.style } : { fontSize: '' }}> {field.title} </b>

							{state[ind] && state[ind].clicked ? (
								<span id="value-span" style={{ fontSize: '2rem', fontWeight: '500' }}>
									{/* className={field.value && field.value.includes('Valid') ? 'invalid' : ''}> */}

									{field.value}
								</span>
							) : (
								''
							)}
						</h3>
					</div>
				))}
			</div>
			<Footer />
		</div>
	);
}
