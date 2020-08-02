import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import './profile-modifier.css';
import { search3DPrintRequests } from '../../../APIFunctions/3DPrinting';

export default function PrintRequest(props) {
	const [ toggle, setToggle ] = useState(true);
	const [ requests, setRequests ] = useState([]);

	async function updateRequests() {
		const requestResult = await search3DPrintRequests(props.email);
		if (!requestResult.error) {
			setRequests(requestResult.responseData);
		}
	}

	return (
		// <Button
		// onClick={async () => {
		// 	await updateRequests();
		// 	setToggle(!toggle);
		// }}
		// 	color="primary"
		// 	id="printing-request-button">
		// 3D Printing Requests
		<Modal isOpen={toggle}>
			<ModalHeader>Your Requests, come to Engr294 for Pick-up</ModalHeader>
			<ModalBody>
				{requests.map(
					(request, ind) =>
						requests.length > 0 ? (
							<div key={ind}>
								<a href={request.projectLink}>Request</a> on{' '}
								{request.date && request.date.substring(0, 10) + ' '}
								for {request.projectType + '; '}
								Progress: {request.progress}
							</div>
						) : (
							<div key={ind}>You don't have any</div>
						)
				)}
				<a href="/3DPrintingForm">Make a Request</a>
			</ModalBody>
			<ModalFooter>
				<Button
					onClick={() => {
						setToggle(!toggle);
					}}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
		// </Button>
	);
}
