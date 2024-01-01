import React, { useState } from 'react';

import { Button, Container } from 'reactstrap';
import { getAllUserSubscribedAndVerified } from '../../../APIFunctions/User';

function AdminDashboard(props) {
  const [buttonText, setButtonText] = useState('Send Unsubscribe Email to All');
  const [buttonColor, setButtonColor] = useState('');

  const handleButtonClick = async () => {
    let status = await getAllUserSubscribedAndVerified(props.user.token);
    if (status.responseData === 'OK') {
      setButtonText('Successfully sent unsubscribe emails!');
      setButtonColor('green');
      setTimeout(() => {
        setButtonText('Send Unsubscribe Email to All');
        setButtonColor('');
      }, 3000);
    }
  };

  return (
    <div className='admin-dashboard-bg' style={{ width: '100%', color: 'white' }}>
      <Header title='Send Unsubscribe Emails'></Header>
      <Container>
        <div style={{ width: '60%', margin: 'auto' }}>
          <h1>
          What does clicking this button do?
          </h1>
          <p>
            Sends a request to the backend to allow all eligible users to
            unsubscribe from club update emails.
          </p>
          <p>
            The server finds all accounts with emails that are have verified
            emails and are opted into club updates.
          </p>
          <p>
            For each email satisfying the above condition, an email is sent
            to each user with a link to a page where they can manage their preferences.
          </p>
        </div>
        <div style={{ margin: 'auto', width: '30%' }}>
          <Button onClick={handleButtonClick} style={{ backgroundColor: buttonColor }}>
            {buttonText}
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default AdminDashboard;
