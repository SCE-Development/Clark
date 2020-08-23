import React, { useState } from 'react';

import './profile-modifier.css';

export default function ProfileCard(props) {
	const [ toggle, setToggle ] = useState(false);

	function itemClicked() {
		if (props.field.function) {
			props.field.function();
		}
		setToggle(!toggle);
	}
	return (
		<div onClick={() => itemClicked()}>
			<div key={props.field.title} className="box">
				<span id="icon">{props.field.icon}</span>

				<h3 id="inner-text-top">
					<b style={props.field.style ? { fontSize: props.field.style } : { fontSize: '' }}>
						{props.field.title}{' '}
					</b>

					{toggle === true ? <span id="value-span">{props.field.value}</span> : ''}
				</h3>
			</div>
		</div>
	);
}
