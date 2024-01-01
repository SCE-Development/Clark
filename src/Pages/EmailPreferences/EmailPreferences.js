import React, { useEffect, useState } from 'react';
import {
  Container,
  Input,
  Button,
  Row,
  Col,
  Label,
} from 'reactstrap';

import { setUserEmailPreference, getUserData } from '../../APIFunctions/User';

export default function EmailPreferencesPage(props) {
  const BLUE = '#2d75eb';
  const GREEN = '#1cc75b';
  const RED = '#cf533a';
  const [isOptedIntoEmails, setIsOptedIntoEmails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [buttonColor, setButtonColor] = useState(BLUE);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [message, setMessage] = useState('Submit');

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userEmailParam = urlParams.get('user');
      setUserEmail(userEmailParam);
      if (!userEmailParam) {
        window.location = window.location.origin;
      } else {
        const response = await getUserData(urlParams.get('user'));
        if (!response.error) {
          setUserFirstName(response.responseData.firstName);
          setUserLastName(response.responseData.lastName);
          setIsOptedIntoEmails(response.responseData.emailOptIn);
        } else {
          setErrorLoading(true);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const response = await setUserEmailPreference(
      userEmail,
      isOptedIntoEmails
    );
    if (!response.error) {
      setMessage('Yay! You changed your email preference!');
      setButtonColor(GREEN);
      setTimeout(() => {
        setButtonColor(BLUE);
        setMessage('Submit');
      }, 3000);
    } else {
      setButtonColor(RED);
      setMessage('Unable to submit your preference, try reloading? :(');
    }
  };

  if (errorLoading) {
    return (
      <div className='email-preferences'>
        {/*
          dumb hacks because the navbar otherwise covers up the below content
        */}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Container
          style={{
            textAlign: 'center',
          }}
        >
          <h3>
            The email page was unable to load at this time.
          </h3>
          <h4>

            If the problem persists after reloading this page, please contact us on Discord
            (<a href='https://discord.gg/KZCKCEz5YA'>invite link</a>)
          </h4>
        </Container>
      </div>
    );
  }

  return (
    <div className='email-preferences'>
      <Container
        style={{
          textAlign: 'center',
        }}
      >
        {!loading && <>
          <h1>
            Hello {userFirstName} {userLastName},
          </h1>
          <p>
            What would you like to hear about?
          </p>
          <Col>
            <Row>
              <Label check>
                <Input
                  type='radio'
                  name='radio1'
                  checked={isOptedIntoEmails}
                  onChange={() => setIsOptedIntoEmails(true)}
                />
                {' '}I would like to continue to recieve club update emails from SCE
              </Label>
            </Row>
            <Row>
              <Label check>
                <Input
                  type='radio'
                  name='radio1'
                  checked={!isOptedIntoEmails}
                  onChange={() => setIsOptedIntoEmails(false)}
                />
                {' '}No thanks, I would like to unsubscribe from all emails (best choice)
              </Label>
            </Row>
            <Row className='email-submit-btn'>
              <Button
                style={{
                  backgroundColor: buttonColor,
                }}
                onClick={handleSave}
              >
                {message}
              </Button>
            </Row>
          </Col>
        </>}
      </Container>
    </div>
  );
}
