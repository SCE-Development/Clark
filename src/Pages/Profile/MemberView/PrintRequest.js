import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import './profile-modifier.css';
import { search3DPrintRequests } from '../../../APIFunctions/3DPrinting';

export default function PrintRequest(props) {
  const [toggle, setToggle] = useState(true);
  const [requests, setRequests ] = useState([]);

  async function updateRequests() {
    const requestResult = await search3DPrintRequests(props.email);
    if (!requestResult.error) {
      setRequests(requestResult.responseData);
    }
  }

  useEffect(() => {
    if(toggle)
      updateRequests();
  });

  return (
    <Modal isOpen={toggle} id='profile'>
      <ModalHeader>Your Requests</ModalHeader>
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
        {requests.length > 0 && <hr className='hr'/>}
        <div id='printing-pickup'>Come to Engr294 for Pick-up</div>
      </ModalBody>
      <ModalFooter>
        <Button id='three-print-request-button' href='/3DPrintingForm'>
					Make a Request
        </Button>
        <Button
          id='three-print-close-button'
          onClick={() => {
            setToggle(!toggle);
          }}>
					Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
