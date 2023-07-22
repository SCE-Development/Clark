import React, {useState} from 'react';
import './AdminDashboard.css';
import Header from '../../../Components/Header/Header';
import { Button } from 'reactstrap';
import { getAllUserSubscribedAndVerified } from '../../../APIFunctions/User';

function AdminDashboard(props) {
  const [buttonText, setButtonText] = useState('Send Unsubscribe Email to All');
  const [buttonColor, setButtonColor] = useState('');

  const handleButtonClick = async () => {
    let status = await getAllUserSubscribedAndVerified(props.token);
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
    <div className='flexbox-container'>
      <body className='admin-dashboard-bg'>
        <Header title='Admin Dashboard'></Header>
        <p style={{
          color: 'white',
          textAlign: 'center',
        }}>
          This button sends an email to all users that have a verified
          email are opted in to the email list.<br/>
          The email will send them a link to where they can
          unsubscribe from the email list.
        </p>
        <Button onClick={handleButtonClick} style={{ backgroundColor: buttonColor }}>
          {buttonText}
        </Button>
      </body>
    </div>
  );
}

export default AdminDashboard;
