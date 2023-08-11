import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from 'reactstrap';
import Header from '../../Components/Header/Header';
import { checkIfUserSubscribed, setUserEmailPreference } from '../../APIFunctions/User'

function UnsubscribePage(props) {

  const [subscribed, setSubscribed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [failure, setFailure] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get('user');

  const toggleRadio = () => {
    setSubscribed(!subscribed)
  }

  const handleSubmit = async () => {
    setSubmitted(true);
    let status = await setUserEmailPreference(email, subscribed);
    setFailure(status.error);
  }

  useEffect(() => {
    checkIfUserSubscribed(email)
      .then((res) => {
        setSubscribed(res.responseData.subscribed);
        setFirstName(res.responseData.firstName);
        setLastName(res.responseData.lastName);
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <div>
      <Header title="Email Preferences" />
      <Container>
        <h3>Hello {firstName} {lastName}</h3>
        <Row>
          <Col>
            <p>Opt into SCE club updates by email?:</p>
          </Col>
          <Col>
            <Button onClick={() => toggleRadio()}>{subscribed ? '☑' : '□'}</Button>
            <Button color="primary" title="Submit" onClick={() => handleSubmit()}>Submit</Button>
          </Col>
          <Col>
            {submitted && !failure ?
              <p color='#4E6'>Successfully changed preferences!</p>
              :
              <p></p>
            }
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default UnsubscribePage;
